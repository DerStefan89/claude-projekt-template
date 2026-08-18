<!-- Ziel-Pfad im Repo: state/tooling.md -->
# Tooling-Bestand — [PROJEKTNAME]

## Im Einsatz

| Werkzeug | Zweck | Eingeführt (Datum) | Über Skill `werkzeug-auswahl` geprüft? |
|---|---|---|---|
| gitleaks | Secret-Scan in CI | 2026-08-08 (Commit `e23a9bb`, initiales Template-Gerüst) | [Annahme] vermutlich nein — vor diesem Programm eingeführt, keine Prüfspur gefunden |
| `.claude/skills/ponytail/` (vendorte Kopie, Versionspin `v4.8.4`, Lizenz MIT) | Ladder-Verfahren gegen Over-Engineering | 2026-08-08 (per `git log --diff-filter=A -1 --format=%as -- .claude/skills/ponytail/SKILL.md`) | [Annahme] vor diesem Programm übernommen, keine Prüfspur über den Skill `werkzeug-auswahl` gefunden |

## Bewusst nicht installiert

Werkzeuge, die absichtlich NICHT eingesetzt werden, mit Begründung — das
verhindert, dass dieselbe Frage in einem späteren Zyklus erneut aufgemacht
wird, ohne dass die frühere Entscheidung sichtbar ist.

| Werkzeug | Warum nicht | Entschieden am |
|---|---|---|
| [FÜLLUNG] | | |

## Offener Fund: Node-Bindung des Harness

[Fakt] Fünf Hook-Aufrufe laufen über `node`, `package.json` deklariert
`engines.node`, die CI-Toolchain ist Node.

[offene Unsicherheit] Ob das Harness damit node-gebunden ist, oder ob die
Mechanik (ein Prüf-Befehl, ein Gate pro Prüfung) genauso in einem
Python-/Foundry-/ffmpeg-Projekt trägt, ist ungeklärt.

[Entschieden 17.08.2026] Frage erneut vertagt — Ziel-Phase: Phase 3,
zusammen mit der Prüfbefehl-Indirektion 3b
(`state/plan-v2-phase2-adoptionsfaehigkeit.md`). Kein Fix in diesem
Vertrag.
