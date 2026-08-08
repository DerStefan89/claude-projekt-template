---
name: git-flow
description: Fuehrt den Standard-Workflow fuer eine freigegebene, kleine Aenderung aus — Branch anlegen, gezielt stagen, Diff zur Freigabe zeigen, ehrlich committen, pushen, PR-Link/Status nennen. Nutzen nach jeder abgeschlossenen Iteration, wenn eine geprueft Aenderung committet und ein PR eroeffnet werden soll. Ersetzt NICHT die Freigabe des Menschen und merged niemals selbst.
---

<!-- Verfahren aus der Praxis. Wenn du dieses Template als eigene
     Bibliothek pflegst: Aenderungen zuerst dort, dann hierher. -->

# Git-Flow

## Instructions

1. `git status` und `git branch -vv` zeigen, bevor irgendetwas passiert.
2. Laeuft die Sitzung bereits in einem dedizierten Worktree auf dem passenden
   Branch: NICHT von `main` neu branchen. Direkt auf diesem Branch committen.
3. Sonst Ziel main-Basis: `git checkout main && git pull` zuerst. Verweigert
   Git den Checkout wegen uncommitted Aenderungen: NICHT force/reset.
   Stattdessen `git stash`, wechseln, Branch anlegen, `git stash pop`, danach
   das Ergebnis verifizieren statt dem Diff blind zu vertrauen.
4. `git add` NUR der explizit besprochenen Dateien — nie `git add .` oder
   `git add -A`.
5. `git diff --staged` vollstaendig zeigen, ausdruecklich um Freigabe bitten.
   Nicht committen ohne klares "ja". **Der Freigabe-Halt steht als LETZTER
   Satz des Prompts, nie zwischen zwei Arbeitsanweisungen** — sonst
   autorisiert er versehentlich die ganze Kette. Anti-Pattern "der Halt in
   der Mitte", real vorgekommen und mit einem ungewollten Commit bezahlt.
6. Nach Freigabe: committen mit ehrlicher, inhaltsbeschreibender Message.
7. Pushen.
8. PR-Status klaeren: `gh auth status` pruefen. Verfuegbar → `gh pr create`/
   `gh pr checks`. Nicht verfuegbar → NICHT einrichten, stattdessen den
   "Create a pull request..."-Link aus der Push-Ausgabe nennen und per
   unauthentifizierter GitHub-API pruefen, ob bereits ein PR existiert.
9. CI-Status pruefen.
10. NIEMALS selbst mergen — das bleibt beim Menschen. Nur melden, dass CI
    gruen ist und der PR bereit waere.

## Common Issues

- Checkout verweigert wegen uncommitted Changes → stash/pop mit
  Nachverifikation, nicht force.
- `gh` fehlt → nicht installieren, auf Push-Ausgabe/API ausweichen.
- Race Condition: PR existiert oder ist bereits gemerged, waehrend man noch
  prueft → vor dem Erstellen immer erst nachsehen. Auch ein GitHub-
  Bequemlichkeitslink nach `git push` kann von einem Menschen im
  Vorbeigehen angeklickt werden — real vorgekommen.
- Trotz gruener CI selbst mergen wollen → nein, das ist Ebene 1 (Mensch) der
  Regelhierarchie.
- Freigabe-Rueckfrage generisch formuliert statt die Handlung im Klartext
  zu nennen ("Jetzt committen UND pushen?") → wird im Vorbeigehen bestaetigt.
