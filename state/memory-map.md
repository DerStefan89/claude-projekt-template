<!-- Ziel-Pfad im Repo: state/memory-map.md -->
# Memory Map — [PROJEKTNAME]

Wo welche Art von Information zuhause ist — damit nichts doppelt und an
zwei Stellen leicht widersprüchlich gepflegt wird (vgl. G7-Falle:
derselbe Fakt an drei Stellen im Quell-Projekt dieses Templates).

| Info-Typ | Heimat | Nicht hierhin |
|---|---|---|
| Stack, Regeln, Definition of Done | `CLAUDE.md` | |
| Verbindliche Code-Konventionen | `ARCHITECTURE.md` | |
| Aktueller Phasenstand, Scope | `docs/STATUS.md` | nicht in CLAUDE.md duplizieren |
| Architekturentscheidungen mit Alternativen | `docs/adr/*.md` | nicht nur im Chat/PR-Text |
| Objektive Gates + Kalibrierung | `state/gates.md` | |
| Trigger für menschliche/Agent-Handlungen | `state/triggers.md` | |
| Offene Annahmen | `state/assumption-ledger.md` | |
| Werkzeug-Bestand | `state/tooling.md` | |
| Mehrschritt-Aufträge an andere Session/Kontext | `state/tasks/*.md` (Handoff-Vertrag) | nicht nur als Chat-Prompt |
| Zyklus-/Lernstand des Harness selbst | `docs/harness/HARNESS-LEARNING-STATE.md` | |
| Strukturänderungen am Harness | `docs/harness/HARNESS-CHANGELOG.md` | |
| Begriffe mit projektspezifischer Bedeutung | `docs/harness/HARNESS-GLOSSARY.md` | |
| Zwischenstand einer unterbrochenen Aufgabe | `state/zwischenstand/<branch>.md` | nicht committen außer VORLAGE.md |
| Einmal-Freigabe für den Commit-Guard | `state/freigabe-commit.md` | nicht in `state/zwischenstand/` — andere Aufgabe (Autorisierung, nicht Fortsetzung), andere Lebensdauer (ein Commit, nicht eine Sitzung); nie committen. Eine Freigabe gilt für genau einen Git-Vorgang (`commit` ODER `push`, nicht beide) — ein vollständiger Iterationsabschluss laut `CLAUDE.md` („committen UND pushen") braucht deshalb zwei Freigaben nacheinander. |
| Spec: das WAS eines Vorhabens | `specs/` | Pläne und Verträge (das WIE) — die gehören nach `state/tasks/*.md` |
| Was es an Werkzeugen gibt und wann es sich lohnt | `docs/harness/werkzeug-katalog.md` | was in diesem Projekt läuft |
| Was in diesem Projekt läuft oder abgelehnt wurde | `state/tooling.md` | allgemeine Werkzeugkunde |
| Warum diese Stack-Entscheidung fiel | `docs/adr/*.md` | Werkzeug-Katalog — eine Backend- oder Datenbankwahl ist eine Architekturentscheidung, kein Werkzeug |
| Reibungsvorfälle | `state/reibung.md` | nicht in `state/assumption-ledger.md` (dort stehen offene Annahmen, keine Vorfälle) und nicht in ein separates Repo |
| Abgespaltener Architektur-Teilbereich | eigene Datei plus memory-map-Zeile plus Rückverweis aus `ARCHITECTURE.md` | keine Abspaltung ohne die drei Bedingungen aus der Aufteilungsregel (`ARCHITECTURE.md`, Kopfkommentar) |
| Datenbankschema | erzeugt aus den Migrationen | keine von Hand gepflegte Schema-Datei unter `docs/` |
| API-Vertrag | erzeugt aus dem Code | keine von Hand gepflegte API-Datei unter `docs/`. Was an beiden **Regel** ist (Namenskonvention, wer darf schreiben, Versionierung, Fehlerformat), bleibt in `ARCHITECTURE.md` |
| [FÜLLUNG] | | |
