SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach `git checkout main && git pull` und bestätigen, dass Commit `71d2dd4`
(Vertrag 3) in `main` enthalten ist. Danach `npm run check` laufen lassen
und den Ausgangsstand protokollieren, bevor irgendetwas geändert wird.

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-4-pruefkette-und-vertragspruefung

GOAL:
`npm run check` behauptet nicht mehr grün, was es nicht geprüft hat.
`check:template` prüft den Harness selbst, unabhängig vom Projektstack, und
bleibt im leeren Template grün. Jeder Handoff-Vertrag wird maschinell auf
Vollständigkeit geprüft. Prüfbar an: `check:template` → Exit 0 · `check` →
Exit 1 mit lesbarer Meldung · `check-contract.mjs` wird an einem
absichtlich verstümmelten Vertrag rot und an allen echten Verträgen in
`state/tasks/` grün · CI grün mit `check:template`.

CONTEXT:
- [Fakt] Ausgangsstand: `main` nach Merge von Vertrag 3, Arbeitsbaum
  sauber, `npm run check` → Exit 0.
- [Fakt] `package.json`, Skripte `lint`/`typecheck`/`test`: je
  `echo '[FÜLLUNG] ...'`, Exit 0. `check`: `lint && typecheck &&
  check-docs.mjs && check-rules.mjs && test`.
- [Fakt] `.claude/settings.json`, `hooks.PostToolUse`: ruft nach jedem
  `Edit`/`Write` `npm run lint --silent 1>&2` auf. Sobald `lint` ehrlich
  Exit 1 liefert, schlägt dieser Hook nach jeder Dateiänderung fehl.
- [Fakt] `.claude/skills/handoff-vertrag/SKILL.md`, Punkt 4: Überschrift
  „Die sieben Sektionen füllen:", darunter acht Aufzählungspunkte (`TASK`,
  `GOAL`, `CONTEXT`, `SCOPE`+`NICHT` als ein Punkt, `BUDGET`, `OUTPUT`,
  `ESCALATE`, `FOLGT`) — `FOLGT` ist der achte, obwohl der Text „sieben"
  sagt. `SCHRITT 0` ist im selben Dokument bereits als eigener, separater
  Punkt 3 geführt, nicht Teil der „sieben Sektionen". Zielzustand nach
  diesem Vertrag: `SCHRITT 0` (Präambel) + genau sieben Sektionen (`TASK`,
  `GOAL`, `CONTEXT`, `SCOPE`/`NICHT` zusammen, `BUDGET`, `OUTPUT`,
  `ESCALATE`) + `FOLGT` als eigener, ausdrücklich bedingter achter Punkt,
  nicht Teil der Sieben-Zählung.
- [Fakt] `state/tasks/` enthält aktuell nur
  `harness-fix-1-hooks-und-zwischenstand.md`,
  `harness-fix-2-commit-guard.md` und eine themenfremde
  `phase0-artefakte-committen.md`. `harness-fix-3-dokugate-und-ci.md` fehlt
  — bei Vertrag 3 nicht auf die Platte geschrieben, obwohl der Skill das
  verlangt.
- [Fakt] `.github/workflows/ci.yml`, Schritt „Lint, Typecheck, Doku-Gate,
  Regel-Gate, Tests": `run: npm run check`.
- [Fakt] `CLAUDE.md`, Abschnitt „Befehle": nennt nur `npm run check`, keine
  Unterscheidung zu einer Template-Kette.
- [Fakt] `SETUP.md`, Punkt 3, erwähnt `werkzeug-auswahl` für die
  Werkzeugwahl, aber nicht den PostToolUse-Lint-Hook und nicht, dass CI
  nach echter Werkzeugwahl von `check:template` auf `check` umgestellt
  werden sollte.
- [Fakt] `state/plan-v2-phase1-vertraege.md`, Abschnitt „Vertrag 4", ist
  die Grundlage dieses Vertrags.

SCOPE:

1. Nachtrag: `state/tasks/harness-fix-3-dokugate-und-ci.md` rekonstruieren
   und ablegen — Inhalt aus dem tatsächlich ausgeführten Vertrag 3 (liegt
   dir als Text vor), nicht neu erfinden. Formal muss er SCHRITT 0 plus
   die sieben Sektionen enthalten, denn er wird gleich Teil des
   Grün-Testfalls von `check-contract.mjs`.
2. `.claude/skills/handoff-vertrag/SKILL.md`, Punkt 4: `FOLGT` aus der mit
   „Die sieben Sektionen füllen:" überschriebenen Liste herausnehmen und
   als eigenen, klar als bedingt markierten Punkt danach führen (nach dem
   Vorbild, wie Punkt 3 `SCHRITT 0` bereits separat führt). Die Zahl
   „sieben" muss danach stimmen, ohne `FOLGT` mitzuzählen.
3. `scripts/check-contract.mjs` neu anlegen, nach dem Stilvorbild von
   `check-docs.mjs`/`check-rules.mjs` (deutsche Bezeichner, `=== ... ===`
   Kopfzeile, Exit 0/1, `console.log` je Befund). Prüft jede `.md`-Datei in
   `state/tasks/` auf: Vorhandensein von `SCHRITT 0` (Präambel, am Anfang)
   und der sieben Sektionsmarker `## TASK:`, `GOAL:`, `CONTEXT:`, `SCOPE:`,
   `NICHT:`, `BUDGET:`, `OUTPUT:`, `ESCALATE:` — **acht Marker für sieben
   Sektionen**, weil `SCOPE`/`NICHT` je einen eigenen Marker brauchen.
   `FOLGT` wird nicht geprüft. Fehlt ein Marker: Befund mit Dateiname und
   fehlendem Marker, Exit 1 am Ende bei mindestens einem Befund.
4. Beide Fehlerpfade ausdrücklich behandeln, nicht nur den Erfolgsfall:
   `state/tasks/` existiert nicht → Exit 0, Meldung „kein
   Vertragsverzeichnis, nichts zu prüfen". `state/tasks/` existiert, ist
   aber leer oder enthält keine `.md`-Dateien → Exit 0, Meldung „0
   Verträge geprüft" — sichtbar, nicht stillschweigend grün.
5. Realen Rot-Fall durchspielen: eine absichtlich verstümmelte Testdatei
   (z. B. `SCOPE:` fehlt) temporär nach `state/tasks/` legen, `node
   scripts/check-contract.mjs` laufen lassen, Befund zeigen, Testdatei
   wieder entfernen — nicht committen.
6. Realen Grün-Fall durchspielen: `check-contract.mjs` gegen die jetzt vier
   echten Dateien in `state/tasks/` laufen lassen (inklusive der aus
   Punkt 1 nachgetragenen und dieses eigenen Vertrags, sobald er selbst
   dort abgelegt ist) → Exit 0.
7. `package.json`: `lint`, `typecheck`, `test` von `echo`/Exit 0 auf eine
   Meldung nach `stderr` plus `exit 1` umstellen. Meldung muss auf
   `SETUP.md Punkt 3` (Skill `werkzeug-auswahl`) verweisen, damit klar ist,
   was zu tun ist, nicht nur dass etwas fehlt.
8. `package.json`: neues Skript `check:template` — Kette aus
   `node scripts/check-docs.mjs`, `node scripts/check-rules.mjs`,
   `node scripts/check-contract.mjs`. `check` bekommt `check-contract.mjs`
   zusätzlich in seine bestehende Kette aufgenommen (nach `check-rules.mjs`,
   vor `test`).
9. `.claude/settings.json`: `hooks.PostToolUse`-Eintrag mit
   `npm run lint --silent 1>&2` entfernen. **Diese Datei änderst du nicht
   selbst** — Zielinhalt exakt angeben (die Datei ohne den PostToolUse-Block,
   Rest unverändert) und an den Menschen übergeben, der es in seinem Editor
   einträgt. Danach weiterarbeiten wie in Vertrag 1, Punkt 1.
10. `SETUP.md`, Punkt 3: einen Absatz ergänzen — sobald echte Werkzeuge
    eingerichtet sind, `.github/workflows/ci.yml` von `npm run
    check:template` auf `npm run check` umstellen (oder beide Ketten
    laufen lassen, falls das Projekt beides getrennt beobachten will), und
    einen PostToolUse-Lint-Hook nach Bedarf manuell in
    `.claude/settings.json` ergänzen — der wurde in diesem Vertrag entfernt,
    weil er ohne echten Linter nach jeder Änderung scheitert.
11. `CLAUDE.md`, Abschnitt „Befehle": einen Satz ergänzen, der `npm run
    check` (volle Kette, inklusive Projekt-Lint/Typecheck/Test) von `npm
    run check:template` (nur Harness-Selbstprüfung: Doku-Gate, Regel-Gate,
    Vertragsprüfung) unterscheidet.
12. `.github/workflows/ci.yml`: den Schritt „Lint, Typecheck, Doku-Gate,
    Regel-Gate, Tests" auf `npm run check:template` umstellen, Namen
    entsprechend anpassen (z. B. „Harness-Selbstprüfung").
13. `state/gates.md`: neue Zeile für `check-contract.mjs` plus
    Kalibrierungs-Log-Eintrag mit den realen Rot-/Grün-Fällen aus Punkt 5/6.

NICHT:
- Einen echten Linter/Typechecker/Testrunner installieren oder auswählen —
  das ist `werkzeug-auswahl`, nicht dieser Vertrag.
- Die CI-/Branch-Protection-Zeilen in `state/gates.md` kalibrieren — bleibt
  `[FÜLLUNG]`, ist Sache von `SETUP.md` Punkt 1 im jeweiligen Projekt.
- Reihenfolge oder Wortlaut der übrigen Punkte in `handoff-vertrag/
  SKILL.md` ändern, außer Punkt 4 wie in Punkt 2 beschrieben.
- Weitere Befunde aus dem Register mitnehmen, weil sie beim Lesen auffallen.
- `programm/` anfassen oder stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Der Halt bei Punkt 9
(`.claude/settings.json`) zählt nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/4-pruefkette-und-vertragspruefung`, von
  aktualisiertem `main` abgezweigt.
- Commit(s), inhaltsbeschreibend, ohne Werbung.
- `npm run check:template` → Exit 0, Ausgabe zeigen.
- `npm run check` → Exit 1, mit lesbaren Meldungen für lint/typecheck/test,
  Ausgabe zeigen — das ist ab jetzt der erwartete, nicht der fehlerhafte
  Zustand.
- Ausgabe von Punkt 5 (Rot) und Punkt 6 (Grün) für `check-contract.mjs`
  vollständig zeigen.
- `git diff --staged` vollständig zeigen, insbesondere
  `state/tasks/harness-fix-3-dokugate-und-ci.md` (Nachtrag),
  `state/tasks/harness-fix-4-pruefkette-und-vertragspruefung.md` (dieser
  Vertrag selbst) und `state/gates.md`.
- Push, dann PR-Status klären (`gh auth status` prüfen; fehlt `gh`, den
  Link nennen). CI-Status auf dem Branch/der PR beobachten und melden.
  NICHT selbst mergen.

ESCALATE:
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- `71d2dd4` ist noch nicht in `main` → anhalten, melden, nicht weiterbauen.
- `npm run check` ist schon am Anfang rot → anhalten (der Ausgangsstand vor
  Punkt 7 muss noch grün sein — sonst ist die CONTEXT-Annahme falsch).
- `.claude/settings.json` reagiert unerwartet (z. B. der Guard blockiert
  auch die reine Anzeige des Zielinhalts) → anhalten, melden.
- Die Testdatei aus Punkt 5 taucht in `git status` als gestaged auf →
  anhalten, nicht committen, erst entfernen.

FOLGT:
- Tor Phase 1 prüfen (nach diesem Vertrag): `check:template` grün, `check`
  rot mit lesbarer Meldung, je ein dokumentierter Rot-Fall pro neuem Gate —
  das ist dann kein neuer Auftrag, sondern eine Prüfung des bereits
  Gebauten.
