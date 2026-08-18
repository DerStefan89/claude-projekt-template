<!-- Ziel-Pfad im Repo: state/triggers.md -->
# Trigger-Inventar — [PROJEKTNAME]

## Abgrenzung zu state/gates.md

Ein Gate prüft automatisch, ob etwas OK ist (Ja/Nein, deterministisch).
Ein Trigger ist eine Bedingung, bei der ein MENSCH oder ein
Modell-Evaluator bewusst eine bestimmte Handlung anstoßen soll — kein
Gate kann das erzwingen, weil die Bedingung nicht rein syntaktisch prüfbar
ist (z. B. "diese Architekturentscheidung hat Nebenwirkungen").

| Trigger | Bedingung | Auszulösende Handlung | Wer prüft |
|---|---|---|---|
| Neues Werkzeug | ein Werkzeug wird erwogen | zuerst im Werkzeug-Katalog nachschlagen, dann Skill `werkzeug-auswahl` | Mensch |
| Werkzeug mit hohem Blast Radius | das Werkzeug bekommt schreibenden Zugriff auf fremde Systeme, leitet Arbeitsinhalte an Dritte weiter oder protokolliert jeden Tool-Aufruf mit | Advisor-Pass VOR der Installation, kein Ausnahmefall | Mensch + Agent |
| Architekturentscheidung mit Alternativen | Mehr als eine plausible Umsetzung, Entscheidung schwer rückgängig zu machen | ADR anlegen (`docs/adr/TEMPLATE.md`) | Mensch |
| Architekturentscheidung mit Nebenwirkungen | Änderung betrifft mehr als eine Komponente/Datei-Grenze | `architecture-advisor` per `advisor-pass`-Skill gegenprüfen, bevor gebaut wird | Mensch + Agent |
| UI-Aufgabe abgeschlossen | UI-Code wurde gebaut/geändert | `code-reviewer` und (falls vorhanden) `design-guardian` | Agent |
| Vor "fertig" | Aufgabe wirkt abgeschlossen | `qa`-Agent für Randfälle/Akzeptanztests | Agent |
| Zyklus-Ende | Ein Lern-/Arbeitszyklus ist abgeschlossen | `HARNESS-LEARNING-STATE.md` + `HARNESS-CHANGELOG.md` nachtragen, noch vor dem nächsten Zyklus | Mensch |
| Sitzungsunterbrechung mitten in einer Aufgabe | Kontext geht zu Ende oder Aufgabe wird pausiert | Zwischenstand in `state/zwischenstand/<branch>.md` schreiben | Mensch/Agent |
| [FÜLLUNG] | | | |
