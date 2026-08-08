# Dein eigenes Projekt aufsetzen

Reihenfolge ist wichtig. Wer bei Schritt 6 anfängt, baut auf ungeprüftem
Grund.

---

## Phase A — Bevor du irgendetwas anfasst (30 Minuten)

### A1. Lies `06-DER-PROZESS.md`
Wenn du nur ein Dokument liest, dann das. Alles andere ergibt erst Sinn,
wenn der Ablauf klar ist.

### A2. Beantworte drei Fragen schriftlich

1. **Was soll am Ende existieren?** Ein Satz. Wenn du zwei brauchst, ist
   das Vorhaben noch nicht scharf genug.
2. **Woran erkennst du, dass es funktioniert?** Etwas Prüfbares, nicht
   „läuft gut".
3. **Was gehört ausdrücklich nicht dazu?** Mindestens drei Punkte.

Diese drei Antworten sind dein erster Spec. Bewahr sie auf.

### A3. Ehrlichkeitsfrage: Brauchst du das Harness überhaupt?

| Anzeichen dafür | Anzeichen dagegen |
|---|---|
| Läuft über Wochen | In zwei Nachmittagen erledigt |
| Mehrere Leute beteiligt | Nur du, einmalig |
| Etwas darf nicht kaputtgehen | Experiment, Wegwerfcode |
| Viele Sitzungen mit KI | Ein paar Fragen |

Bei „dagegen": Nimm dir einzelne Teile (Spec schreiben, Definition of
Done) und lass den Rest weg. Ein Harness um ein Wochenendprojekt ist
Verwaltung ohne Gegenwert.

---

## Phase B — Repo aufsetzen (20 Minuten)

### B1. Projekt aus dem Template erzeugen

**Auf GitHub:** Auf der Seite des Templates auf **„Use this template" →
„Create a new repository"**. Namen wählen, Sichtbarkeit festlegen,
anlegen. Danach lokal klonen:

```
git clone https://github.com/<dein-name>/<dein-projekt>.git
cd <dein-projekt>
```

**Ohne GitHub:** Ordner kopieren, dann die Baugeschichte des Templates
entfernen und eine eigene beginnen:

```
rm -rf .git
git init
```

Der Grund: Die Historie des Templates gehört nicht zu deinem Projekt.

### B2. Ablageort prüfen
Wenn der Ordner in einem cloudsynchronisierten Verzeichnis liegt
(OneDrive, Dropbox, iCloud): Sei gewarnt. Die Sync-Software greift
zeitgleich auf dieselben Dateien zu wie Git — das erzeugt Fehler, die
aussehen wie Git-Fehler und keine sind. Drei bekannte Fälle stehen in
`CLAUDE.md` unter „Bekannte Fallen".

Wenn möglich: außerhalb des Sync-Ordners arbeiten.

### B3. `SETUP.md` durchgehen
Sieben Punkte, die kein Template als Datei mitbringen kann. Punkt 1
(Branch Protection) ist der wichtigste — und der mit dem Vorbehalt: Bei
privaten Repos auf einem GitHub-Free-Konto wird die Regel angelegt, aber
**nicht durchgesetzt**. Prüf das, bevor du dich darauf verlässt.

---

## Phase C — Füllen (2–3 Stunden)

Suche im ganzen Ordner nach `[FÜLLUNG]`. Das ist deine Arbeitsliste.

### C1. `CLAUDE.md` — Kopfbereich
Produktsatz, Stack, Befehle. **Nur diese.** Die Prozessabschnitte
(Briefing, Definition of Done, Status-Format) bleiben unverändert — sie
sind der bewährte Teil.

### C2. `package.json` — die Prüfkette
Trag echte Befehle für `lint`, `typecheck`, `test` ein. Die Zeile `check`
selbst nicht ändern.

Wenn dein Vorhaben keine Software ist: Schreib ein einfaches Prüfskript,
das das prüft, was bei dir schiefgehen kann — fehlende Dateien, falsche
Formate, nicht ersetzte Platzhalter. Anfangs reichen zwanzig Zeilen. Die
Mechanik „ein Befehl prüft alles" ist wichtiger als ihr Umfang.

### C3. Erster echter `npm run check`
Muss durchlaufen. Nicht weitermachen, bevor er grün ist — ein Gate, das
von Anfang an rot ist, gewöhnt dich daran, es zu ignorieren.

### C4. `ARCHITECTURE.md` — **noch nicht**
Bewusst leer lassen. Sie füllt sich mit der ersten echten
Architekturentscheidung. Wer sie vorab füllt, schreibt Regeln auf, die er
nie geprüft hat — und hält sie danach für verbindlich.

### C5. Ist es ein UI-Projekt?
Wenn ja: `docs/examples/design-guardian.example.md` nach
`.claude/agents/design-guardian.md` kopieren und anpassen.
Wenn nein: weglassen.

### C6. Werkzeuge
Vor der ersten Installation: Skill `werkzeug-auswahl`. Ergebnis — auch ein
„brauchen wir nicht" — nach `state/tooling.md`.

---

## Phase D — Der erste echte Durchgang (ein Tag)

Nimm die **kleinste sinnvolle** Aufgabe. Nicht die wichtigste — die
kleinste. Du lernst hier den Prozess, nicht das Produkt.

1. Spec schreiben (Skill `spec-schreiben`) → `specs/`
2. Plan v1 als Datei
3. `architecture-advisor` darauf ansetzen
4. Plan v2 als **neue** Datei
5. Handoff-Vertrag (Skill `handoff-vertrag`) → `state/tasks/`
6. Bauen
7. `code-reviewer` + `qa`
8. `npm run check` → Commit → PR → CI → Merge

**Auch wenn es sich übertrieben anfühlt: einmal komplett durchlaufen.**
Danach weißt du aus Erfahrung, welche Schritte bei dir tragen und welche
du bei kleinen Aufgaben überspringen kannst. Vorher rätst du nur.

---

## Phase E — Nachbereitung (30 Minuten, der meistübersprungene Teil)

### E1. Gates kalibrieren
Für jedes Gate: einmal absichtlich dagegen verstoßen, prüfen, dass es rot
wird. Ergebnis mit Datum nach `state/gates.md`.

Ein Gate, das nie ausgelöst hat, ist ungeprüft. Ein Skript mit einem
Tippfehler im Suchmuster meldet nie etwas und sieht dabei genauso aus wie
eins, bei dem alles in Ordnung ist.

### E2. Lerntagebuch
`docs/harness/HARNESS-LEARNING-STATE.md`: Was hat funktioniert, was nicht,
**mit Belegstelle**. Keine Erkenntnis ohne Vorfall — eine erfundene Lehre
ist eine ungeprüfte Behauptung mit Autorität.

Direkt danach `HARNESS-CHANGELOG.md`, wenn sich strukturell etwas geändert
hat. Die beiden gehören zusammen; genau deshalb koppelt Prüfung 4 des
Doku-Gates sie.

### E3. Erst jetzt: `dokumentPaare` eintragen
Wenn beide Dateien echten Inhalt haben, das Paar in `check-docs.mjs`
(Prüfung 4) eintragen. Ab da meldet das Gate, wenn eins der beiden
zurückbleibt.

---

## Die häufigsten Fehler beim Start

| Fehler | Folge | Gegenmittel |
|---|---|---|
| ARCHITECTURE.md vorab füllen | Ungeprüfte Regeln gelten als verbindlich | Leer lassen, mit erster echter Entscheidung füllen |
| Regeln in `check-rules.mjs` erfinden | Reibung ohne Nutzen | Erst nach dem dritten identischen Fehler |
| Alle Prüfrollen bei jeder Kleinigkeit | Prozess fühlt sich absurd an, wird ganz aufgegeben | Advisor nur bei Entscheidungen mit Nebenwirkungen |
| Gates einrichten, nie testen | Falsche Sicherheit | Kalibrieren, Ergebnis nach `state/gates.md` |
| CLAUDE.md ständig erweitern | Teuer und unübersichtlich | Was rein soll, verdrängt etwas anderes |
| Zwischenstand überspringen | Nächste Sitzung beginnt bei null | Fünf Minuten am Ende, spart vierzig am Anfang |
| Lerntagebuch überspringen | Derselbe Fehler kommt wieder, unbemerkt als Wiederholung | Direkt nach Zyklusende, nicht „demnächst" |

---

## Was nach vier Wochen anders sein sollte

Wenn das Harness bei dir greift, merkst du es an diesen Zeichen:

- Du weißt jederzeit, wo du stehst, ohne nachzudenken — es steht in
  `docs/STATUS.md`.
- Du erinnerst dich nicht mehr an Begründungen, **und musst es auch
  nicht** — sie stehen in `docs/adr/`.
- Ein Fehler, den du früher zweimal gemacht hättest, wird beim zweiten Mal
  von einem Gate gestoppt.
- Eine neue Sitzung ist in zwei Minuten arbeitsfähig statt in zwanzig.
- Du gibst Dinge frei, ohne sie dreimal zu prüfen — weil vor der Freigabe
  schon drei Prüfungen liefen, die nicht von deiner Tagesform abhängen.

Wenn nach vier Wochen keins davon eingetreten ist, füllst du wahrscheinlich
Formulare statt zu arbeiten. Dann streich die Teile, die dir nichts
gebracht haben — und schreib in `HARNESS-LEARNING-STATE.md`, **warum**.
Auch das ist ein Ergebnis.
