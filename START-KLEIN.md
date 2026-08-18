Erstlektüre: ja

# START-KLEIN — der kleinste Weg durch dieses Repo

Vier Meilensteine: Umgebung, Orientierung, echte Änderung, voller Zyklus.
Danach kennst du das Nötigste. Was du **jetzt nicht** liest: `docs/guide/`,
Deep Dives, `docs/harness/werkzeug-katalog.md`, Doktrin-Abschnitte in
`ARCHITECTURE.md`/`SETUP.md`. Die kommen, wenn sie dran sind — nicht vorab.

## 1. Umgebung

- `node -v` ausführen. Erwartet: `24.x` (siehe `package.json`). Passt die
  Version nicht, diffuse Folgefehler statt eines klaren Abbruchs — zuerst
  hier prüfen, nicht am Symptom debuggen.
- `npm install`, dann `npm run check:template` — muss Exit 0 liefern. Das
  ist der Harness-Selbsttest, unabhängig vom Projektstack.

## 2. Orientierung

- Was verbindlich gilt, steht in `CLAUDE.md` → `ARCHITECTURE.md`.
- Stack-Block-Einträge in `CLAUDE.md`/`ARCHITECTURE.md` tragen **keine**
  Versionsnummern („React 19", nicht „React 19.1") — ein Doku-Gate
  (Prüfung 2) prüft das und wird sonst rot, obwohl nichts kaputt ist.
- Hat dich etwas aufgehalten (Werkzeug, Gate, Befehl, Doku-Stelle): eine
  Zeile in `state/reibung.md`. Das ist der einzige Ort dafür.

## 3. Echte Änderung

- Änderungen laufen über Handoff-Verträge (`state/tasks/`) oder direkt,
  je nach Größe — im Zweifel: Skill `handoff-vertrag`.
- Vor dem Commit: `npm run check` (bzw. `check:template` im leeren
  Template) muss grün sein.

## 4. Voller Zyklus — committen und pushen

- Jeder Git-Vorgang (Commit, Push) braucht eine **eigene** Freigabe in
  `state/freigabe-commit.md`, Format exakt:
  `Freigegeben: <ISO-Zeitstempel>` (z. B. `Freigegeben:
  2026-08-18T14:03:00`, mit oder ohne Offset, auch `Z`). Eine Freigabe
  gilt für **einen** Vorgang — committen und pushen sind zwei Vorgänge,
  zwei Freigaben.
- `state/freigabe-commit.md` ist über Bash absichtlich nicht erreichbar —
  auch nicht mit `ls` oder `cat`. Das ist kein Fehler, sondern der zweite
  Schlüssel: nur im eigenen Editor lesen/schreiben.
- Beim ersten Push eines Branches greift `SETUP.md` Punkt 1 (Branch
  Protection auf `main`) — dort nachschlagen, nicht `SETUP.md` als Ganzes
  lesen.
- Skill `git-flow` führt durch den Rest.

## Wenn etwas hier nicht stimmt

Diese Datei unterliegt demselben Doku-Gate wie jede andere Anweisungsdatei
(`scripts/check-docs.mjs`) — ein toter Verweis hier wird genauso gefangen
wie in `CLAUDE.md`. Fällt dir trotzdem etwas Falsches auf: `state/reibung.md`.
