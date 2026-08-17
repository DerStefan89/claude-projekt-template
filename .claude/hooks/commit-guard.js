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
 */
const fs = require("fs");
const path = require("path");

const FREIGABE_DATEI = "state/freigabe-commit.md";
const FRISCHEFENSTER_MINUTEN = 10;

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

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
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

  let inhalt;
  try {
    inhalt = fs.readFileSync(dateiPfad, "utf8");
  } catch {
    verweigern(
      `commit-guard: git commit/push ohne Freigabe-Datei (${FREIGABE_DATEI}) verweigert. ` +
        'Freigabe im eigenen Editor anlegen: "Freigegeben: <ISO-Zeitstempel>".'
    );
    return;
  }

  const treffer = inhalt.match(
    /^Freigegeben:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?)/m
  );
  if (!treffer) {
    verweigern(
      `commit-guard: ${FREIGABE_DATEI} hat keine gültige Zeile "Freigegeben: <ISO-Zeitstempel>" — verweigert.`
    );
    return;
  }

  const zeitstempel = new Date(treffer[1]);
  if (isNaN(zeitstempel.getTime())) {
    verweigern(
      `commit-guard: Zeitstempel in ${FREIGABE_DATEI} nicht lesbar — verweigert.`
    );
    return;
  }

  const minutenAlt = (Date.now() - zeitstempel.getTime()) / 60000;
  if (minutenAlt > FRISCHEFENSTER_MINUTEN || minutenAlt < 0) {
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
});
