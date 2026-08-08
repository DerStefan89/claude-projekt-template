<!--
Ziel-Pfad im Repo: docs/harness/HARNESS-OVERVIEW.md
Stabil halten — nur bei echten Struktur-Änderungen am Harness pflegen, nicht
bei jedem Feature.
Stand dieser Fassung: [FÜLLUNG — Datum bei erster echter Befüllung setzen]
-->
# Harness Overview — [PROJEKTNAME]

Stabile Beschreibung, wie das Claude-Code-Harness dieses Projekts aufgebaut
ist und zusammenspielt. Für Lernstand und offene Punkte siehe
`HARNESS-LEARNING-STATE.md`, für Begriffe `HARNESS-GLOSSARY.md`.

## Aufbau

```
[PROJEKTNAME]/
├── CLAUDE.md            ← immer geladen: Stack, Regeln, Definition of Done
├── ARCHITECTURE.md      ← verbindliche Code-Konventionen
├── README.md            ← Setup + Prüf-Workflow für Menschen
├── docs/
│   ├── STATUS.md          ← einzige Quelle für Phasenstand/Scope
│   ├── kommentar-standard.md
│   ├── adr/                ← Architecture Decision Records
│   └── harness/             ← dieses Dateipaket
├── state/
│   ├── gates.md               ← Objective-Gates-Matrix
│   ├── assumption-ledger.md   ← Annahmen-Protokoll
│   ├── triggers.md             ← Trigger-Inventar
│   ├── memory-map.md           ← Info-Typ→Heimat-Tabelle
│   ├── tooling.md              ← Werkzeug-Bestand
│   ├── zwischenstand/          ← Aufgaben-Gedächtnis, NICHT committet außer VORLAGE.md
│   └── tasks/                  ← Handoff-Verträge
├── .claude/
│   ├── settings.json      ← permissions.allow + hooks
│   ├── agents/            ← architecture-advisor, code-reviewer, qa
│   │                          [FÜLLUNG bei UI: + design-guardian]
│   ├── skills/             ← ponytail, git-flow, repo-audit,
│   │                          werkzeug-auswahl, advisor-pass, spec-schreiben,
│   │                          handoff-vertrag
│   ├── commands/            ← lessons.md
│   └── hooks/               ← guard-settings.js, session-reminder.js,
│                                zwischenstand-laden.js, zwischenstand-pruefen.js
├── scripts/
│   ├── check-docs.mjs      ← Doku-Gate (5 Prüfungen), Teil von `npm run check`
│   ├── check-rules.mjs      ← Regel-Gate, leerer Harness bis zur ersten
│   │                            echten Regel
│   └── _mode.ts             ← Dry-Run-per-Default für schreibende Scripts
├── .worktreeinclude          ← in jeden neuen Worktree zu kopierende,
│                                gitignorierte Dateien
└── .github/workflows/ci.yml ← npm run check + Secret-Scan bei Push/PR
```

## Marker „Stand dieser Fassung:"

Eine Zeile, die am Zeilenanfang mit der Phrase `Stand dieser Fassung:
TT.MM.JJJJ` (oder `JJJJ-MM-TT`) beginnt, erklärt eine Datei für dieses Datum
gültig. Das Doku-Gate (`check-docs.mjs`, Prüfung 3) erzwingt das: `npm run
check` scheitert, wenn irgendwo sonst im selben Dokument ein jüngeres Datum
steht, ohne dass diese Zeile mitgezogen wurde.

## Regelhierarchie (wichtigste Regel des ganzen Harness)

Eine Regel in CLAUDE.md oder ARCHITECTURE.md ist zunächst nur Text — eine
Bitte. Erst eine der vier Ebenen macht sie technisch:

1. **Mensch** — Freigabe, Commit, letzte Entscheidung.
2. **Modell-Evaluator** — `.claude/agents/*` (nur lesend, kein
   Schreibrecht). `architecture-advisor` prüft Pläne vor dem Bauen, die
   anderen Agenten prüfen fertige Arbeit.
3. **Deterministische Gates** — CI (`npm run check` inkl. `check-docs.mjs`
   und `check-rules.mjs`, plus Secret-Scan), Required Status Check auf
   `main` ohne Admin-Bypass (siehe SETUP.md Punkt 1 — existiert nur als
   GitHub-Einstellung, kein Template kann sie mitbringen). Lokal zusätzlich
   zwei Hooks: `PostToolUse` (Linter bei jedem Edit/Write) und `PreToolUse`
   (`guard-settings.js`, blockiert Edit/Write auf die geteilte
   `.claude/settings.json`).
4. **Permissions/Sandbox** — `.claude/settings.json`.

Erfahrungswert zu dieser Reihenfolge: Textregeln (Ebene 1) biegen unter
Zeitdruck — mehrfach real beobachtet in der Codebasis, aus der dieses
Template destilliert wurde. Deterministische Gates (Ebene 3) hielten in
jedem beobachteten Fall.

## Wie mit dem Harness gearbeitet wird

1. CLAUDE.md lädt automatisch beim Session-Start.
2. Vor jeder Aufgabe: Briefing nach CLAUDE.md-Vorlage.
3. Jeder Edit/Write löst automatisch den Lint-Hook aus.
4. Vor einer Architekturentscheidung mit Nebenwirkungen:
   `architecture-advisor` per `advisor-pass`-Skill gegenprüfen. Nach dem
   Bauen: `code-reviewer`. Vor „fertig": `qa`.
5. Vor Commit: `npm run check` lokal. Push/PR: CI wiederholt es auf
   frischer Maschine.
6. Neues Werkzeug: Skill `werkzeug-auswahl` zuerst. Vor größeren
   Änderungen: Skill `repo-audit` für einen Ist-Stand-Scan.
7. Architekturentscheidungen mit Alternativen: ADR anlegen
   (`docs/adr/TEMPLATE.md`).
8. Jede Änderung an `main` — auch Doku — läuft über einen eigenen Branch,
   einen PR und einen grünen CI-Check.
9. Versuch, `.claude/settings.json` per Edit/Write zu ändern: wird vom
   `guard-settings.js`-Hook blockiert. Für eine echte, gewollte
   Team-Policy-Änderung den Hook-Eintrag in `hooks.PreToolUse` selbst
   vorübergehend entfernen, Grund im Commit nennen, danach wiederherstellen.
10. Mehrschritt-Aufgaben, die an eine andere Session/Kontext übergeben
    werden, als Handoff-Vertrag unter `state/tasks/` ablegen (Skill
    `handoff-vertrag`) — nicht nur als Prosa-Prompt im Fenster.
11. Bei einer Unterbrechung mitten in einer Aufgabe: Zwischenstand in
    `state/zwischenstand/<branch>.md` schreiben (Vorlage:
    `state/zwischenstand/VORLAGE.md`) — SessionStart lädt ihn automatisch
    in die nächste Sitzung, PreCompact blockiert eine manuelle Compaction
    ohne frischen Stand.
12. Für parallele Arbeit an mehreren Tasks: externe git-Worktrees anlegen.
    Auf Cloud-synchronisierten Ordnern (OneDrive, Dropbox) vorher den
    Reparse-Point-Status prüfen.
