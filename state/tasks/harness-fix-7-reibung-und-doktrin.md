SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `8d89041`
(Vertrag 5, Commit-Guard härten) in `main` enthalten ist
(`git merge-base --is-ancestor 8d89041 HEAD`). Fehlt er, anhalten und
melden — nicht raten, ob der Merge stattgefunden hat. Danach
`npm run check:template` laufen lassen und den Ausgangsstand protokollieren
(erwartet: Exit 0).

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-7-reibung-und-doktrin

GOAL:
Reibung wird künftig in dem Werkzeug erfasst, das gemessen wird, statt in
einem fünften Repo, das niemand pflegt; die beiden Doktrinen aus dem
Register stehen dort, wo sie greifen; und die vertagte Frage nach der
Node-Bindung ist als Fund notiert statt zwischen zwei Phasen verschwunden.
Prüfbar an: `state/reibung.md` existiert, ist getrackt, hat ein
Zeilenformat und **keinen** `Stand dieser Fassung:`-Marker · ein
absichtlich gesetzter Marker macht Prüfung 3 nachweislich rot und das
Entfernen wieder grün · `state/memory-map.md` trägt vier neue Zeilen ·
der Kopfkommentar von `ARCHITECTURE.md` trägt die Aufteilungsregel ·
`SETUP.md` hat einen Punkt zur erzeugten Wahrheit · `state/tooling.md`
nennt die Node-Bindung als offenen Fund · `npm run check:template` → Exit 0.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase2-adoptionsfaehigkeit.md`, Pakete C
  und E sowie Vertrag 7. Befunde: `state/advisor-findings-phase2-
  adoptionsfaehigkeit.md`, insbesondere B9 (3b/Node-Bindung ist zwischen
  Phase 1 und 2 verschwunden) und B15 (der Reminder greift im Messfenster
  nicht).
- [Fakt] Befundregister: N9 (Reibungserfassung außerhalb des gemessenen
  Werkzeugs), R1 (keine Aufteilungsregel für ARCHITECTURE.md), R2 (keine
  Doktrin für erzeugte Wahrheit).
- [Fakt] `scripts/check-docs.mjs:202-205` lässt Prüfung 3 rekursiv über
  `docs/harness/**` und `state/**` laufen; `:215` überspringt jede Datei
  **ohne** `Stand dieser Fassung:`-Marker vollständig; `:228-239` meldet
  jedes Datum, das jünger ist als der Marker.
  [Schlussfolgerung] `state/reibung.md` ist ein Anhänge-Protokoll mit
  fortlaufenden Daten. Mit Marker würde jeder neue Eintrag das Gate rot
  färben. Deshalb bewusst **kein** Marker — und ein Kommentar im Dateikopf,
  der das begründet, sonst trägt ihn jemand gutgemeint nach.
- [Fakt] `.claude/hooks/session-reminder.js:6` setzt `INTERVALL = 30`; die
  Erinnerung erscheint erst bei jeder 30. Nachricht.
  [Schlussfolgerung] Im 60-Minuten-Messfenster einer harnessfremden Person
  wird die Schwelle voraussichtlich nicht erreicht. Die Reminder-Zeile ist
  die Langzeitmechanik; der Einstiegspfad läuft über `START-KLEIN.md`
  (Vertrag 8). Beides bauen, keins für das andere halten.
- [Fakt] `ARCHITECTURE.md` ist laut eigenem Kopfkommentar als **ganze Datei**
  Füllung. Der Kopfkommentar selbst ist der einzige Skelett-Teil und wandert
  unverändert in jeden Klon — deshalb gehört die Aufteilungsregel dorthin
  und nicht in einen der `[FÜLLUNG]`-Abschnitte.
- [Fakt] `state/plan-v2-phase1-vertraege.md:20`, `:234`, `:247`: 3b
  (Prüfbefehl-Indirektion) wurde ausdrücklich nach Phase 2 vertagt, mit der
  Grundsatzfrage „ist das Harness node-gebunden? Fünf Hook-Aufrufe laufen
  über `node`, dazu `engines` und die CI-Toolchain". [Entschieden
  17.08.2026] Erneut vertagt — aber benannt, nicht stillschweigend. Der
  Fund wird in diesem Vertrag notiert.
- [Fakt] `docs/guide/04-DEEPDIVE-gedaechtnis.md` erklärt jede Datei unter
  `state/` in einem eigenen Abschnitt — außer `state/freigabe-commit.md`,
  die in Vertrag 2 entstand und dort nie nachgetragen wurde.
  [Schlussfolgerung] Das ist eine Lücke an genau der Stelle, an der eine
  fremde Person nachschlägt, wenn der Commit-Guard sie stoppt. Sie wird in
  diesem Vertrag mitgeschlossen, weil dieselbe Datei ohnehin geöffnet wird.
  Das ist eine benannte Erweiterung gegenüber dem Register, keine stille.
- [Annahme] Vertrag 6 (Werkzeug-Katalog) läuft noch nicht, weil die
  Quelldatei `WERKZEUG-KATALOG.md` nicht vorliegt. Beide Verträge fassen
  `state/memory-map.md` an; läuft 6 später, entsteht dort ein Konflikt
  höchstens als zusätzliche Tabellenzeile.

SCOPE:

1. **`state/reibung.md` anlegen (neu, getrackt).** Kopf: Ziel-Pfad-Zeile wie
   in den übrigen `state/`-Dateien, Titel mit `[PROJEKTNAME]`, und ein
   Kommentarblock, der drei Dinge sagt: wofür die Datei da ist (eine Zeile
   pro Reibungsvorfall, im Projekt-Repo statt in einem fünften Repo, weil
   genau derjenige nicht wechselt, der gerade abkürzt) · dass sie
   **absichtlich keinen `Stand dieser Fassung:`-Marker trägt** und warum
   (Prüfung 3 würde bei jedem neuen Eintrag rot) · dass ein Eintrag eine
   Zeile ist und nicht ein Aufsatz.
   Tabelle mit den Spalten: `Datum` · `Was hat aufgehalten` · `Wo
   (Datei/Schritt)` · `Kosten (grob)` · `Erledigt?`. Eine `[FÜLLUNG]`-Zeile
   als Formatbeispiel, wie in `state/tooling.md` und `state/triggers.md`.
   **Keine echten Einträge** — das Template ist leer, die Einträge dieses
   Repos gehören nicht in jeden Klon.

2. **`.claude/hooks/session-reminder.js` ergänzen.** Eine Zeile in der
   bestehenden Erinnerungsmeldung, sinngemäß: „Hat dich etwas aufgehalten?
   Eine Zeile nach `state/reibung.md`." Am Intervall, an der Zählmechanik
   und an der Ausgabestruktur nichts ändern. [Fakt] Keine Änderung an
   `.claude/settings.json` nötig — der Hook ist dort bereits als
   `UserPromptSubmit` verkabelt.

3. **`state/memory-map.md` — vier neue Zeilen**, jeweils mit gefüllter
   „Nicht hierhin"-Spalte:
   - Reibungsvorfälle → `state/reibung.md`; nicht hierhin: nicht in
     `state/assumption-ledger.md` (dort stehen offene Annahmen, keine
     Vorfälle) und nicht in ein separates Repo.
   - Abgespaltener Architektur-Teilbereich → eigene Datei **plus**
     memory-map-Zeile **plus** Rückverweis aus `ARCHITECTURE.md`; nicht
     hierhin: keine Abspaltung ohne die drei Bedingungen aus der
     Aufteilungsregel.
   - Datenbankschema → erzeugt aus den Migrationen; nicht hierhin: keine von
     Hand gepflegte Schema-Datei unter `docs/`.
   - API-Vertrag → erzeugt aus dem Code; nicht hierhin: keine von Hand
     gepflegte API-Datei unter `docs/`. Was an beiden **Regel** ist
     (Namenskonvention, wer darf schreiben, Versionierung, Fehlerformat),
     bleibt in `ARCHITECTURE.md`.

4. **`ARCHITECTURE.md` — Aufteilungsregel in den Kopfkommentar.** Wörtlich
   nach dem Vorschlag aus dem Register: Ein Abschnitt wird eine eigene
   Datei, wenn **drei** Dinge zutreffen — er trägt mindestens drei echte,
   belegte Entscheidungen · er wird unabhängig vom Rest nachgeschlagen · er
   hat ein eigenes Gate. Vorher bleibt er ein Abschnitt. Dazu die zwei
   Pflichten bei jeder Abspaltung (memory-map-Eintrag mit „nicht
   hierhin"-Spalte, Rückverweis aus `ARCHITECTURE.md`, damit Prüfung 1 den
   Verfall fängt) und der Satz, dass `CLAUDE.md` dann sagen muss, **wann**
   welche Datei zu lesen ist, nicht nur dass.
   Der bestehende `[FÜLLUNG — GANZE DATEI]`-Hinweis bleibt unverändert
   stehen; die Regel kommt darunter. Die `[FÜLLUNG]`-Abschnitte selbst
   werden **nicht** angefasst.

5. **`SETUP.md` — neuer Punkt „Erzeugte Wahrheit einrichten".** Sinngemäß:
   Sobald das Projekt eine Datenbank oder eine öffentliche API hat, werden
   Schema und API-Vertrag nicht von Hand geschrieben, sondern erzeugt, und
   ein Gate wird rot, wenn das Erzeugte vom Stand abweicht (`dump | diff`
   als Muster). Die Mechanik ist Skelett, der konkrete Befehl ist Füllung.
   Einordnung in die bestehende Nummerierung so, dass die vorhandenen
   Punkte ihre Nummern behalten — ein neuer Punkt am Ende ist richtig, eine
   Umnummerierung wäre ein unnötiger Diff.
   [Fakt] `SETUP.md` ist ein Anweisungsdokument im Sinne von Prüfung 1
   (`check-docs.mjs`)? **Nein** — die Liste in `:44-59` enthält es nicht.
   Trotzdem gilt: keine Pfade nennen, die es nicht gibt.

6. **`state/tooling.md` — die Node-Bindung als Fund notieren.** Eigener
   kurzer Abschnitt unter der bestehenden Tabelle, mit Evidenz-Markern:
   [Fakt] fünf Hook-Aufrufe laufen über `node`, `package.json` deklariert
   `engines.node`, die CI-Toolchain ist Node · [offene Unsicherheit] ob das
   Harness damit node-gebunden ist oder ob die Mechanik in einem
   Python-/Foundry-/ffmpeg-Projekt trägt · [Entschieden 17.08.2026] Frage
   erneut vertagt, Ziel-Phase benennen (Phase 3, zusammen mit der
   Prüfbefehl-Indirektion 3b). Kein Fix in diesem Vertrag.

7. **`docs/guide/04-DEEPDIVE-gedaechtnis.md` — zwei Abschnitte ergänzen**,
   im Stil der vorhandenen (`### state/…`, danach zwei bis vier Sätze):
   - `state/reibung.md` — was hineingehört, warum es im Projekt-Repo liegt,
     und dass es bewusst kein Gate dafür gibt (ein Gate auf fehlende
     Einträge würde Ehrlichkeit bestrafen und Einträge erzeugen statt
     Reibung zu messen).
   - `state/freigabe-commit.md` — der zweite Schlüssel des Commit-Guards:
     wer sie anlegt (nur der Mensch, im eigenen Editor), welches Format die
     Zeile hat, dass sie für **einen** Git-Vorgang gilt und ein voller
     Iterationsabschluss deshalb zwei braucht, dass sie nie committet wird,
     und dass Bash-Zugriff auf sie absichtlich blockiert ist — auch `ls`
     und `cat`. Nachtrag aus Vertrag 2, siehe CONTEXT.

8. **Kalibrierung — der Rot- und Grün-Fall für die Marker-Entscheidung.**
   Nicht behaupten, dass ein `Stand dieser Fassung:`-Marker in
   `state/reibung.md` das Gate rot machen würde, sondern zeigen:
   - Rot: temporär einen Marker mit einem älteren Datum in den Kopf von
     `state/reibung.md` schreiben und in der `[FÜLLUNG]`-Beispielzeile ein
     jüngeres Datum eintragen → `node scripts/check-docs.mjs` muss genau
     diesen Befund melden, Exit 1. Ausgabe im Wortlaut protokollieren.
   - Grün: Marker und Testdatum wieder entfernen → Exit 0.
   - Beides in `state/gates.md` als Kalibrierungs-Log-Eintrag festhalten,
     mit dem Satz, dass die Marker-Freiheit dieser Datei damit eine geprüfte
     Entscheidung ist und keine Vermutung.

NICHT:
- Keine echten Reibungseinträge in `state/reibung.md`. Die Einträge dieses
  Repos gehören nicht in jeden Klon. Wohin sie stattdessen gehören, ist noch
  nicht entschieden — nicht hier entscheiden, nicht nebenbei anlegen.
- Kein Gate, kein Hook und keine Prüfung, die fehlende Reibungseinträge
  erzwingt.
- Kein `state/triggers.yml`, kein Generator, kein Sync-Gate — in Plan v2
  gestrichen.
- Kein `START-KLEIN.md`, kein Werkzeug-Katalog, keine Änderung an
  `README.md`. Das sind Vertrag 6 und 8.
- `.claude/hooks/commit-guard.js`, `guard-settings.js` und
  `.claude/settings.json` werden nicht angefasst.
- Keine neue Regel in `check-rules.mjs`. Keine Änderung an `package.json`,
  der Prüfkette oder `ci.yml`.
- `ARCHITECTURE.md` wird nicht inhaltlich gefüllt — nur der Kopfkommentar.
- Die Nummerierung der bestehenden `SETUP.md`-Punkte wird nicht verändert.
- `programm/` wird nicht angefasst und nicht gestaged.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die Freigabe-Vorgänge
für Commit und Push zählen nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/7-reibung-und-doktrin`, von `main` abgezweigt (nach
  bestätigtem Merge von Vertrag 5).
- Ein Commit auf diesem Branch, Message inhaltsbeschreibend.
- `npm run check:template` → Exit 0, Ausgabe zeigen.
- Protokoll aus SCHRITT 0 im Bericht, inklusive Bestätigung von `8d89041`.
- Beide Läufe aus Punkt 8 im Wortlaut (Rot mit Befundtext, Grün mit
  „Keine Befunde").
- Kalibrierungs-Log-Eintrag in `state/gates.md`.
- Für den Abschluss-Commit: `git diff --staged` vollständig zeigen, mein
  ausdrückliches „ja" abwarten. Freigabe-Datei kommt von mir, für Commit
  und Push getrennt — eine Freigabe gilt für einen Git-Vorgang.
- Beim Push `-u origin <branchname>` verwenden. [Fakt] Beim ersten Push
  eines Branches scheitert ein blankes `git push` an Git selbst, und der
  Hook hat die Freigabe zu diesem Zeitpunkt bereits verbraucht — real
  vorgekommen bei Vertrag 5.
- Danach PR-Status klären. [Fakt] `gh` ist auf dieser Maschine nicht
  installiert; den Link aus der Push-Ausgabe melden. NICHT selbst mergen.

ESCALATE:
- `8d89041` ist nicht in `main` → anhalten, melden, nicht vermuten, ob der
  Merge stattgefunden hat.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- Der Rot-Fall aus Punkt 8 tritt **nicht** ein, das Doku-Gate bleibt trotz
  gesetztem Marker und jüngerem Datum grün → anhalten und melden. Dann ist
  die Begründung für die Marker-Freiheit falsch, und sie muss vor dem
  Commit geklärt werden statt danach.
- Beim Ergänzen von `session-reminder.js` ändert sich die Ausgabestruktur
  (kein gültiges JSON mehr, oder der Zähler läuft anders) → anhalten, nicht
  improvisieren.
- `npm run check:template` wird rot und die Ursache liegt nicht in Punkt 8
  → Ausgabe vollständig zeigen, anhalten.
- Beim Schreiben fällt auf, dass eine der vier memory-map-Zeilen einer
  bestehenden Zeile widerspricht → anhalten und melden, statt die
  bestehende Zeile umzuschreiben.

FOLGT:
- Vertrag 6 (`harness-fix-6-werkzeug-katalog`) — derzeit blockiert, weil die
  Quelldatei `WERKZEUG-KATALOG.md` (Legende, Eintragsformat, Quellenregel,
  Haltbarkeitsklassen A–D) nicht vorliegt. Wird geschrieben, sobald sie da
  ist. Ohne sie wären Legende und Eintragsformat erfunden statt übertragen.
- Vertrag 8 (`harness-fix-8-start-klein`) zuletzt, weil er den Zustand
  beschreibt, den 5 bis 7 herstellen.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit und warte
auf mein ausdrückliches „ja".
