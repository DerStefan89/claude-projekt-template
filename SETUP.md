# SETUP — Schritte, die kein Template als Datei mitbringen kann

Diese Liste existiert, weil ein Repo-Klon nicht alles trägt. Ein Klon ohne
diese Schritte sieht komplett aus und hält an der wichtigsten Stelle nichts.

## 1. Branch Protection auf `main`, ohne Admin-Bypass

Das härteste Gate des Harness existiert nur als GitHub-Einstellung.

GitHub → Settings → Branches → Branch protection rule für `main`:
- Require a pull request before merging
- Require status checks to pass before merging → `check` (Name des CI-Jobs
  aus `.github/workflows/ci.yml`) als Required Status Check auswählen
- **„Do not allow bypassing the above settings" aktivieren** — sonst kann
  der Repo-Admin (also du) das Gate im Zweifel selbst umgehen, ohne dass es
  auffällt.

**Vorher den Tarif prüfen:** Bei *privaten* Repos auf einem persönlichen
GitHub-Free-Konto lässt sich die Regel anlegen, wird aber **nicht
durchgesetzt** (GitHub zeigt sie als „Not enforced"). Erforderlich sind
GitHub Pro oder ein Team-/Enterprise-Konto; bei öffentlichen Repos greift
sie auch im Free-Tarif. Ohne das ist dieses Gate nur beschriftet, nicht
wirksam.

Gegentest nicht vergessen: einmal versuchen, mit rotem CI zu mergen — muss
scheitern. Danach in `state/gates.md` eintragen, mit Datum.

## 2. Ist das ein UI-Projekt?

Wenn ja:
- `docs/examples/design-guardian.example.md` nach `.claude/agents/
  design-guardian.md` kopieren, auf den eigenen Stack anpassen (Design-
  Referenzen, Token-Quelle).
- `docs/design-system.md` anlegen.
- In `CLAUDE.md` den Design-Abschnitt ausfüllen.

Wenn nein (API, CLI, Smart Contract, Backend-Service): `design-guardian`
nicht anlegen. Ein Prüfer für ein Kriterium, das nicht existiert, prüft
nichts und verwirrt nur.

## 3. Werkzeuge auswählen

Vor der ersten Installation: zuerst in `docs/harness/werkzeug-katalog.md`
nachschlagen, ob das Werkzeug dort schon geprüft ist, bevor die volle
Prozedur läuft. Danach Skill `werkzeug-auswahl` laufen lassen (liegt unter
`.claude/skills/`). Bedarf zuerst, dann Herkunfts-Check. Ergebnis — auch
das negative — nach `state/tooling.md`.

Test-Runner, Linter, CI-Toolchain sind alle Füllung. Für Node/TypeScript-
Stacks ist `.github/workflows/ci.yml` bereits ein sinnvoller Start; für
andere Sprachen (Solidity/Foundry, Python, …) den Workflow neu schreiben —
die MECHANIK „ein Job, ein `check`-Befehl, Required Status Check" bleibt,
die Schritte darin nicht.

Sobald echte Werkzeuge eingerichtet sind: `.github/workflows/ci.yml` von
`npm run check:template` auf `npm run check` umstellen (oder beide Ketten
getrennt laufen lassen, falls das Projekt Harness-Selbstprüfung und
Projekt-Prüfkette getrennt beobachten will). Danach bei Bedarf einen
PostToolUse-Lint-Hook manuell in `.claude/settings.json` ergänzen — der
wurde entfernt, weil er ohne echten Linter nach jeder Dateiänderung
scheitert (siehe `state/tasks/harness-fix-4-pruefkette-und-vertragspruefung.md`).

## 4. `check-rules.mjs` befüllen

Kommt leer mit dem Template — ein AST-Harness ohne Regeln. Die ersten
Regeln entstehen aus echten Wiederholungen im eigenen Code. Beförderungsregel:
Taucht derselbe Fehler dreimal auf, wird er zur Regel — vorher nicht. Eine
ausgedachte Regel ist ungeprüft und kostet vom ersten Tag an Reibung.

## 5. Doku-Gate: Dokument-Paare anpassen

`scripts/check-docs.mjs`, Prüfung 4 (`dokumentPaare`), kommt mit einem
leeren Array. Sobald `docs/harness/HARNESS-CHANGELOG.md` und
`docs/harness/HARNESS-LEARNING-STATE.md` beide echten Inhalt haben, das
Paar eintragen. Das Muster steht als Kommentar direkt an der Stelle in
`check-docs.mjs`.

## 6. Erste Selbstprüfung

`repo-audit`-Skill einmal auf das frisch gefüllte Projekt laufen lassen.
Erwartung nicht „keine Funde" — beim ersten Mal findet er fast immer etwas
(z. B. eine Datei, die `CLAUDE.md` erwähnt, aber noch nicht existiert).

## 7. `.gitignore` prüfen

Insbesondere: `.claude/settings.local.json` MUSS drin stehen. Diese Datei
trägt persönliche Freigaben und wird nie reviewt — landet sie versehentlich
im Repo, ist das ein Sicherheitsfund, kein Stilfehler (siehe G10).

## 8. Erzeugte Wahrheit einrichten

Sobald das Projekt eine Datenbank oder eine öffentliche API hat, werden
Schema und API-Vertrag nicht von Hand geschrieben, sondern erzeugt — und
ein Gate wird rot, wenn das Erzeugte vom festgehaltenen Stand abweicht
(Muster: `dump | diff`). Die Mechanik ist Skelett, der konkrete Befehl
(welcher Dump-Befehl, welches Diff-Ziel) ist Füllung und entsteht mit dem
eigenen Stack.
