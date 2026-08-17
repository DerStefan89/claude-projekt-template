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
| CI | `.github/workflows/ci.yml` | `npm run check` auf frischer Maschine + Secret-Scan | [FÜLLUNG] | [FÜLLUNG] |
| Branch Protection | GitHub-Repo-Einstellung, kein Datei-Artefakt (siehe SETUP.md Punkt 1) | Required Status Check `check` vor Merge auf `main`, ohne Admin-Bypass | [FÜLLUNG] | [FÜLLUNG] |
| `guard-settings.js`-Hook | `.claude/hooks/guard-settings.js` | Edit/Write auf geteilte `.claude/settings.json` | [FÜLLUNG] | [FÜLLUNG] |
| `commit-guard.js`-Hook | `.claude/hooks/commit-guard.js` | `git commit`/`git push` ohne frische Freigabe-Datei; Bash-Zugriff auf `.claude/settings.json`; Bash-Zugriff auf `state/freigabe-commit.md` | `git commit --allow-empty -m test` auf `test/commit-guard-calibration` ohne vorhandene Freigabe-Datei, ca. 2026-08-17T11:40 → abgewiesen ("git commit/push ohne Freigabe-Datei … verweigert"); derselbe Befehl erneut um 2026-08-17T11:54:54+02:00, unmittelbar nach Verbrauch der vorherigen Freigabe → wieder abgewiesen, gleiche Meldung | `git commit --allow-empty -m test` mit frischer, vom Menschen angelegter Freigabe-Datei (`Freigegeben: <ISO-Zeitstempel>`) → Commit `129cd01` um 2026-08-17T11:54:13+02:00 durchgegangen; `git status` direkt danach zeigt `state/freigabe-commit.md` nicht mehr — Einmal-Verbrauch bestätigt |
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
