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
| Einmal-Freigabe für den Commit-Guard | `state/freigabe-commit.md` | nicht in `state/zwischenstand/` — andere Aufgabe (Autorisierung, nicht Fortsetzung), andere Lebensdauer (ein Commit, nicht eine Sitzung); nie committen |
| Spec: das WAS eines Vorhabens | `specs/` | Pläne und Verträge (das WIE) — die gehören nach `state/tasks/*.md` |
| [FÜLLUNG] | | |
