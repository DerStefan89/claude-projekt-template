<!-- Ziel-Pfad im Repo: state/gates.md -->
# Objective Gates — [PROJEKTNAME]

Jedes objektive (nicht-menschliche) Gate, das im Projekt läuft, mit
Kalibrierung: mindestens ein bekannter Fall, der es auslöst (rot), und
einer, der es nicht auslöst (grün). Ohne Kalibrierung ist ein Gate ein
ungeprüftes Versprechen.

| Gate | Datei | Prüft | Rot-Fall (bekannt) | Grün-Fall (bekannt) |
|---|---|---|---|---|
| Doku-Gate | `scripts/check-docs.mjs` | tote Verweise, Versionsnummern außerhalb package.json, Frische-Widerspruch in Einzeldokumenten, Frische-Widerspruch zwischen Dokumentenpaaren, Hedging-Wörter ohne Evidenz-Marker in state/Report-Dateien | Testzeile `React v19, siehe \`keine/existierende/datei.md\`` (temporär in CLAUDE.md eingefügt) → 2 Befunde: toter Verweis + Versionsnummer; echter Fund (kein Testfall) nach Erweiterung von Prüfung 1 auf `.claude/skills/*/SKILL.md` und `.claude/commands/*.md`: `.claude/skills/spec-schreiben/SKILL.md:88: Verweis auf \`state/triage.md\` — Datei existiert nicht` | CLAUDE.md:79 `npm run check` → Exit 0 löst keinen Versionsnummer-Befund aus; README.md:34 verweist auf `settings.local.json`, das per .gitignore absichtlich fehlt → kein Befund; nach Behebung von `spec-schreiben/SKILL.md:88` (Verweis auf `state/tasks/` umgebogen) → `npm run check` Exit 0, Doku-Check „Keine Befunde" |
| Regel-Gate | `scripts/check-rules.mjs` | projektspezifische AST-Regeln | (leer bis zur ersten Regel) | (leer bis zur ersten Regel) |
| Vertrags-Gate | `scripts/check-contract.mjs` | Handoff-Verträge in `state/tasks/` auf SCHRITT 0 (Präambel) und die acht Marker der sieben Sektionen (`## TASK:`, `GOAL:`, `CONTEXT:`, `SCOPE:`, `NICHT:`, `BUDGET:`, `OUTPUT:`, `ESCALATE:`) | Testdatei `state/tasks/_test-verstuemmelt.md` ohne `SCOPE:`/`NICHT:` (temporär, nicht committet) → 2 Befunde: „Marker \"SCOPE:\" fehlt", „Marker \"NICHT:\" fehlt", Exit 1 | Lauf gegen alle 5 echten Dateien in `state/tasks/` (`harness-fix-1…` bis `harness-fix-4…` plus `phase0-artefakte-committen.md`) → „5 Vertrag/Verträge geprüft, keine Befunde.", Exit 0 |
| CI | `.github/workflows/ci.yml` | `npm run check` auf frischer Maschine + Secret-Scan | [FÜLLUNG] | [FÜLLUNG] |
| Branch Protection | GitHub-Repo-Einstellung, kein Datei-Artefakt (siehe SETUP.md Punkt 1) | Required Status Check `check` vor Merge auf `main`, ohne Admin-Bypass | [FÜLLUNG] | [FÜLLUNG] |
| `guard-settings.js`-Hook | `.claude/hooks/guard-settings.js` | Edit/Write auf geteilte `.claude/settings.json` und `state/freigabe-commit.md` | Zwei reale Edit-Versuche über das Edit-Tool auf `.claude/settings.json`, 2026-08-17, im Rahmen eines Diagnose-Auftrags (vermuteter Durchschlupf sollte reproduziert werden) → beide korrekt verweigert, identische Meldung: „Schreibzugriff auf geteilte settings.json blockiert. Absichtliche Aenderung: Hook in .claude/settings.json (hooks.PreToolUse) temporaer entfernen, Grund im Commit nennen." Kein Durchschlupf reproduzierbar. | Edit-Versuch auf eine unbeteiligte Datei (Scratchpad, außerhalb des Repos), 2026-08-17 → lief ungehindert durch, keine Guard-Reaktion |
| `commit-guard.js`-Hook | `.claude/hooks/commit-guard.js` | `git commit`/`git push` ohne frische Freigabe-Datei (Zeitzone/Offset und BOM/UTF-16 gehärtet, siehe Kalibrierungs-Log 2026-08-17 „Härtung Vertrag 5"); Bash-Zugriff auf `.claude/settings.json`; Bash-Zugriff auf `state/freigabe-commit.md` | `git commit --allow-empty -m test` auf `test/commit-guard-calibration` ohne vorhandene Freigabe-Datei, ca. 2026-08-17T11:40 → abgewiesen ("git commit/push ohne Freigabe-Datei … verweigert"); derselbe Befehl erneut um 2026-08-17T11:54:54+02:00, unmittelbar nach Verbrauch der vorherigen Freigabe → wieder abgewiesen, gleiche Meldung; **Push-Pfad, Härtung Vertrag 5:** `git push` auf `test/guard-haertung-calibration` unmittelbar nach Commit `7559cef` (2026-08-17T20:58:08+02:00), ohne neue Freigabe → abgewiesen, gleiche Meldungsklasse — erster dokumentierter Rot-Fall für `push` im Repo | `git commit --allow-empty -m test` mit frischer, vom Menschen angelegter Freigabe-Datei (`Freigegeben: <ISO-Zeitstempel>`) → Commit `129cd01` um 2026-08-17T11:54:13+02:00 durchgegangen; `git status` direkt danach zeigt `state/freigabe-commit.md` nicht mehr — Einmal-Verbrauch bestätigt; **Push-Pfad, Härtung Vertrag 5:** `git push -u origin harness-fix/5-commit-guard-haerten` auf dem echten Arbeitsbranch, nach Commit `8d89041`, ca. 2026-08-17T22:12:29+02:00 (zweiter Versuch, mit frischer Freigabe; erster Versuch ohne `-u` scheiterte an fehlendem Upstream — siehe Kalibrierungs-Log) → durchgegangen, `git status` direkt danach zeigt „up to date with origin/harness-fix/5-commit-guard-haerten", Freigabe-Datei verbraucht |
| Zwischenstand-Loop | `.claude/hooks/zwischenstand-pruefen.js` (PreCompact), `.claude/hooks/zwischenstand-laden.js` (SessionStart) | Frische des Zwischenstands vor manueller Compaction; Laden des Zwischenstands nach Sitzungsstart/`/clear` | Zwischenstandsdatei mit `Zuletzt aktualisiert:` älter als 60 Minuten (`2026-08-17T08:00` bei Lauf um `11:14`) → `decision: block` bei `trigger: manual` | Zwischenstandsdatei mit frischem Zeitstempel (`2026-08-17T11:15`) → kein Block bei `trigger: manual`; SessionStart mit `source: clear` liefert den Dateiinhalt als `additionalContext` |

## Kalibrierungs-Log

Neue Kalibrierungs-Nachweise hier ergänzen (Datum, Gate, Beobachtung),
nicht die Tabelle oben stillschweigend überschreiben.

- 2026-08-08, Doku-Gate: Bekannte Einschränkung der .gitignore-Auswertung
  in Prüfung 1 — sie matcht auch auf den reinen Basisnamen, nicht nur auf
  den vollen Pfad. Ein Pflichtdokument mit demselben Dateinamen wie ein
  .gitignore-Eintrag würde dadurch stumm bleiben, selbst wenn es an
  anderer Stelle im Repo existieren müsste. Aktuell nur vier generische
  Einträge ohne Pfad/Wildcard (`.env`, `.env.local`, `.DS_Store`,
  `Thumbs.db`), keiner davon ein plausibles Pflichtdokument — Risiko
  latent. Erneut bewerten, sobald .gitignore um weitere generische
  Dateinamen ergänzt wird.

- 2026-08-17, Zwischenstand-Loop: Rot- und Grün-Fall von Hand durchgespielt
  (Aufruf der Hooks direkt über stdin, kein echter Compaction-/Clear-Lauf).
  Rot: `state/zwischenstand/harness-fix-1-hooks-und-zwischenstand.md` mit
  `Zuletzt aktualisiert: 2026-08-17T08:00`, Lauf um `11:14` Uhr,
  `{"trigger":"manual"}` → `zwischenstand-pruefen.js` liefert
  `{"decision":"block", ...}`. Grün: dieselbe Datei mit
  `Zuletzt aktualisiert: 2026-08-17T11:15` → derselbe Aufruf liefert keine
  Ausgabe (kein Block), Exit 0. Zusätzlich `zwischenstand-laden.js` mit
  `{"source":"clear"}` aufgerufen: Ausgabe enthält den Dateiinhalt als
  `additionalContext` — bestätigt, dass der SessionStart-Matcher (V1.1,
  `clear` ergänzt) den Zwischenstand nach `/clear` lädt. Testdatei war
  nicht committet (per `.gitignore`, Ausnahme nur für `VORLAGE.md`) und
  wurde nach dem Test gelöscht.

- 2026-08-17, `commit-guard.js`: Rot- und Grün-Fall auf echtem
  Wegwerf-Branch (`test/commit-guard-calibration`, von
  `harness-fix/2-commit-guard` abgezweigt, danach lokal gelöscht, nie
  gepusht) durchgespielt — kein Unit-Test über stdin, echter Aufruf über
  den verkabelten Hook-Pfad. Rot (Punkt 8): `git commit --allow-empty -m
  test` ohne vorhandene Freigabe-Datei, ca. 2026-08-17T11:40 → abgewiesen.
  Grün (Punkt 9): frische, vom Menschen im eigenen Editor angelegte
  `state/freigabe-commit.md` (`Freigegeben: <ISO-Zeitstempel>`) →
  derselbe Commit-Befehl läuft durch, Commit `129cd01` um
  2026-08-17T11:54:13+02:00; `git status` direkt danach bestätigt, dass
  die Freigabe-Datei durch den Hook gelöscht wurde. Rot, zweiter Teil
  (Einmal-Verbrauch): unmittelbar danach `git commit --allow-empty -m
  test2` ohne neue Freigabe, 2026-08-17T11:54:54+02:00 → wieder
  abgewiesen. Nebenbefund, kein Hook-Fehler: Zwei vorgelagerte Versuche
  scheiterten an der Freigabe-Datei selbst, nicht am Hook — einmal UTF-16
  statt UTF-8, einmal UTF-8-BOM (Node `fs.readFileSync(..., "utf8")`
  entfernt ein BOM nicht automatisch, wodurch `^Freigegeben` am
  Zeilenanfang nicht mehr matcht). Beide Male neu in VS Code als reines
  UTF-8 ohne BOM gespeichert, danach lief der Grün-Fall durch. Zeitstempel
  von Punkt 8 ist eine Schätzung aus der Rückschau (kein Git-Artefakt, da
  der abgewiesene Commit keinen Hash hinterlässt), alle übrigen
  Zeitstempel sind belegt (Commit-Zeitstempel bzw. Tool-Aufrufzeit dieser
  Konversation).

- 2026-08-17, Doku-Gate, Prüfung 1 erweitert um `.claude/skills/*/SKILL.md`
  und `.claude/commands/*.md`: Rot- und Grün-Fall sind kein konstruierter
  Testfall, sondern der reale Zustand des Repos zum Zeitpunkt der
  Erweiterung. Rot (vor der Behebung): `npm run check` → Exit 1, Doku-Check
  meldet genau einen Befund — `.claude/skills/spec-schreiben/SKILL.md:88:
  Verweis auf \`state/triage.md\` — Datei existiert nicht`. Grün (nach der
  Behebung): Zeile 88 in `spec-schreiben/SKILL.md` auf `state/tasks/`
  umgebogen (Entscheidung Punkt E, `state/plan-v2-phase1-vertraege.md`) →
  `npm run check` → Exit 0, Doku-Check „Keine Befunde".

- 2026-08-17, Doku-Gate, Prüfung 2 (Versionsnummern-Muster) probeweise
  gegen `.claude/skills/*/SKILL.md` und `.claude/commands/*.md` laufen
  lassen — per Wegwerf-Skript (`test-pruefung2.mjs`, nicht committet,
  `check-docs.mjs` selbst unverändert). Ergebnis: 8 Dateien geprüft, 9
  Treffer — deckt sich in der Gesamtzahl mit der Erwartung aus
  `state/plan-v2-phase1-vertraege.md` (Abschnitt „Warum nur Prüfung 1").
  Zusammensetzung weicht in einem Punkt von der dortigen Vorhersage ab, was
  hier ehrlich statt geglättet festgehalten wird: 7 Treffer enthalten
  wörtlich „Plan v1" oder „Plan v2" (`advisor-pass/SKILL.md:3` ×2,
  `:31`, `:70`, `:107`, `spec-schreiben/SKILL.md:71` ×2) — das deckt sich
  mit der Vorhersage. Der 8. Treffer ist der erwartete Versionspin der
  vendorten `ponytail`-Datei (`ponytail/SKILL.md:20: "v4.8.4"`). Der 9.
  Treffer ist aber kein zweiter ponytail-Treffer, sondern ein eigenständiger
  Fehlalarm: `advisor-pass/SKILL.md:71: "Wer v1"` — Prüfung 2s zweites
  Muster (großgeschriebenes Wort + Versionszahl) greift hier am Satzanfang
  „Wer v1 überschreibt, …". Ergebnis stützt die Entscheidung aus Punkt D/
  „Warum nur Prüfung 1" sogar stärker als vorhergesagt: Prüfung 2 träfe auf
  Skills nicht nur den Kernbegriff „Plan v1/v2" und den absichtlichen
  ponytail-Pin, sondern zusätzlich mindestens einen strukturellen
  Fehlalarm aus normaler deutscher Satzstellung — ein weiterer Beleg dafür,
  dass Prüfung 2 dort strukturell unbrauchbar ist, nicht nur an einem
  Einzelfall hängt.

- 2026-08-17, CI/gitleaks: Vertrag `harness-fix-3-dokugate-und-ci` sollte
  vor dem Entfernen von `--no-git` (und Ergänzen von `fetch-depth: 0`) die
  Stop-Grenze aus F2 (`state/plan-v2-phase1-vertraege.md`) auslösen — ein
  lokaler gitleaks-Lauf über die volle Historie (`--source .`, ohne
  `--no-git`). Weder `docker` noch ein eigenständiges `gitleaks`-Binary
  waren auf der Baumaschine verfügbar (geprüft über Bash-PATH und
  Windows-PATH, `docker --version` → command not found, `where.exe
  gitleaks` → keine Treffer). Die Stop-Grenze wurde deshalb **nicht**
  ausgeführt — nicht stillschweigend übersprungen. `ci.yml` behält
  `--no-git` und den impliziten Shallow-Checkout (kein `fetch-depth`); nur
  das Image-Pinning (`v8.30.1`) und `permissions: contents: read` wurden
  umgesetzt. Offener Folgeschritt vor einer künftigen Entfernung von
  `--no-git`: den vollen Historien-Scan auf einer Maschine mit Docker oder
  gitleaks-Binary nachholen.

- 2026-08-17, Vertrags-Gate (`scripts/check-contract.mjs`, Vertrag
  `harness-fix-4-pruefkette-und-vertragspruefung`): Rot-Fall über eine
  absichtlich verstümmelte, nicht committete Testdatei
  `state/tasks/_test-verstuemmelt.md` (SCHRITT 0 und alle Marker außer
  `SCOPE:`/`NICHT:` vorhanden) → `node scripts/check-contract.mjs` meldet
  genau 2 Befunde („Marker \"SCOPE:\" fehlt", „Marker \"NICHT:\" fehlt"),
  Exit 1. Testdatei direkt danach wieder entfernt, taucht in keinem
  `git status` dieser Sitzung als gestaged auf. Grün-Fall: derselbe Lauf
  gegen die zu diesem Zeitpunkt fünf echten Dateien in `state/tasks/`
  (`harness-fix-1-hooks-und-zwischenstand.md`,
  `harness-fix-2-commit-guard.md`, `harness-fix-3-dokugate-und-ci.md` —
  Nachtrag aus diesem Vertrag —, `harness-fix-4-pruefkette-und-
  vertragspruefung.md` — dieser Vertrag selbst — sowie die themenfremde
  `phase0-artefakte-committen.md`, die zufällig ebenfalls dem
  Vertragsformat entspricht) → „5 Vertrag/Verträge geprüft, keine
  Befunde.", Exit 0. Beide Fehlerpfade (fehlendes `state/tasks/`, leeres
  `state/tasks/`) sind in der Mechanik behandelt, aber am realen Repo
  nicht auslösbar gewesen, da `state/tasks/` bereits nicht-leer existiert
  — Codepfad durch Lesen bestätigt (`scripts/check-contract.mjs`, oberer
  Teil), nicht durch einen realen Lauf.

- 2026-08-17, `npm run check` vs. `npm run check:template`: Vor der
  Umstellung (Ausgangsstand) `npm run check` → Exit 0 (alle Skripte
  Platzhalter). Nach Umstellung von `lint`/`typecheck`/`test` auf
  `stderr`-Meldung + `exit 1`: `npm run check:template`
  (`check-docs.mjs && check-rules.mjs && check-contract.mjs`) → Exit 0.
  `npm run check` (volle Kette inklusive `lint`) → bricht bereits bei
  `lint` mit Exit 1 und der Meldung „lint: kein Linter ausgewählt — siehe
  SETUP.md Punkt 3 (Skill werkzeug-auswahl)" ab; `typecheck` und `test`
  einzeln aufgerufen liefern die analoge Meldung mit ihrem jeweiligen
  Namen, ebenfalls Exit 1.

- 2026-08-17, `guard-settings.js`-Hook, Diagnose-Auftrag: Ein zuvor
  vermuteter Durchschlupf (ein echter Edit-Versuch auf
  `.claude/settings.json` soll nicht verweigert worden sein) ließ sich mit
  zwei realen Edit-Versuchen über das Edit-Tool nicht reproduzieren — beide
  korrekt verweigert. Ursache des ursprünglich beobachteten Vorfalls bleibt
  offen, nicht spekuliert. Ergänzend ein realer Grün-Fall (Edit auf eine
  unbeteiligte Datei außerhalb des Repos, lief ungehindert durch) und die
  Korrektur der „Prüft"-Spalte auf beide von Vertrag 2 geschützten Dateien.

- 2026-08-17, `commit-guard.js`-Hook, Härtung (Vertrag
  `harness-fix-5-commit-guard-haerten`): Zeitzone/Offset, BOM/UTF-16 und
  drei Fehlermeldungen gehärtet (SCOPE Punkte 1–4). Kalibrierung in vier
  Teilen:
  **Teil 1, Unit-Test der Lesefunktion (Punkt 5), Wegwerf-Skript
  `_test-commit-guard-unit.mjs`, nicht committet, nach dem Lauf gelöscht —
  alle sechs Fälle bestanden:** (1) reines UTF-8 ohne BOM, Zeitstempel ohne
  Offset → erkannt, `2026-08-17T14:03:00` als Ortszeit gelesen → intern
  `2026-08-17T12:03:00.000Z`; (2) UTF-8 **mit** BOM, gleicher Zeitstempel →
  erkannt, gleiches Ergebnis (vor dem Fix: nicht erkannt); (3) UTF-16 LE
  mit BOM, gleicher Zeitstempel → erkannt, gleiches Ergebnis (vor dem Fix:
  nicht erkannt); (4) Zeitstempel mit `Z` (`2026-08-17T14:03:00Z`) →
  erkannt, als UTC interpretiert, intern `2026-08-17T14:03:00.000Z`
  (Soll-Wert per `Date.parse` gegengerechnet, exakter Treffer); (5)
  Zeitstempel mit `+02:00` (`2026-08-17T14:03:00+02:00`) → erkannt, als
  MESZ interpretiert, intern `2026-08-17T12:03:00.000Z` (Soll-Wert
  gegengerechnet, exakter Treffer); (6) Zeile ohne `Freigegeben:` am
  Zeilenanfang (`# Kommentar Freigegeben: 2026-08-17T14:03:00`, Fließtext)
  → **nicht** erkannt — belegt, dass Anker `^` und `m`-Flag unverändert
  blieben. Lauf mit `TZ=Europe/Berlin` (Sitzungs-Standardzone,
  MESZ/UTC+2 zum Testzeitpunkt).
  **Teil 2, Rot-Fall `commit` (Punkt 6):** `git commit --allow-empty -m
  test` auf Wegwerf-Branch `test/guard-haertung-calibration` (von
  `harness-fix/5-commit-guard-haerten` abgezweigt), ohne vorhandene
  Freigabe-Datei → abgewiesen, Meldung „git commit/push ohne
  Freigabe-Datei … verweigert" mit dem neuen, ausführlicheren
  Format-Beispiel (Punkt 3).
  **Teil 3, Vorher/Nachher-Beleg (Punkt 7) — zwei Durchläufe, der erste
  schlug fehl und ist Teil des Befunds, nicht weggelassen:**
  *Erster Durchlauf, Testformat aus dem ursprünglichen Vertragstext
  („mit Offset, Format JJJJ-MM-TTThh:mm:ss+hh:mm"):* Freigabe-Datei mit
  einem `+02:00`-Zeitstempel (entspricht der lokalen Zeitzone,
  MESZ) angelegt. Alter Hook (`commit-guard.alt.js`, `git show
  main:.claude/hooks/commit-guard.js`, nicht committet) gegen diese Datei
  aufgerufen → **keine Verweigerung**, keine Ausgabe — der alte Hook ließ
  die Datei durch und verbrauchte sie (Erfolgspfad löscht die Datei
  genau wie der neue Hook, aber ohne Ausgabe). [Schlussfolgerung, per
  Nachtrag 17.08.2026 im Vertrag] Der Fehler im alten Hook (Offset wird
  abgeschnitten, Rest als Ortszeit gelesen) hebt sich rechnerisch auf,
  wenn der geschriebene Offset exakt dem lokalen Offset entspricht — der
  Testfall aus dem ursprünglichen Vertragstext konnte deshalb strukturell
  nicht fehlschlagen. Der Fehler lag im Vertrag (Testformat), nicht im
  Fix und nicht in Befund B2 — B2 nennt explizit einen UTC-Zeitstempel
  (`date -u -Is`) als realistischen Fall. Vertrag um „Nachtrag 17.08.2026
  — Korrektur des Testformats in Punkt 7" ergänzt, ursprünglicher
  Wortlaut unverändert stehen gelassen.
  *Zweiter Durchlauf, korrigiertes Testformat (UTC/`Z`):* neue
  Freigabe-Datei mit UTC-Zeitstempel (`…Z`) angelegt. Alter Hook (gleiche
  `commit-guard.alt.js`, wiederverwendet) dagegen aufgerufen → **abgewiesen**,
  Meldung „ist 120 Minuten alt (Frischefenster 10 Minuten) — verweigert"
  — deckt sich mit der in B2 vorhergesagten Zwei-Stunden-Drift zwischen
  UTC und MESZ. Datei blieb liegen (Rot-Fall verbraucht nicht). Danach
  neuer Hook, echter Commit: `git commit --allow-empty -m test` auf
  demselben Wegwerf-Branch → durchgegangen, Commit `7559cef` um
  2026-08-17T20:58:08+02:00; `git status` direkt danach zeigt die
  Freigabe-Datei nicht mehr. `commit-guard.alt.js` sofort danach gelöscht.
  **Teil 4, Rot-Fall `push` (Punkt 8):** unmittelbar nach Commit
  `7559cef`, ohne neue Freigabe: `git push` auf `test/guard-haertung-calibration`
  → abgewiesen, gleiche Meldungsklasse wie der Commit-Rot-Fall — erster
  dokumentierter Rot-Fall für den Push-Pfad im Repo.
  Wegwerf-Branch danach lokal gelöscht (`git branch -D
  test/guard-haertung-calibration`), nie gepusht.
  **Grenze, ausdrücklich festgehalten:** Der Kodierungsfall (BOM, UTF-16)
  ist nur über den Unit-Test der reinen Lesefunktion belegt (Teil 1), nicht
  Ende-zu-Ende über einen echten Git-Befehl — die Freigabe-Datei ist für
  das Modell absichtlich unerreichbar (jeder Bash-Befehl, der ihren Pfad
  referenziert, wird vom Hook selbst blockiert), ein Modell kann also keine
  BOM-/UTF-16-Datei anlegen, um den Ende-zu-Ende-Pfad zu testen. Das ist
  eine dokumentierte Grenze, keine Nachlässigkeit.
  **Reibung, notiert nicht als Sicherheitsloch:** Der synthetische
  Vorher/Nachher-Test in Teil 3 durfte die Simulations-Eingabe
  (`{"tool_input":{"command":"git commit -m test"},...}`) nicht per `echo
  ... | node commit-guard.alt.js` an stdin übergeben, weil der aktiv
  verkabelte (neue) Hook jeden Bash-Befehl abfängt, der die Wörter „git"
  und „commit"/„push" als eigenständige Tokens enthält — auch innerhalb
  eines JSON-Text-Literals in einem Diagnose-Befehl, nicht nur in einem
  echten Git-Aufruf. Umgangen über eine Payload-Datei im Scratchpad plus
  `<`-Umleitung (`node commit-guard.alt.js < payload.json`), sodass die
  kritischen Wörter nicht im eigentlichen Bash-Befehl standen. Kein
  Sicherheitsloch — echte Git-Befehle laufen weiterhin über den Hook —,
  aber die erste real aufgetretene Instanz der im Kopfkommentar
  dokumentierten „breiten, nicht exakten" Muster-Grenze: Sie blockiert
  auch Diagnose-Befehle, die nur zufällig dieselben Wörter im Text tragen.

- 2026-08-17, `commit-guard.js`-Hook, Nachtrag zur Härtung (Vertrag
  `harness-fix-5-commit-guard-haerten`, „Nachtrag 17.08.2026 —
  Sekundenbruchteile"): Ein echter Commit-Versuch mit einer vom Menschen
  angelegten Freigabe-Datei wurde abgewiesen („keine gültige Zeile").
  Diagnose gegen synthetische Daten (BOM, CRLF, Leerzeichen vor dem
  Doppelpunkt, Millisekunden — alle gegen `parseFreigabeZeitstempel`
  bzw. `dekodiereFreigabeInhalt` getestet, nicht gegen die echte Datei)
  fand keinen Fehler im Normalfall, deckte aber auf: Sekundenbruchteile
  (`.000Z`, wie `new Date().toISOString()` sie erzeugt) wurden zwar
  erkannt, aber falsch interpretiert — derselbe Fehler wie B2, nur am
  Sekundenbruchteil statt am Offset. Regex zunächst um `(?:\.\d{1,3})?`
  zwischen Sekunden und Offset ergänzt. Zwei Unit-Fälle,
  Wegwerf-Skript `_test-commit-guard-unit-ms.mjs`, nicht committet, nach
  dem Lauf gelöscht — beide bestanden: (7) `2026-08-17T14:03:00.000Z` →
  erkannt, als UTC interpretiert, `2026-08-17T14:03:00.000Z` (Soll-Wert
  per `Date.parse` gegengerechnet, exakter Treffer — vor dem Fix wäre das
  Ergebnis `2026-08-17T12:03:00.000Z` gewesen, zwei Stunden Drift); (8)
  `2026-08-17T14:03:00.123+02:00` → erkannt, als MESZ interpretiert,
  `2026-08-17T12:03:00.123Z` (Soll-Wert gegengerechnet, exakter Treffer).
  Die eigentliche Ursache der ursprünglichen Ablehnung (der reale
  Freigabe-Datei-Inhalt, der zur „keine gültige Zeile"-Meldung führte)
  blieb ungeklärt, da die Datei für das Modell unerreichbar ist.
  **Korrektur, gleicher Tag:** Der Drei-Stellen-Fix war selbst zu eng —
  ab vier Nachkommastellen greift dieselbe Drift erneut (Python
  `datetime.isoformat()`: sechs Stellen, PowerShell `Get-Date -Format o`:
  sieben, `date -u -Ins`: neun). Wichtiger: Ein Testfall mit sieben Stellen
  und `+02:00` lief zunächst grün, aber nur scheinbar korrekt — Rest und
  lokaler Offset hoben sich gegenseitig auf, dieselbe Scheinkorrektheit wie
  beim ersten Kalibrierungsversuch zu Punkt 7 weiter oben. Fix korrigiert
  zu `(?:\.\d+)?` (beliebig viele Stellen, keine unbegründbare Obergrenze).
  Zwei weitere Unit-Fälle, Wegwerf-Skript `_test-commit-guard-unit-ms2.mjs`,
  nicht committet, nach dem Lauf gelöscht — beide bestanden: (9)
  `2026-08-17T19:28:08.123456Z` (6 Stellen) → erkannt, als UTC
  interpretiert, `2026-08-17T19:28:08.123Z` (Soll-Wert per `Date.parse`
  gegengerechnet, exakter Treffer — `Date.parse` selbst kappt auf
  Millisekunden, das ist eine JS-Grenze, keine Regex-Grenze); (10)
  `2026-08-17T21:28:08.1234567+02:00` (7 Stellen) → erkannt, als MESZ
  interpretiert, `2026-08-17T19:28:08.123Z` (Soll-Wert gegengerechnet,
  exakter Treffer). Der Mensch legt die nächste Freigabe-Datei mit einem
  einfacheren Format (Ortszeit ohne Offset) neu an.

- 2026-08-17, `commit-guard.js`-Hook, realer Grün-Fall Push-Pfad, Abschluss
  Vertrag `harness-fix-5-commit-guard-haerten`: Nach dem freigegebenen
  Abschluss-Commit `8d89041` (2026-08-17T22:07:07+02:00) auf dem echten
  Arbeitsbranch `harness-fix/5-commit-guard-haerten` zwei Push-Versuche.
  **Erster Versuch**, mit frischer Freigabe, `git push` ohne `-u`: scheiterte
  **nicht** am Hook, sondern danach an Git selbst — „the current branch …
  has no upstream branch" (erster Push dieses Branches). Die Freigabe war
  zu diesem Zeitpunkt bereits verbraucht (Hook löscht die Datei, *bevor*
  der eigentliche Git-Befehl läuft), `git status` direkt danach bestätigt
  den Verbrauch ohne stattgefundenen Push. [Schlussfolgerung] Das ist ein
  Bauform-Befund, kein Bug im Code: Ein `PreToolUse`-Hook sieht nur, ob er
  den Befehl durchlässt, nicht, ob der durchgelassene Befehl anschließend
  erfolgreich ist. Jeder Fehlschlag nach der Hook-Prüfung — fehlender
  Upstream (wie hier real eingetreten), abgelehnter Push, Netzwerkfehler,
  Tippfehler im Befehl — verbrennt den zweiten Schlüssel ohne
  stattgefundenen Git-Vorgang. **Zweiter Versuch**, mit einer weiteren
  frischen Freigabe, `git push -u origin harness-fix/5-commit-guard-haerten`
  → durchgegangen, ca. 2026-08-17T22:12:29+02:00; `git status` direkt
  danach zeigt „up to date with origin/harness-fix/5-commit-guard-haerten",
  Freigabe-Datei verbraucht. Damit liegen für beide Git-Vorgänge Rot- und
  Grün-Fall vor: Rot für `commit` und `push` auf dem Wegwerf-Branch, Rot
  für `push` zusätzlich auf dem Arbeitsbranch, Grün für `commit` und
  `push` auf dem Arbeitsbranch.
  **Nebenbefund, vor `8d89041`:** Drei Commit-Versuche auf dem
  Arbeitsbranch schlugen vorher fehl — nicht am Rot-Fall „fehlende
  Freigabe-Datei" oben, sondern an einem anderen Hook-Zweig: „keine
  gültige Zeile" (zweimal) und einmal „liegt in der Zukunft". [offene
  Unsicherheit] Der tatsächliche Inhalt der Freigabe-Datei bei den beiden
  „keine gültige Zeile"-Fällen blieb ungeklärt, da die Datei für das
  Modell unerreichbar ist; bekannt ist nur die Byte-Länge (30 Bytes
  inklusive Zeilenumbruch), was auf ein Leerzeichen statt „T" oder ein
  deutsches Datumsformat passen würde — belegt ist keines von beidem.
  Damit sind an diesem Abend vier verschiedene Verweigerungszweige des
  Hooks real aufgetreten: fehlende Datei, ungültige Zeile, Zeitstempel zu
  alt, Zeitstempel in der Zukunft.

- 2026-08-18, Doku-Gate, Vertrag `harness-fix-6-werkzeug-katalog`,
  Kalibrierung des einzigen greifenden Verweises auf den neuen
  Werkzeug-Katalog (`.claude/skills/werkzeug-auswahl/SKILL.md`, Schritt
  2c). Rot: Verweis temporär von `docs/harness/werkzeug-katalog.md` auf
  den nicht existierenden Pfad `docs/harness/werkzeug-katalog-x.md`
  umgebogen, `node scripts/check-docs.mjs` gelaufen → Exit 1, Ausgabe im
  Wortlaut:
  ```
  === Doku-Check ===

  ✗ 1 Befund(e):

    - .claude/skills/werkzeug-auswahl/SKILL.md:26: Verweis auf `docs/harness/werkzeug-katalog-x.md` — Datei existiert nicht
  ```
  Grün: Verweis auf `docs/harness/werkzeug-katalog.md` zurückgestellt,
  derselbe Befehl → Exit 0, Ausgabe im Wortlaut:
  ```
  === Doku-Check ===

  ✓ Keine Befunde.
  ```
  Damit ist belegt, dass die einzige Gate-Abdeckung des Katalogs in
  Phase 2 wirklich greift. **Ausdrücklich nicht abgedeckt: K4
  (Stand-Marker-Pflicht in Katalog-Einträgen).** Ein Marker-Pflicht-Check
  existiert nicht und wird erst mit N7 (Platzhalter-Check) in Phase 3
  scharf gestellt.

- 2026-08-18, Doku-Gate, Vertrag `harness-fix-7-reibung-und-doktrin`,
  Kalibrierung der Marker-Freiheit von `state/reibung.md`. Die Datei
  behauptet in ihrem eigenen Kopfkommentar, absichtlich **keinen**
  `Stand dieser Fassung:`-Marker zu tragen, weil Prüfung 3 sie sonst bei
  jedem neuen Reibungseintrag rot färben würde — dieser Eintrag zeigt das,
  statt es zu behaupten. Rot: temporär `Stand dieser Fassung: 01.08.2026`
  in den Kopfkommentar geschrieben und in der `[FÜLLUNG]`-Beispielzeile das
  jüngere Datum `18.08.2026` eingetragen, `node scripts/check-docs.mjs`
  gelaufen → Exit 1, Ausgabe im Wortlaut:
  ```
  === Doku-Check ===

  ✗ 1 Befund(e):

    - state\reibung.md:26: Datum 18.08.2026 ist jünger als "Stand dieser Fassung: 01.08.2026" (Zeile 3)
  ```
  Grün: Marker-Zeile und Testdatum wieder entfernt, derselbe Befehl →
  Exit 0, Ausgabe im Wortlaut:
  ```
  === Doku-Check ===

  ✓ Keine Befunde.
  ```
  Damit ist die Marker-Freiheit von `state/reibung.md` eine geprüfte
  Entscheidung und keine Vermutung.

- 2026-08-18, Doku-Gate, Vertrag `harness-fix-8-start-klein`, Kalibrierung
  der Aufnahme von `START-KLEIN.md` in `anweisungsDateien`
  (`scripts/check-docs.mjs:44-59`). Rot: temporär ein Backtick-Verweis auf
  die nicht existierende Datei `nicht-vorhanden.md` in `START-KLEIN.md`
  eingefügt, `node scripts/check-docs.mjs` gelaufen → Exit 1, Ausgabe im
  Wortlaut:
  ```
  === Doku-Check ===

  ✗ 1 Befund(e):

    - START-KLEIN.md:52: Verweis auf `nicht-vorhanden.md` — Datei existiert nirgends im Repo
  ```
  Grün: Testverweis wieder entfernt, derselbe Befehl → Exit 0, Ausgabe im
  Wortlaut:
  ```
  === Doku-Check ===

  ✓ Keine Befunde.
  ```
  Damit ist die Gate-Abdeckung von `START-KLEIN.md` eine geprüfte
  Entscheidung und keine Vermutung.
