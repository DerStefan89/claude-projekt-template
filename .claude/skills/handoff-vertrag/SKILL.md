---
name: handoff-vertrag
description: Schreibt einen Handoff-Vertrag für eine abgegrenzte Teilaufgabe, die ein frischer Kontext oder ein anderer Agent ausführen soll — Minimalform plus Evidenz-Marker, Zuschnittprüfung und Stop-Grenzen. Nutzen, bevor eine Aufgabe an eine neue Sitzung/einen Subagenten übergeben wird, oder wenn der Nutzer sagt "Task-Datei", "Handoff", "Auftrag schreiben", "gib mir den Prompt". NICHT nutzen für triviale Einzelbefehle und nicht als Ersatz für Spec oder Plan bei mittleren und großen Vorhaben.
---

<!-- Verfahren aus der Praxis. Wenn du dieses Template als eigene
     Bibliothek pflegst: Aenderungen zuerst dort, dann hierher. -->

# Handoff-Vertrag

Eine Teilaufgabe = ein Kontext = ein Vertrag. Der Vertrag landet als Datei
auf der Platte (`state/tasks/<slug>.md`), nicht nur im Fenster — sonst
überlebt er keine Compaction und keinen Sitzungswechsel.

## Instructions

1. **Zuschnitt prüfen, bevor du schreibst.** Richtig geschnitten heißt: ein
   Baudurchgang plus höchstens eine Korrekturrunde, ein eigenständig
   prüfbares Artefakt, bei Fehlschlag isoliert wiederholbar. Passt die
   Aufgabe nicht hinein, teile sie.
2. **Ist-Zustand lesen, nicht annehmen.** Vor dem Schreiben die betroffenen
   Dateien tatsächlich lesen. Ist der Zielzustand schon erreicht, schreibe
   keinen Vertrag, sondern melde es als No-Op.
3. **Der Vertrag beginnt mit SCHRITT 0.** Vor der ersten Sektion steht
   wörtlich:

   ```
   SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
   Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
   ```

   Der Halt gehört an den Anfang, nicht ans Ende — ein Auftrag, der im
   falschen Ordner ausgeführt wurde, ist auch dann falsch, wenn er
   inhaltlich stimmt.
4. **Die sieben Sektionen füllen:**
   - `## TASK: <slug>` — der Dateiname ohne Endung.
   - `GOAL:` — eine prüfbare Zielaussage.
   - `CONTEXT:` — Pointer auf Dateien, Commits, Zeilen. Evidenz-Marker
     (`[Fakt]`, `[Schlussfolgerung]`, `[Annahme]`, `[offene Unsicherheit]`)
     pro Aussage.
   - `SCOPE:` — was dazugehört, gefolgt von `NICHT:` mit dem, was
     ausdrücklich nicht dazugehört.
   - `BUDGET:` — erwartete Durchgänge oder Zeit.
   - `OUTPUT:` — Artefakt, Pfad, Format, Belege.
   - `ESCALATE:` — wann angehalten und berichtet wird statt weiterzumachen.
5. **`FOLGT:` ist ein eigener, bedingter achter Punkt, kein Teil der
   sieben Sektionen.** Wird in der NICHT-Liste Arbeit vertagt, steht direkt
   danach der benannte Folgeauftrag (Datei/Slug). "Falls nötig" ohne diese
   Sektion ist keine Vertagung, sondern ein Verschwinden — real
   vorgekommen: ein Nachtrag, der nie geschrieben wurde, weil er nur als
   Absicht in einer NICHT-Liste stand. Wird keine Arbeit vertagt, entfällt
   der Punkt ganz.
6. **Evidenz-Marker im CONTEXT setzen.**
7. **Erwartetes Ergebnis mitgeben.**
8. **Stop-Grenzen statt Verbotskatalog.**
9. **Freigabe- und Staging-Regeln nennen, wenn Git im Spiel ist.** Kein
   Commit ohne Freigabe. Beim Stagen ausschließlich explizite Pfade, nie
   `-A` oder `.`. Für den Commit selbst den `git-flow`-Skill nutzen.
10. **Knapp halten.**

## Grenzen

Dieser Skill schreibt den Auftrag, er führt ihn nicht aus. Bei Aufgaben mit
Nebenwirkungen gehört vor den Vertrag ein Advisor-Pass (Skill
`advisor-pass`) und danach ein Reviewer-Pass.
