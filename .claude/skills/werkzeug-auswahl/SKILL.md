---
name: werkzeug-auswahl
description: Prueft, ob ein Skill, MCP oder Plugin in dieses Projekt gehoert — Bedarf feststellen, Herkunft pruefen, Risiko bewerten, Entscheidung nach state/tooling.md schreiben. Nutzen, wenn ein neues Werkzeug im Gespraech ist, beim Aufsetzen eines neuen Projekts, oder wenn der Nutzer sagt "brauche ich das", "welches Werkzeug", "soll ich das installieren". NICHT nutzen, um ein bereits installiertes Werkzeug zu bedienen, und nicht als Ersatz fuer einen Advisor-Pass bei Aufgaben mit Nebenwirkungen.
---

<!-- Vendored aus DerStefan89/claude-playbook, skills/werkzeug-auswahl/SKILL.md. -->

# Werkzeug-Auswahl

**Grundregel: Bedarf zuerst.** Kein Werkzeug wird installiert, weil es
interessant aussieht — nur weil eine konkrete Aufgabe es braucht.

## Instructions

1. **Bedarf feststellen — vor allem anderen.** Frage nach der konkreten
   Aufgabe. Gibt es keine, endet die Pruefung hier: als "Parkplatz"
   notieren, nicht installieren. Einordnen: wiederkehrende Aufgabe → Skill
   · Zugriff auf ein externes System → MCP · ganze Arbeitsweise/Rolle →
   Plugin.
2. **Pruefen, ob es das schon gibt.** Vorhandene Skills, Subagenten,
   Slash-Kommandos und selbst gebaute Mechanik zuerst durchsehen.
3. **Herkunfts-Check.** Quell-Repo aufrufen — nie einen
   Verzeichnis-Eintrag. Wer pflegt es? Lizenz erkennbar? Juengere
   Aktivitaet? Telemetrie, abschaltbar? Bleibt etwas unklar: "unklar"
   eintragen, nicht raten.
4. **Installationsweg bewerten.** Nur eine SKILL.md kopiert, oder fuehrt
   die Installation fremden Code aus (Hooks, Gateway)? Bei ausfuehrbarem
   Code: Version pinnen und Herkunft dokumentieren (Muster: ponytail
   in diesem Repo).
5. **Risiko-Kriterien anwenden.** Blast Radius (Auth, Geld, oeffentliche
   Endpunkte, DB-Writes)? Bewaehrt an dieser Groessenordnung? Laesst sich
   Freigabedisziplin einstellen? Datenwirkung — was verlaesst die Maschine?
6. **Token-/Kostenwirkung benennen.** Grundlast (dauerhaft im Kontext)
   vs. Kosten je Aufruf. Grundlast ist die teurere Sorte.
7. **Entscheidung schreiben — auch die negative.** Nach `state/tooling.md`:
   Name, Typ, Zweck, Quelle/Lizenz, Status, Datum. Abgelehnte Werkzeuge mit
   Begruendung — sonst beginnt dieselbe Pruefung in einem halben Jahr von
   vorn.
8. **Nicht entscheiden, wo der Mensch entscheidet.** Vorschlagen,
   begruenden, Risiko benennen — nicht selbst installieren.

## Grenzen

Dieser Skill waehlt aus, er baut nicht. Er ersetzt weder einen
Advisor-Pass vor dem Bauen noch einen Reviewer-Pass danach.
