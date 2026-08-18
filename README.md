# claude-projekt-template

Vorlage für ein neues Projekt mit Claude-Code-Harness. Kein Next.js-Starter,
kein Boilerplate für ein bestimmtes Produkt — dieses Repo enthält nur die
**Mechanik**: Regelhierarchie, Gates, Prüfrollen, State-Struktur, Skills.

Herkunft: destilliert aus einem Produktivprojekt mit sechs abgeschlossenen
Praxiszyklen, sortiert nach dem Prinzip **Skelett und Füllung** — übertragbar
ist die Mechanik der Gates, nicht ihr Inhalt.

## Loslegen

Es gibt zwei Wege hinein. Beide führen zum selben Repo, sie unterscheiden
sich darin, wer die ersten Schritte anleitet.

### Weg 1: `START-KLEIN.md` (empfohlen)

Die Datei liegt in der Repo-Wurzel, höchstens 120 Zeilen, ohne Suchen
lesbar. Sie führt selbst durch vier Meilensteine — Umgebung, Orientierung,
echte Änderung, voller Zyklus — und nennt an jeder Stelle die Datei, die
als Nächstes dran ist. Am Repo selbst öffnen und abarbeiten, kein
Claude-Projekt nötig.

### Weg 2: geführt über ein Claude-Projekt

Dieses Repo führt dich sonst nicht von selbst. Die Führung kommt aus einem
Claude-Projekt, das du dir einmal einrichtest — danach begleitet es dich
Schritt für Schritt.

1. **Claude-Projekt anlegen.** Den kompletten Inhalt von
   `docs/onboarding/CLAUDE-PROJEKT-INSTRUCTIONS.md` als Custom Instructions
   einsetzen.
2. **Ersten Chat starten.** Den Prompt aus
   `docs/onboarding/START-PROMPT.md` kopieren, die eckigen Klammern
   ausfüllen, absenden.
3. **Ab hier führt Claude.** Es gibt zwei Wege — das Harness erst verstehen,
   oder direkt das eigene Projekt damit aufbauen. Claude erklärt beide und
   empfiehlt einen.

Du schreibst dabei keine Dateien von Hand. Claude liefert dir die Prompts,
die du in Claude Code einsetzt — genau das ist die Fähigkeit, die du hier
mitnimmst.

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

## Bootstrap im Detail

Claude führt dich durch diese Schritte. Hier stehen sie zum Nachschlagen.

1. Auf GitHub „Use this template" → „Create a new repository", dann klonen.
   Ohne GitHub: Ordner kopieren und `rm -rf .git && git init` — das Template
   hat keine Baugeschichte, die ein neues Projekt erben sollte.
2. **`SETUP.md` Punkt 1 (Branch Protection auf `main`)** greift spätestens
   beim ersten Push — der Rest von `SETUP.md` folgt punktuell, wenn der
   jeweilige Schritt dran ist (Werkzeugwahl, UI-Projekt ja/nein, …), nicht
   als Ganzes vorab.
3. `CLAUDE.md` und `ARCHITECTURE.md` für den eigenen Stack füllen.
4. Skill `werkzeug-auswahl` laufen lassen, bevor irgendein Test-Runner,
   MCP oder Plugin installiert wird.
5. Erstes Feature: Skill `spec-schreiben` → `advisor-pass` →
   `handoff-vertrag` → Reviewer. Alle drei liegen in `.claude/skills/`.

## Nachschlagen

`docs/guide/` erklärt das Harness von Grund auf: Architekturübersicht, Deep
Dives zu jedem Bereich (was Hooks, Agents, MCPs, `specs/` bedeuten), der
Arbeitsprozess, Token-Sparen. Du musst das nicht vorab lesen — Claude
verweist dich auf die passende Stelle, wenn sie dran ist. Wer lieber selbst
liest, beginnt bei `docs/guide/00-START-HIER.md`.

## Quellenregel

Dieses Repo ist selbst ein Nachweis der Skelett-/Füllung-Trennung — wenn
etwas hier drin stackgebunden wirkt, ist das ein Fund, kein Feature. Meld
oder notier ihn, statt ihn mitzuschleppen.

## Erste Fassung

Dies ist die erste öffentliche Fassung. Das Harness selbst ist in sechs
Praxiszyklen gewachsen, die Führungsschicht darüber ist neu und noch nicht
von Anfang bis Ende durchlaufen worden. Wenn dir etwas fehlt, widersprüchlich
ist oder nicht funktioniert: melden. Das ist zu diesem Zeitpunkt wertvoller
als jede Politur.
