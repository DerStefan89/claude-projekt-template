/**
 * Datei: .claude/hooks/commit-guard.js
 *
 * Zweck: PreToolUse-Hook auf Bash. Drei Aufgaben:
 * 1. Verweigert `git commit` / `git push`, außer eine frische Freigabe-Datei
 *    (state/freigabe-commit.md, Frischefenster 10 Minuten) liegt vor. Bei
 *    gültiger Freigabe: Datei löschen, Befehl durchlassen — eine Freigabe
 *    gilt für genau einen Commit.
 * 2. Verweigert jeden Bash-Befehl, der `.claude/settings.json` referenziert
 *    (schließt die Bash-Lücke von guard-settings.js).
 * 3. Verweigert jeden Bash-Befehl, der `state/freigabe-commit.md`
 *    referenziert — schützt den zweiten Schlüssel selbst vor Lese-,
 *    Schreib- oder Löschzugriff über Bash.
 *
 * Bewusste Abweichung von der Fail-Open-Konvention der übrigen Hooks in
 * diesem Repo (siehe Kopfkommentar zwischenstand-laden.js): Ein Guard, der
 * bei Störung (unlesbares JSON, fehlendes tool_input.command) durchlässt,
 * ist kein Guard. Dieser Hook verweigert stattdessen — fail-closed.
 *
 * Bekannte Grenze: Das Muster für `git commit`/`git push` ist breit, nicht
 * exakt (Befehlstext enthält `git` UND `commit`/`push`, je als
 * eigenständiges Wort, irgendwo im String). Bei einer freien Shell
 * (Variablen, Aliase, kodierte Befehle) ist die Lücke nicht vollständig zu
 * schließen — dokumentiert in state/plan-v2-phase1-vertraege.md, Vertrag 2,
 * als offene Unsicherheit.
 *
 * Dekodierung und Zeitstempel-Parsen sind als eigene, reine Funktionen
 * ausgelagert und über module.exports verfügbar. Grund: Die Freigabe-Datei
 * ist für das Modell absichtlich unerreichbar (siehe Blockliste oben) —
 * ein Bash-Aufruf, der `state/freigabe-commit.md` referenziert, wird
 * verweigert, bevor der Hook sie je läse. Ein Ende-zu-Ende-Test des
 * Kodierungsfalls über einen echten Git-Befehl ist deshalb aus der
 * Modell-Seite nicht möglich; die beiden reinen Funktionen sind die
 * einzige Ebene, auf der genau dieser Fall kalibrierbar ist.
 */
const fs = require("fs");
const path = require("path");

const FREIGABE_DATEI = "state/freigabe-commit.md";
const FRISCHEFENSTER_MINUTEN = 10;
const BEISPIEL_FORMAT =
  'Format: "Freigegeben: <ISO-Zeitstempel>", z. B. ' +
  '"Freigegeben: 2026-08-17T14:03:00" (Ortszeit, ohne Offset), ' +
  '"Freigegeben: 2026-08-17T14:03:00+02:00" (mit Offset) oder ' +
  '"Freigegeben: 2026-08-17T12:03:00Z" (UTC).';

/**
 * Buffer -> Text. Erkennt UTF-8-BOM (abschneiden) und UTF-16 LE/BE
 * (an der Byte-Order-Mark erkennbar, BE wird auf LE zurückgetauscht, da
 * Node keinen nativen utf16be-Decoder mitbringt). Ohne erkennbare BOM:
 * UTF-8.
 */
function dekodiereFreigabeInhalt(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    return buffer.subarray(3).toString("utf8");
  }

  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.subarray(2).toString("utf16le");
  }

  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    const payload = buffer.subarray(2);
    const vertauscht = Buffer.alloc(payload.length);
    for (let i = 0; i + 1 < payload.length; i += 2) {
      vertauscht[i] = payload[i + 1];
      vertauscht[i + 1] = payload[i];
    }
    return vertauscht.toString("utf16le");
  }

  return buffer.toString("utf8");
}

/**
 * Text -> Date oder null. Sucht "Freigegeben: <ISO-Zeitstempel>" am
 * Zeilenanfang (Anker `^` und `m`-Flag bewusst unverändert — sonst
 * matcht jede Fließtextzeile mit dem Wort "Freigegeben"). Optionaler
 * Zeitzonen-Offset (`Z`, `+hh:mm`, `-hh:mm`, auch ohne Doppelpunkt) wird
 * mit erfasst; fehlt er, bleibt die bisherige Ortszeit-Interpretation von
 * `new Date(...)` unverändert. Optionale Sekundenbruchteile beliebiger
 * Länge (`.123`, `.123456`, `.1234567`, je nach Quelle — `toISOString()`,
 * Python, PowerShell, `date -u -Ins` liefern unterschiedlich viele Stellen)
 * werden ebenfalls erfasst — sonst dieselbe Fehlerklasse wie B2:
 * abgeschnittener Suffix, Rest fälschlich als Ortszeit gelesen.
 */
function parseFreigabeZeitstempel(text) {
  const treffer = text.match(
    /^Freigegeben:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)/m
  );
  if (!treffer) {
    return null;
  }

  let iso = treffer[1];
  const offsetOhneDoppelpunkt = iso.match(
    /^(.*\d{2}:\d{2}(?::\d{2})?)([+-]\d{2})(\d{2})$/
  );
  if (offsetOhneDoppelpunkt) {
    iso = `${offsetOhneDoppelpunkt[1]}${offsetOhneDoppelpunkt[2]}:${offsetOhneDoppelpunkt[3]}`;
  }

  const zeitstempel = new Date(iso);
  if (isNaN(zeitstempel.getTime())) {
    return null;
  }
  return zeitstempel;
}

function verweigern(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

function verarbeiten(input) {
  let eingabe;
  let command;
  try {
    eingabe = JSON.parse(input);
    command = eingabe.tool_input?.command;
  } catch {
    verweigern(
      "commit-guard: Eingabe nicht lesbar — fail-closed, Befehl verweigert."
    );
    return;
  }

  if (typeof command !== "string" || command.length === 0) {
    verweigern(
      "commit-guard: kein Befehlstext gefunden — fail-closed, Befehl verweigert."
    );
    return;
  }

  const normalisiert = command.replace(/\\/g, "/");

  if (normalisiert.includes(".claude/settings.json")) {
    verweigern(
      "commit-guard: Bash-Zugriff auf geteilte .claude/settings.json blockiert. " +
        "Die Datei ist Team-Policy und wird nur vom Menschen im eigenen Editor geändert."
    );
    return;
  }

  if (normalisiert.includes(FREIGABE_DATEI)) {
    verweigern(
      "commit-guard: Bash-Zugriff auf state/freigabe-commit.md blockiert. " +
        "Der zweite Schlüssel darf nicht vom Modell gelesen, geschrieben oder gelöscht werden."
    );
    return;
  }

  // Wortgrenze bewusst auf Shell-typische Trenner eingeschränkt, nicht auf
  // jedes Nicht-Wortzeichen (\b): Sonst matcht "commit" auch als Bindestrich-
  // Segment in Pfaden/Branchnamen wie "test/commit-guard-calibration" —
  // ein Blocker, der nichts mit einem echten Commit-Befehl zu tun hat.
  const GRENZE_VOR = '(^|[\\s"\'`;&|()])';
  const GRENZE_NACH = '($|[\\s"\'`;&|()])';
  const istGitBefehl = new RegExp(GRENZE_VOR + "git" + GRENZE_NACH).test(command);
  const istCommitOderPush = new RegExp(
    GRENZE_VOR + "(commit|push)" + GRENZE_NACH
  ).test(command);

  if (!istGitBefehl || !istCommitOderPush) {
    process.exit(0);
    return;
  }

  const cwd = eingabe.cwd || process.cwd();
  const dateiPfad = path.join(cwd, FREIGABE_DATEI);

  let rohBuffer;
  try {
    rohBuffer = fs.readFileSync(dateiPfad);
  } catch {
    verweigern(
      `commit-guard: git commit/push ohne Freigabe-Datei (${FREIGABE_DATEI}) verweigert. ` +
        `Freigabe im eigenen Editor anlegen. ${BEISPIEL_FORMAT}`
    );
    return;
  }

  const inhalt = dekodiereFreigabeInhalt(rohBuffer);
  const zeitstempel = parseFreigabeZeitstempel(inhalt);

  if (!zeitstempel) {
    verweigern(
      `commit-guard: ${FREIGABE_DATEI} hat keine gültige Zeile "Freigegeben: <ISO-Zeitstempel>" — verweigert. ${BEISPIEL_FORMAT}`
    );
    return;
  }

  const minutenAlt = (Date.now() - zeitstempel.getTime()) / 60000;
  if (minutenAlt < 0) {
    verweigern(
      `commit-guard: Zeitstempel in ${FREIGABE_DATEI} liegt in der Zukunft — Uhr oder Zeitzone prüfen — verweigert.`
    );
    return;
  }
  if (minutenAlt > FRISCHEFENSTER_MINUTEN) {
    verweigern(
      `commit-guard: Freigabe in ${FREIGABE_DATEI} ist ${Math.round(minutenAlt)} Minuten alt ` +
        `(Frischefenster ${FRISCHEFENSTER_MINUTEN} Minuten) — verweigert. Neue Freigabe anlegen.`
    );
    return;
  }

  try {
    fs.unlinkSync(dateiPfad);
  } catch {
    verweigern(
      `commit-guard: Freigabe-Datei ${FREIGABE_DATEI} konnte nicht gelöscht werden — ` +
        "fail-closed, Befehl verweigert, um Mehrfachverbrauch auszuschließen."
    );
    return;
  }

  process.exit(0);
}

if (require.main === module) {
  let input = "";
  process.stdin.on("data", (d) => (input += d));
  process.stdin.on("end", () => verarbeiten(input));
}

module.exports = { dekodiereFreigabeInhalt, parseFreigabeZeitstempel };
