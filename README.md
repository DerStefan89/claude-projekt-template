# claude-projekt-template

Vorlage für ein neues Projekt mit Claude-Code-Harness. Kein Next.js-Starter,
kein Boilerplate für ein bestimmtes Produkt — dieses Repo enthält nur die
**Mechanik**: Regelhierarchie, Gates, Prüfrollen, State-Struktur, Skills.

Herkunft: destilliert aus `DerStefan89/toolkompass` (Zyklus 1–6, sechs
abgeschlossene Praxiszyklen) nach der Skelett-/Füllung-Trennung aus
`claude-playbook/00-MASTER-BRIEFING.md` §7. Übertragbar ist die Mechanik der
Gates, nicht ihr Inhalt.

## Was hier drin ist (Skelett)

- Vier-Ebenen-Regelhierarchie: Mensch → Modell-Evaluator → deterministische
  Gates → Permissions (`docs/harness/HARNESS-OVERVIEW.md`)
- Vier Prüfrollen ohne Schreibrecht: ein Advisor (prüft Pläne vor dem Bau),
  drei Reviewer (prüfen Fertiges) — `.claude/agents/`
- Sechs Skills: `git-flow`, `repo-audit`, `werkzeug-auswahl`, `advisor-pass`,
  `spec-schreiben`, `ponytail` (fremd, vendort, MIT) — `.claude/skills/`
- Ein Doku-Gate (`scripts/check-docs.mjs`) mit fünf Prüfungen: tote Verweise,
  Versions-Dopplung, Selbstwiderspruch gegen den `Stand dieser Fassung:`-
  Marker, Dokument-Paare (Auslassung zwischen zwei Dateien erkennen),
  getarntes Hedging in Berichtsdateien
- Ein leerer AST-Regel-Harness (`scripts/check-rules.mjs`) — Mechanik ohne
  Regeln, die kommen pro Projekt dazu
- State-Struktur: `state/gates.md`, `state/triggers.md`,
  `state/assumption-ledger.md`, `state/memory-map.md`, `state/tooling.md`,
  `state/tasks/`, `state/zwischenstand/`
- Rückwärts-Handoff über SessionStart-/PreCompact-Hooks
- Ein Settings-Guard-Hook, der Schreibzugriff auf die geteilte
  `.claude/settings.json` blockiert (Freigaben gehören nach
  `settings.local.json`)

## Was hier NICHT drin ist (Füllung — pro Projekt neu)

- `ARCHITECTURE.md` selbst, konkrete Regeln in `check-rules.mjs`, der
  Stack-Block in `CLAUDE.md`, das Test-Werkzeug, das Deploy-Ziel
- `design-guardian` als Agent (nur bei UI-Projekten — Beispiel in
  `docs/examples/design-guardian.example.md`)
- Alles unter `docs/harness/` außer dem leeren Grundgerüst — der Inhalt
  entsteht mit dem ersten Zyklus dieses Projekts

## Bootstrap eines neuen Projekts

1. Dieses Repo klonen, `.git`-Historie neu initialisieren (`rm -rf .git &&
   git init`) — das Template hat keine Baugeschichte, die ein neues Projekt
   erben sollte.
2. **`SETUP.md` lesen und abarbeiten** — dort stehen die Schritte, die kein
   Template als Datei mitbringen kann (Branch Protection allen voran).
3. `CLAUDE.md` und `ARCHITECTURE.md` für den eigenen Stack füllen.
4. Skill `werkzeug-auswahl` laufen lassen, bevor irgendein Test-Runner,
   MCP oder Plugin installiert wird.
5. Erstes Feature: Skill `spec-schreiben` → `advisor-pass` →
   `handoff-vertrag` (aus `claude-playbook/skills/`) → Reviewer.

## Quellenregel

Dieses Repo ist selbst ein Nachweis der Skelett-/Füllung-Trennung — wenn
etwas hier drin stackgebunden wirkt, ist das ein Fund, kein Feature. Siehe
`claude-playbook/INVENTAR-HARNESS-6.5.md` für die vollständige
Sortier-Herleitung, Zeile für Zeile.
