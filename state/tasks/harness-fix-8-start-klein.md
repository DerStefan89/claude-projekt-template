SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `b5b5919`
(Vertrag 7, Reibung und Doktrin) in `main` enthalten ist
(`git merge-base --is-ancestor b5b5919 HEAD`). Fehlt er, anhalten und
melden — nicht raten, ob der Merge stattgefunden hat. Danach
`npm run check:template` laufen lassen und den Ausgangsstand protokollieren
(erwartet: Exit 0).

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-8-start-klein

GOAL:
Eine fremde Person findet am Repo-Wurzelverzeichnis genau eine Datei, die
sie zuerst liest, kommt darin ohne Suchen durch die vier Meilensteine
(Umgebung, Orientierung, echte Änderung, voller Zyklus), und ein toter
Verweis darin wird vom bestehenden Doku-Gate gefangen wie jeder andere
Anweisungsverweis auch. Prüfbar an: `START-KLEIN.md` existiert, ist
`Erstlektüre: ja`, höchstens 120 Zeilen · `README.md`, Abschnitt
„Loslegen", nennt sie als ersten Schritt, der geführte Weg bleibt als
zweiter, benannter Weg stehen · `scripts/check-docs.mjs` prüft
`START-KLEIN.md` wie jede andere Anweisungsdatei · ein absichtlich toter
Verweis darin macht Prüfung 1 nachweislich rot, das Entfernen wieder grün ·
`npm run check:template` → Exit 0.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase2-adoptionsfaehigkeit.md`, Paket F
  (Zeilen 354–374) und Vertrag 8 in der Vertragstabelle (Zeile 426).
  Befunde: `state/advisor-findings-phase2-adoptionsfaehigkeit.md`,
  insbesondere B5 (`START-KLEIN.md` ohne Gate-Abdeckung), B6
  (Kontextbudget zählt die falschen Dateien), B11 (Versionsnummern-Falle
  nicht vorhergesagt), B12 (Messaufbau), B13 (weitere Stolperstellen im
  Hook).
- [Fakt] Befundregister: N11 (`START-KLEIN.md` fehlt).
- [Fakt] `scripts/check-docs.mjs:44-59` — `anweisungsDateien` enthält
  aktuell hartkodiert `CLAUDE.md`, `ARCHITECTURE.md`, `README.md`, plus
  alles unter `.claude/agents/`, `.claude/skills/*/SKILL.md`,
  `.claude/commands/`. `START-KLEIN.md` steht nicht in der Liste.
  `:104-128` (Prüfung 1) liest jede Datei aus dieser Liste zeilenweise,
  sucht Backtick-Pfade mit bekannten Endungen (`.md`/`.ts`/`.tsx`/`.js`/
  `.mjs`/`.json`), und meldet bei einem bloßen Dateinamen ohne `/`
  (`:121-124`) einen Befund, wenn der Name in keiner Datei im Repo
  vorkommt.
- [Fakt] `README.md:11-29` („Loslegen") beschreibt heute ausschließlich den
  geführten Weg über ein Claude-Projekt (drei Schritte). `README.md:65-79`
  („Bootstrap im Detail") ist der Selbstweg zum Nachschlagen; Schritt 2 dort
  (`:72-73`) lautet wörtlich „`SETUP.md` lesen und abarbeiten".
  [Schlussfolgerung] Das ist auf dem gemessenen Selbstweg die falsche
  Anweisung — `SETUP.md` hat 97 Zeilen und acht Punkte, von denen für den
  60-Minuten-Pfad nur Punkt 1 (Branch Protection, push-relevant) sofort
  zählt.
- [Fakt] `package.json:5-7` verlangt `engines.node: "24.x"`, ohne
  `engine-strict` erzwungen. [Schlussfolgerung] Ein falsches Node auf der
  PATH löst keinen Fehler, sondern diffuse Folgefehler — deshalb steht die
  Versionsprüfung laut Plan v2 als allererste Zeile im Dokument, nicht als
  Fußnote.
- [Fakt] `.claude/hooks/commit-guard.js` (Vertrag 5, gehärtet):
  Freigabe-Zeile-Format `Freigegeben: <ISO-Zeitstempel>` (mit oder ohne
  Offset, auch `Z`), eine Freigabe gilt für **einen** Git-Vorgang, Bash-
  Zugriff auf `state/freigabe-commit.md` — auch `ls`/`cat` — ist absichtlich
  blockiert. Alle drei Punkte sind laut Plan v2 2.3 vorhergesagte
  Bruchstellen der Messung (M4) und müssen deshalb **namentlich** im
  Dokument stehen, nicht nur mechanisch im Hook.
- [Fakt] `.claude/hooks/session-reminder.js` verweist seit Vertrag 7 auf
  `state/reibung.md`; laut Plan v2 B15 erreicht der Zähler
  (`INTERVALL = 30`) das 60-Minuten-Messfenster voraussichtlich nicht —
  `START-KLEIN.md` muss `state/reibung.md` deshalb selbst nennen.
- [Fakt] Plan v2 2.2, M2: Drei Fragen, die ohne Suchen beantwortbar sein
  müssen — (a) Wo steht, was verbindlich gilt? (b) Wo trage ich ein, dass
  mich etwas aufgehalten hat? (c) Was muss passieren, damit ein Commit
  durchgeht? [Schlussfolgerung] Das ist kein Test in diesem Vertrag
  (Paket G, Menschenarbeit), aber eine Bau-Leitplanke: Wer die Antworten
  nicht in `START-KLEIN.md` findet, kann M2 nicht erreichen.
- [Fakt] Plan v2 2.3, Punkt 2: Prüfung 2 (`check-docs.mjs:149`) läuft über
  `CLAUDE.md` und `ARCHITECTURE.md` — konkrete Versionsnummern im
  Stack-Block (z. B. „React 19.1") machen `check:template` rot, „React 19"
  nicht. `START-KLEIN.md` muss diesen Satz vorwegnehmen, damit ein
  korrekt arbeitendes Gate nicht wie ein Defekt aussieht.

SCOPE:

1. **`START-KLEIN.md` anlegen (neu, getrackt, Repo-Wurzel).** Kopf:
   `Erstlektüre: ja`. Harte Grenze: **höchstens 120 Zeilen** — bei
   Überschreitung kürzen, nicht die Grenze in Frage stellen. Gliederung
   entlang der vier Meilensteine aus Plan v2 2.2 (Umgebung, Orientierung,
   echte Änderung, voller Zyklus), mit einem ausdrücklichen Satz, was man
   jetzt **nicht** liest (Guide unter `docs/guide/`, Deep Dives, Werkzeug-
   Katalog, Doktrin-Abschnitte in `ARCHITECTURE.md`/`SETUP.md`).
   Muss namentlich enthalten:
   - Node-Versionsprüfung als einer der ersten Punkte (`node -v`, erwartet
     `24.x` laut `package.json`).
   - Das exakte Format der Freigabe-Zeile und dass ein vollständiger
     Iterationsabschluss (committen **und** pushen) zwei getrennte
     Freigaben braucht, eine pro Git-Vorgang.
   - Dass Bash-Zugriff auf `state/freigabe-commit.md` absichtlich
     blockiert ist, auch `ls` und `cat`.
   - Dass Stack-Block-Einträge in `CLAUDE.md`/`ARCHITECTURE.md` **keine**
     Versionsnummern tragen dürfen (Prüfung 2).
   - `state/reibung.md` — eine Zeile, wenn etwas aufhält.
   - Ein punktueller Verweis auf `SETUP.md` Punkt 1 (Branch Protection) im
     Zusammenhang mit dem Push — nicht die Aufforderung, `SETUP.md` als
     Ganzes zu lesen.

2. **`README.md`, Abschnitt „Loslegen" (Zeilen 11–29) umbauen.**
   `START-KLEIN.md` wird als erster, empfohlener Weg genannt; der
   bestehende geführte Weg über ein Claude-Projekt bleibt vollständig
   erhalten, aber als zweiter, benannter Weg. Keine der beiden
   Beschreibungen wird inhaltlich gekürzt.
   Zusätzlich in „Bootstrap im Detail" (Zeilen 65–79): Schritt 2 (Zeile
   72, „`SETUP.md` lesen und abarbeiten") wird auf einen punktuellen
   Verweis umgestellt — welcher `SETUP.md`-Punkt wann greift, statt „lesen
   und abarbeiten" als Ganzes. Die übrigen vier Bootstrap-Schritte bleiben
   unverändert stehen.

3. **`scripts/check-docs.mjs:44-59` — `'START-KLEIN.md'` in
   `anweisungsDateien` aufnehmen.** Eine Zeile, im bestehenden
   Geltungsbereich von Prüfung 1, nach `'README.md',`. Keine neue Prüfung,
   keine neue Datei-Endung, keine Änderung an Prüfung 2–5.

4. **Kalibrierung — Rot- und Grün-Fall für Prüfung 1 auf
   `START-KLEIN.md`.** Nicht behaupten, sondern zeigen:
   - Rot: temporär einen Backtick-Verweis auf eine nicht existierende Datei
     (z. B. `` `nicht-vorhanden.md` ``) in `START-KLEIN.md` einfügen →
     `node scripts/check-docs.mjs` muss genau diesen Befund melden
     (Muster: „START-KLEIN.md:<Zeile>: Verweis auf `nicht-vorhanden.md` —
     Datei existiert nirgends im Repo"), Exit 1. Ausgabe im Wortlaut
     protokollieren.
   - Grün: den Testverweis wieder entfernen → Exit 0.
   - Beides als Kalibrierungs-Log-Eintrag in `state/gates.md` festhalten,
     mit dem Satz, dass die Gate-Abdeckung von `START-KLEIN.md` damit eine
     geprüfte Entscheidung ist und keine Vermutung.

NICHT:
- Keine Durchführung von Paket G (Kalt-Lauf, Fix-Runde, menschliche
  Messung). Das ist Menschenarbeit ohne Vertrag und folgt, nachdem dieser
  Vertrag gemergt ist — nicht Teil dieses Baudurchgangs.
- `.claude/hooks/commit-guard.js`, `guard-settings.js`,
  `session-reminder.js` und `.claude/settings.json` werden nicht
  angefasst — nur referenziert.
- Keine neue Regel in `check-rules.mjs`. Keine Änderung an `package.json`
  oder `.github/workflows/ci.yml`.
- Keine inhaltliche Änderung an `docs/harness/werkzeug-katalog.md`,
  `state/reibung.md` oder sonstigen Vertrag-6/7-Artefakten — nur
  Verweise darauf in `START-KLEIN.md`.
- Die übrigen vier Punkte in „Bootstrap im Detail" (1, 3, 4, 5) werden
  inhaltlich nicht verändert, nur Schritt 2.
- `SETUP.md` wird nicht umnummeriert oder inhaltlich verändert — nur aus
  `START-KLEIN.md`/`README.md` heraus punktuell referenziert.
- `programm/` wird nicht angefasst und nicht gestaged.
- Keine Versionsnummer wird in `START-KLEIN.md` selbst als Beispiel
  eingetragen, die Prüfung 2 auslösen könnte (Prüfung 2 läuft zwar nur über
  `CLAUDE.md`/`ARCHITECTURE.md`, aber ein Beispieltext mit echter
  Versionsnummer wäre trotzdem ein schlechtes Vorbild).

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die Freigabe-Vorgänge
für Commit und Push zählen nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/8-start-klein`, von `main` abgezweigt (nach
  bestätigtem Merge von Vertrag 7).
- Ein Commit auf diesem Branch, Message inhaltsbeschreibend.
- `npm run check:template` → Exit 0, Ausgabe zeigen.
- Protokoll aus SCHRITT 0 im Bericht, inklusive Bestätigung von `b5b5919`.
- Zeilenzahl von `START-KLEIN.md` explizit nennen (Beleg für „höchstens
  120 Zeilen").
- Beide Läufe aus Punkt 4 im Wortlaut (Rot mit Befundtext, Grün mit
  „Keine Befunde").
- Kalibrierungs-Log-Eintrag in `state/gates.md`.
- Für den Abschluss-Commit: `git diff --staged` vollständig zeigen, mein
  ausdrückliches „ja" abwarten. Freigabe-Datei kommt von mir, für Commit
  und Push getrennt — eine Freigabe gilt für einen Git-Vorgang.
- Beim Push `-u origin <branchname>` verwenden (erster Push dieses
  Branches).
- Danach PR-Status klären. `gh` ist auf dieser Maschine nicht installiert;
  den Link aus der Push-Ausgabe melden. NICHT selbst mergen.

ESCALATE:
- `b5b5919` ist nicht in `main` → anhalten, melden, nicht vermuten, ob der
  Merge stattgefunden hat.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- `START-KLEIN.md` überschreitet 120 Zeilen und lässt sich ohne
  Informationsverlust an einem der sechs Pflichtpunkte nicht weiter kürzen
  → anhalten, melden, nicht stillschweigend eine der Pflichtangaben
  weglassen.
- Der Rot-Fall aus Punkt 4 tritt **nicht** ein, das Doku-Gate bleibt trotz
  totem Verweis grün → anhalten und melden. Dann ist die Aufnahme in
  `anweisungsDateien` nicht wirksam und muss vor dem Commit geklärt werden.
- Beim Umbau von `README.md` „Loslegen" fällt auf, dass eine andere Datei
  exakt den heutigen Wortlaut von Zeile 72 referenziert oder darauf
  verweist → anhalten, melden, nicht improvisieren.
- `npm run check:template` wird rot und die Ursache liegt nicht in Punkt 4
  → Ausgabe vollständig zeigen, anhalten.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit und warte
auf mein ausdrückliches „ja".
