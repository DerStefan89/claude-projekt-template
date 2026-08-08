# Tokens sparen — dieselbe Arbeit, weniger Kosten

## Erst verstehen, wofür bezahlt wird

Ein **Token** ist die Abrechnungseinheit für KI-Text. Grob: ein Token ≈ 4
Zeichen ≈ ein halbes deutsches Wort. Eine Seite Text ≈ 500–700 Tokens.

Der entscheidende Punkt, den die meisten nicht wissen:

> **Bei jeder neuen Nachricht wird das gesamte bisherige Gespräch erneut
> mitgeschickt.**

Die KI hat kein Gedächtnis zwischen den Nachrichten. Was sie „weiß", steht
im Kontextfenster und wird jedes Mal komplett neu übertragen.

**Die Folge:** Eine Datei, die du in Nachricht 3 gelesen hast, kostet dich
in Nachricht 50 immer noch. Nachricht 80 einer langen Sitzung kann das
Zwanzigfache von Nachricht 5 kosten — bei gleicher Länge deiner Eingabe.

Daraus folgt die wichtigste Regel überhaupt:

> **Kurze, fokussierte Sitzungen sind der größte Hebel. Alles andere ist
> Feinschliff.**

---

## Die sieben wirksamsten Maßnahmen

### 1. Neue Sitzung bei neuer Aufgabe
Wenn die Aufgabe erledigt ist: Sitzung beenden. Nicht „ich frag noch
schnell was anderes" — das Andere zahlt dann die gesamte Vorgeschichte mit.

Genau dafür gibt es den Zwischenstand-Mechanismus: Er erlaubt dir, eine
Sitzung guten Gewissens zu beenden, weil der Stand gesichert ist.

**Wirkung: sehr groß. Aufwand: null.**

### 2. CLAUDE.md schlank halten
Sie wird in **jeder** Sitzung geladen. 200 Zeilen ≈ 2 000 Tokens, jedes
Mal, für immer.

Faustregel: Was in 90 % der Sitzungen irrelevant ist, gehört in eine
Datei, auf die verwiesen wird — nicht in CLAUDE.md selbst. Der Verweis
kostet eine Zeile, der Inhalt wird nur bei Bedarf geladen.

**Wirkung: groß, weil dauerhaft. Aufwand: gering.**

### 3. Ungenutzte MCPs abschalten
Jeder aktive MCP legt seine Werkzeugbeschreibungen ins Kontextfenster —
in jeder Sitzung, ob genutzt oder nicht. Zehn angeschlossene Dienste
können mehrere Tausend Tokens kosten, bevor du das erste Wort geschrieben
hast.

Schau nach, was tatsächlich angeschlossen ist, und trenne, was du diese
Woche nicht brauchst.

**Wirkung: groß bei vielen Diensten. Aufwand: gering.**

### 4. Gezielt lesen statt breit suchen
„Schau dir mal das Projekt an" führt dazu, dass Dutzende Dateien gelesen
werden — alle bleiben im Kontext, alle kosten in jeder Folgenachricht
erneut.

Besser: Sag, welche Datei. Oder lass gezielt nach einem Begriff suchen
statt ganze Ordner lesen.

Genau dafür ist der `repo-audit`-Skill da: Er macht einen strukturierten
Scan statt einer ungerichteten Erkundung.

**Wirkung: groß. Aufwand: eine Angewohnheit.**

### 5. Kommentare in Dateien — die Investition, die sich verzinst
Der `docs/kommentar-standard.md` verlangt in jeder Datei einen Kopf mit
Zweck, Aufrufern und Warnhinweisen.

Der Grund ist ökonomisch, nicht ästhetisch: Eine KI kann aus zehn Zeilen
Kopfkommentar entscheiden, ob sie die Datei überhaupt lesen muss. Ohne
Kommentar muss sie die ganzen 400 Zeilen lesen, um dasselbe zu erfahren.

**Wirkung: mittel, wächst mit dem Projekt. Aufwand: einmalig pro Datei.**

### 6. Handoff-Verträge für lange Aufgaben
Statt eine Aufgabe in derselben, schon vollen Sitzung weiterzutreiben:
Vertrag schreiben, frische Sitzung starten. Die frische Sitzung fängt bei
fast null Tokens an.

Der Vertrag kostet dich vielleicht 500 Tokens — die Alternative sind
20 000 mitgeschleppte aus dem bisherigen Gespräch.

**Wirkung: sehr groß bei langen Aufgaben. Aufwand: mittel.**

### 7. Agents statt Alleskönner-Sitzung
Ein `code-reviewer` startet mit frischem Kontext, liest gezielt und gibt
einen kurzen Bericht zurück. In deine Hauptsitzung fließt nur der Bericht,
nicht alles, was der Reviewer dafür lesen musste.

Das ist ein oft übersehener Nebeneffekt der Prüfrollen: Sie sind nicht nur
gründlicher, sie sind auch **billiger** als dieselbe Prüfung in der
Hauptsitzung.

**Wirkung: mittel bis groß. Aufwand: null (ist schon eingerichtet).**

---

## Was NICHT hilft

| Vermeintlicher Spartipp | Warum es nichts bringt |
|---|---|
| Kürzer schreiben, Höflichkeit weglassen | Deine Eingaben sind ein winziger Bruchteil. Der Kontext ist das Teure |
| Alles in eine Riesensitzung packen, „damit die KI alles weiß" | Das exakte Gegenteil. Genau hier entstehen die hohen Kosten |
| Dokumentation weglassen | Spart einmalig, kostet dauerhaft — die KI muss dann jedes Mal Code lesen, um zu verstehen, was ein Kommentar in zehn Zeilen gesagt hätte |
| Prüfrollen weglassen | Ein durchgerutschter Fehler kostet mehr als jede Prüfung |

---

## Die Kontext-Hygiene-Erinnerung

Der Hook `session-reminder.js` meldet sich alle 30 Nachrichten. Der Sinn:
Nach 30 Nachrichten merkst du nicht mehr, wie voll das Fenster ist — die
Antworten kommen weiter, nur teurer und ungenauer.

Wenn die Erinnerung kommt, drei Fragen:
1. Ist die aktuelle Aufgabe eigentlich abgeschlossen?
2. Schleppe ich Dateien mit, die ich nicht mehr brauche?
3. Wäre eine frische Sitzung mit Zwischenstand jetzt besser?

Meist lautet die Antwort auf mindestens eine davon: ja.

---

## Der Zusammenhang mit Qualität

Ein voller Kontext ist nicht nur teuer, er ist auch **schlechter**. Je
mehr Material im Fenster liegt, desto eher geht das Wichtige zwischen dem
Unwichtigen unter — dasselbe passiert einem Menschen nach fünf Stunden
Meeting.

Deshalb: Die Maßnahmen hier sparen nicht nur Geld. Sie sind derselbe
Hebel, der auch die Ergebnisqualität verbessert. Das ist der seltene Fall,
in dem billiger und besser dieselbe Richtung sind.
