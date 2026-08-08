# claude-projekt-template

Vorlage für ein neues Projekt mit Claude-Code-Harness. Kein Next.js-Starter,
kein Boilerplate für ein bestimmtes Produkt — dieses Repo enthält nur die
**Mechanik**: Regelhierarchie, Gates, Prüfrollen, State-Struktur, Skills.

Herkunft: destilliert aus einem Produktivprojekt mit sechs abgeschlossenen
Praxiszyklen, sortiert nach dem Prinzip **Skelett und Füllung** — übertragbar
ist die Mechanik der Gates, nicht ihr Inhalt.

## Was hier drin ist (Skelett)

- Vier-Ebenen-Regelhierarchie: Mensch → Modell-Evaluator → deterministische
  Gates → Permissions (`docs/harness/HARNESS-OVERVIEW.md`)
- Drei Prüfrollen ohne Schreibrecht: `architecture-advisor` (prüft Pläne vor
  dem Bau), `code-reviewer` und `qa` (prüfen Fertiges) — `.claude/agents/`.
  Eine vierte, `design-guardian`, liegt bewusst nur als Vorlage in
  `docs/examples/` — sie prüft Design-Treue und gehört nur in UI-Projekte
- Sieben Skills: `spec-schreiben`, `advisor-pass`, `handoff-vertrag`,
  `werkzeug-auswahl`, `repo-audit`, `git-flow`, `ponytail` (fremd, vendort,
  MIT) — `.claude/skills/`
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

1. Auf GitHub „Use this template" → „Create a new repository", dann klonen.
   Ohne GitHub: Ordner kopieren und `rm -rf .git && git init` — das Template
   hat keine Baugeschichte, die ein neues Projekt erben sollte.
2. **`SETUP.md` lesen und abarbeiten** — dort stehen die Schritte, die kein
   Template als Datei mitbringen kann (Branch Protection allen voran).
3. `CLAUDE.md` und `ARCHITECTURE.md` für den eigenen Stack füllen.
4. Skill `werkzeug-auswahl` laufen lassen, bevor irgendein Test-Runner,
   MCP oder Plugin installiert wird.
5. Erstes Feature: Skill `spec-schreiben` → `advisor-pass` →
   `handoff-vertrag` → Reviewer. Alle drei liegen in `.claude/skills/`.

## Wenn du neu bist

`docs/guide/` erklärt das Harness von Grund auf — Architekturübersicht,
Deep Dives zu jedem Bereich (was Hooks, Agents, MCPs, `specs/` bedeuten),
den Arbeitsprozess, Token-Sparen und eine Schritt-für-Schritt-Anleitung
zum eigenen Projekt. Start: `docs/guide/00-START-HIER.md`.

## Quellenregel

Dieses Repo ist selbst ein Nachweis der Skelett-/Füllung-Trennung — wenn
etwas hier drin stackgebunden wirkt, ist das ein Fund, kein Feature. Meld
oder notier ihn, statt ihn mitzuschleppen.
