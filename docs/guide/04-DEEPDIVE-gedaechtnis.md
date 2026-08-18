# Deep Dive 4 — Gedächtnis: `docs/`, `state/`, `specs/`

## Das Problem

Eine KI-Sitzung endet und alles ist weg. Du selbst erinnerst dich nach
drei Wochen auch nicht mehr, warum eine Entscheidung so und nicht anders
gefallen ist.

Die Lösung ist nicht „mehr aufschreiben", sondern **jede Art von
Information hat genau einen festen Platz**. Sonst steht dasselbe an drei
Stellen, zwei davon veraltet.

Die Landkarte dafür ist `state/memory-map.md` — eine Tabelle, die sagt,
welche Sorte Information wo zuhause ist.

---

## Der Unterschied zwischen `docs/` und `state/`

| | `docs/` | `state/` |
|---|---|---|
| Für wen | Menschen, die das Projekt verstehen wollen | die laufende Arbeit |
| Lebensdauer | lange, wird gepflegt | oft kurzlebig |
| Beispiel | „So ist die Architektur aufgebaut" | „Hier stand ich, als ich unterbrochen wurde" |

Grobe Merkhilfe: `docs/` erklärt das Projekt, `state/` erinnert sich an
den Arbeitsprozess.

---

## `docs/` im Einzelnen

### `docs/STATUS.md`
Die **einzige** Quelle für „wo stehen wir gerade". Wenn dieselbe Auskunft
auch in CLAUDE.md und im README steht, sind zwei davon irgendwann falsch.

### `docs/kommentar-standard.md`
Wie Dateien und Funktionen kommentiert werden. Klingt nach Pedanterie, ist
aber der Grund, warum eine KI drei Monate später versteht, was eine Datei
soll, ohne sie ganz zu lesen — das spart Kontext und damit Geld.

### `docs/adr/` — Architecture Decision Records
**Was das ist:** Für jede Entscheidung mit echten Alternativen ein kurzes
Dokument: Kontext, Optionen, Entscheidung, Begründung.

Alltagsvergleich: das Protokoll einer Sitzung. Nicht um recht zu behalten,
sondern damit in einem halben Jahr niemand dieselbe Diskussion von vorn
führt — oder die Entscheidung ahnungslos umdreht.

Der wertvollste Teil ist die **Begründung**. Das *Was* steht ohnehin im
Ergebnis; das *Warum* ist das, was verloren geht.

Wann eine ADR: wenn es mehr als eine plausible Lösung gab **und** die
Entscheidung schwer rückgängig zu machen ist. Nicht bei jeder Kleinigkeit.

### `docs/harness/` — das Projekt beobachtet sich selbst
Drei Dateien, die von der Arbeit *am Projekt* handeln, nicht vom Projekt:

| Datei | Inhalt | Ändert sich |
|---|---|---|
| `HARNESS-OVERVIEW.md` | Wie das Harness aufgebaut ist | selten |
| `HARNESS-GLOSSARY.md` | Begriffe mit projektspezifischer Bedeutung | selten |
| `HARNESS-LEARNING-STATE.md` | Was gelernt wurde, mit Belegstelle | nach jedem Zyklus |
| `HARNESS-CHANGELOG.md` | Strukturänderungen am Harness | nach jedem Zyklus |

Die letzten beiden sind das **Paar**, das Prüfung 4 des Doku-Gates
zusammenhält: Ändert sich eins ohne das andere, ist wahrscheinlich etwas
vergessen worden.

Der `HARNESS-LEARNING-STATE.md` hat eine Regel, die wichtiger ist als sie
klingt: **Keine Erkenntnis ohne Beleg.** Wer eine Lehre notiert („X
funktioniert gut"), nennt die Datei, den Commit oder den Vorfall, aus dem
sie stammt. Eine erfundene Lehre ist eine ungeprüfte Behauptung mit
Autorität — die schlimmste Sorte.

### `docs/examples/`
Vorlagen, die **nicht** aktiv sind. Aktuell: `design-guardian.example.md`.
Liegt hier, damit UI-Projekte ihn hinüberkopieren können und
Nicht-UI-Projekte nicht mit einem Prüfer belastet werden, der bei ihnen
nichts prüft.

---

## `state/` im Einzelnen

### `state/gates.md`
Alle automatischen Prüfungen mit ihrer Kalibrierung (Rot-Fall, Grün-Fall
— siehe Deep Dive 3).

### `state/triggers.md`
**Auslöser** für Handlungen, die **kein Skript erzwingen kann**, weil die
Bedingung Urteilsvermögen braucht.

Der Unterschied zu Gates in einem Satz: Ein Gate prüft automatisch, ob
etwas in Ordnung ist. Ein Trigger erinnert einen Menschen daran, etwas zu
tun.

Beispiele aus dem Template: „Neues Werkzeug soll rein → erst im
Werkzeug-Katalog nachschlagen, dann `werkzeug-auswahl`". „Entscheidung mit
Nebenwirkungen → erst Advisor".
„Zyklus abgeschlossen → Lerntagebuch nachtragen".

### `state/assumption-ledger.md`
Jede Annahme, die getroffen wurde, weil eine sichere Klärung zu teuer war
— mit Datum, Fundstelle und Status (offen / bestätigt / widerlegt).

Der Sinn: Annahmen verschwinden sonst. Sie werden getroffen, wirken drei
Wochen weiter und niemand erinnert sich, dass sie nie geprüft wurden. Hier
stehen sie sichtbar, bis jemand sie auflöst.

### `state/memory-map.md`
Die Landkarte: welche Sorte Information wohin gehört, plus eine Spalte
„nicht hierhin" — der Teil, der Dopplungen tatsächlich verhindert.

### `state/tooling.md`
Was installiert ist, wofür, und ob es durch `werkzeug-auswahl` geprüft
wurde. Zweiter Abschnitt: **bewusst nicht installiert**, mit Begründung.

Der zweite Abschnitt ist der wertvollere. Er verhindert, dass in vier
Monaten dieselbe Werkzeugdebatte von vorn beginnt, weil niemand mehr weiß,
dass sie schon geführt wurde.

### `state/reibung.md`
Eine Zeile pro Reibungsvorfall — jeder Moment, in dem etwas den
Arbeitsfluss aufgehalten hat. Liegt im Projekt-Repo statt in einem
fünften, separat gepflegten Repo, weil genau die Person, die gerade
abkürzt, nicht zu einem weiteren Ort wechselt, um die Abkürzung
festzuhalten.

Bewusst **kein** Gate dafür: Ein Gate, das fehlende Einträge bestraft,
würde Ehrlichkeit bestrafen und Einträge erzeugen statt Reibung zu messen.
Die Datei trägt aus demselben Grund keinen `Stand dieser Fassung:`-Marker
— sie ist ein Anhänge-Protokoll, kein Dokument mit festem Stand.

### `state/freigabe-commit.md`
Der zweite Schlüssel des Commit-Guards. Wird **nur vom Menschen** angelegt,
im eigenen Editor — nicht von einem Modell, nicht über Bash. Format der
Zeile: `Freigegeben: <ISO-Zeitstempel>` (mit oder ohne Offset, auch UTC
mit `Z`).

Eine Freigabe gilt für **einen** Git-Vorgang (`commit` ODER `push`, nicht
beide) — ein vollständiger Iterationsabschluss laut `CLAUDE.md`
(„committen UND pushen") braucht deshalb zwei Freigaben nacheinander. Die
Datei wird **nie committet** (siehe `.gitignore`), und Bash-Zugriff auf
sie ist absichtlich blockiert — auch harmlos wirkende Befehle wie `ls`
oder `cat`, damit kein Modell ihren Inhalt lesen oder ihre Existenz über
einen Umweg prüfen kann.

### `state/tasks/` — Handoff-Verträge
**Was das ist:** Ein Auftrag, so aufgeschrieben, dass eine Sitzung ohne
jeden Vorkontext ihn ausführen kann. Feste Abschnitte:

```
TASK      — was zu tun ist, in einem Satz
GOAL      — woran man erkennt, dass es erreicht ist
CONTEXT   — was man wissen muss (mit Evidenz-Markern)
SCOPE     — und ausdrücklich: was NICHT dazugehört
BUDGET    — wie viel Aufwand angemessen ist
OUTPUT    — was am Ende vorliegen muss
ESCALATE  — wann abbrechen und fragen statt weitermachen
FOLGT     — was direkt danach zu tun ist
```

Warum als **Datei** und nicht als Chat-Nachricht: Eine Datei kann man
prüfen, versionieren und beim nächsten Mal wiederverwenden. Eine
Chat-Nachricht ist nach dem Sitzungsende weg.

Der Abschnitt `SCOPE — NICHT` ist der meistunterschätzte. Ohne ihn liefert
eine KI zuverlässig mehr, als du wolltest, und du merkst es erst beim
Prüfen.

`FOLGT` gibt es aus einem konkreten Grund: Formulierungen wie „danach
gegebenenfalls noch X" führen dazu, dass X nie passiert. Was folgen soll,
steht verbindlich da — oder gar nicht.

### `state/zwischenstand/`
Das Kurzzeitgedächtnis. Beim Unterbrechen einer Aufgabe schreibst du hier
hinein: Plan, Stand, Entscheidungen, Offenes. Der SessionStart-Hook lädt
die Datei beim nächsten Start automatisch.

Vier Abschnitte, aus der Vorlage:

| Abschnitt | Zweck |
|---|---|
| **Plan (fixiert)** | Der ursprüngliche Plan, unverändert — macht spätere Abweichung sichtbar |
| **Stand** | Was erledigt ist, woran gerade gearbeitet wird |
| **Entscheidungen** | Damit sie nicht in der nächsten Sitzung stillschweigend umgedreht werden |
| **Offen / Blockiert** | Was zuerst geklärt werden muss |

Diese Dateien werden **nicht** ins Repo eingecheckt (außer der Vorlage) —
sie sind Notizzettel, keine Dokumentation. Grenze: 10 000 Zeichen, weil
der Ladeweg dort gedeckelt ist.

---

## `specs/` — Spezifikationen

**Was das ist:** Die Beschreibung dessen, was gebaut werden soll —
**bevor** gebaut wird, und **ohne** zu sagen, wie.

Alltagsvergleich: Der Bauantrag, nicht der Bauplan. Er legt fest, was
entstehen soll und woran man erkennt, dass es fertig ist.

Ein Spec beantwortet drei Fragen:
1. Wer will was, und warum? (wie eine User Story)
2. Woran erkennt man, dass es fertig ist? (prüfbare Kriterien)
3. Was gehört ausdrücklich nicht dazu?

**Warum das der wirksamste einzelne Schritt im ganzen Prozess ist:** Eine
KI baut sofort los, wenn du sie lässt — und baut dann etwas Plausibles,
das nicht ganz das ist, was du meintest. Der Unterschied kostet dich eine
komplette Runde. Ein Spec zwingt beide Seiten, sich vorher zu einigen,
wenn eine Korrektur noch einen Satz kostet statt eines halben Tages.

Der Skill `spec-schreiben` führt durch das Format.

**Für Nicht-Software-Vorhaben:** Genauso anwendbar. Ein Spec für ein
KI-Video: Wer schaut es, was soll er danach tun, wie lang, welcher Ton,
was kommt ausdrücklich nicht rein. Ein Spec für eine
Marketing-Automatisierung: Welche Auslöser, welche Empfänger, welche
Ausnahmen, was passiert im Fehlerfall.
