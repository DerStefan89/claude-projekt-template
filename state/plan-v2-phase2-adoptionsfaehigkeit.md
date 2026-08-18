<!--
Stand dieser Fassung: 17.08.2026
Plan v2 für Phase 2 des Harness-Fix-Programms — Ergebnis des Advisor-Passes.
Ziel-Pfad im Repo: state/plan-v2-phase2-adoptionsfaehigkeit.md

Plan v1 (state/plan-v1-phase2-adoptionsfaehigkeit.md) bleibt unverändert
stehen. Befunde: state/advisor-findings-phase2-adoptionsfaehigkeit.md.
-->

# Plan v2 — Phase 2: Werkzeug-Katalog und Adoptionsfähigkeit

Evidenz-Marker: `[Fakt]` belegt · `[Schlussfolgerung]` abgeleitet ·
`[Annahme]` ungeprüft · `[offene Unsicherheit]` ungeklärt.

---

## 0. Was sich gegenüber v1 geändert hat

Sechs strukturelle Änderungen, alle aus dem Advisor-Pass oder aus
Entscheidungen des Menschen:

1. **Paket D (`triggers.yml`) ist gestrichen** — N10 wandert an sein
   Register-Fenster „vor Workforce-Code" (B4, Entscheidung des Menschen).
2. **Neues Paket H: Commit-Guard härten** — Push-Pfad, Zeitzone, Kodierung.
   Es wird der **erste** Vertrag der Phase, nicht ein Anhängsel (B1, B2, B13).
3. **Das Kontextbudget ist neu zusammengesetzt** — `START-KLEIN.md` allein,
   nicht `START-KLEIN.md` plus `CLAUDE.md` (B6).
4. **`START-KLEIN.md` kommt unter Prüfung 1** — eine Zeile in
   `check-docs.mjs`, damit die Datei, die das ganze Tor trägt, nicht als
   einzige ungeprüft bleibt (B5).
5. **Der Messaufbau ist spezifiziert** — eigenes GitHub-Repo über „Use this
   template", Push auf einen Branch, nicht auf `main` (B12, Entscheidung des
   Menschen).
6. **Die Abbruchbedingung ist gesetzt**, bevor gemessen wird (B10).

Dazu: P7 ist aus Phase 2 heraus (Quelle lag nicht vor), 3b wird benannt
weitervertagt statt zu verschwinden (B9), und drei Begründungen werden
ausgetauscht, obwohl die zugehörigen Entscheidungen bleiben (B3, B7, B8).

---

## 1. Umgang mit den Findings

`[Fakt]` 15 Befunde, davon 10 „vor Umsetzungsbeginn zu klären", 5 „dürfen
mitlaufen". Urteil: **Nicht freigegeben**.

| Befund | Umgang | Begründung |
|---|---|---|
| B1 — M4 braucht zwei Freigaben, Push-Pfad unkalibriert | **Übernommen** | Trifft zu. M4 wird umformuliert, der Push-Fall wird in Paket H kalibriert |
| B2 — Zeitzone/Format wahrscheinlicher als Kodierung | **Übernommen** | Der Fehlerpfad ist am Code belegt. Paket H fixt beides, nicht nur die Kodierung |
| B3 — Gate-Abdeckungs-Beleg falsch zitiert | **Übernommen** | Entscheidung (Pfad `docs/harness/`) bleibt, Begründung wird ausgetauscht, K4 wird ausdrücklich als unbezahnt geführt |
| B4 — Paket D gehört nicht in Phase 2 | **Übernommen** | Entscheidung des Menschen: streichen |
| B5 — `START-KLEIN.md` ohne Gate-Abdeckung | **Übernommen** | Eine Zeile in `check-docs.mjs:44-59`, im bestehenden Geltungsbereich |
| B6 — Kontextbudget zählt die falschen Dateien | **Übernommen** | `CLAUDE.md` ist Modellkontext, nicht Menschen-Erstlektüre |
| B7 — Streich-Begründung am eigenen Repo widerlegt | **Übernommen** | Entscheidung bleibt, Begründung wird ausgetauscht |
| B8 — Reihenfolge zu stark, Vertrag 6 zu groß | **Übernommen** | Reihenfolge wird präzisiert, Paket H wird eigener Vertrag |
| B9 — 3b zwischen den Phasen verschwunden | **Übernommen mit Änderung** | Entscheidung des Menschen: weitervertagen, aber benannt, plus Node-Bindung als Fund notieren |
| B10 — Abbruchbedingung fehlt | **Übernommen** | Die drei Bestandteile werden wörtlich gesetzt |
| B11 — M3-Falle (Versionsnummern) nicht vorhergesagt | **Übernommen** | Kommt in die Vorhersage und in `START-KLEIN.md` |
| B12 — Messaufbau unspezifiziert | **Übernommen** | Entscheidung des Menschen: eigenes GitHub-Repo |
| B13 — weitere Stolperstellen im Hook | **Übernommen** | Alle drei werden SCOPE- bzw. Prüfpunkte in Paket H |
| B14 — K1 hat zwei konkrete Fundstellen | **Übernommen** | Werden namentlich in den Glossareintrag geschrieben; Stand-Marker wird gesetzt |
| B15 — Reminder greift im Messfenster nicht | **Übernommen** | Erwartung korrigiert, `START-KLEIN.md` nennt `state/reibung.md` selbst |

`[Fakt]` Kein Befund wurde abgelehnt. `[Schlussfolgerung]` Das ist kein gutes
Zeichen für Plan v1, sondern für den Pass: Drei der fünf schwersten Befunde
(B1, B2, B3) hängen an Codestellen, die v1 zwar zitiert, aber nicht bis zu
Ende gelesen hat.

`[Fakt]` Der Advisor hat eine eigene Rollengrenzen-Verletzung berichtet (ein
lesender Bash-Aufruf, wo nur Read/Grep/Glob erlaubt waren) und sie selbst als
Fehler bezeichnet. `[Schlussfolgerung]` Das ist ein Befund über das Verfahren,
nicht über diesen Plan, und gehört als Reibungseintrag festgehalten, sobald
`state/reibung.md` existiert — die Rollengrenze ist heute Text (Ebene 1) und
hat keinen Zahn. Für Phase 2 wird daraus **keine** neue Mechanik abgeleitet:
ein Vorfall ist kein Muster.

---

## 2. Tor-Operationalisierung

### 2.1 Messaufbau

`[Fakt]` Entschieden am 17.08.2026: Die Testperson legt sich über „Use this
template" ein **eigenes GitHub-Repo** an (der Weg, den `README.md:69-71`
beschreibt) und klont es. Das ist der realistische Fall, nicht ein
konstruierter.

- M4 endet mit einem **Push auf einen Branch**, nicht auf `main`.
- Branch-Protection-Zustand und GitHub-Tarif werden im Protokoll
  festgehalten. `[Fakt]` `SETUP.md:18-23`: Bei privaten Repos auf einem
  persönlichen Free-Konto wird die Regel angelegt, aber nicht durchgesetzt.
  Ohne diese Angabe ist hinterher nicht unterscheidbar, ob das Gate wirkte
  oder nur beschriftet war.
- `[Fakt]` `package.json:5-7` verlangt Node 24, npm erzwingt das ohne
  `engine-strict` nicht. Erste Zeile von `START-KLEIN.md`: Node-Version
  prüfen (`node -v`).

### 2.2 Die vier Meilensteine

| Meilenstein | Erreicht, wenn |
|---|---|
| **M1 Umgebung** | Eigenes Repo über „Use this template" angelegt, geklont, Node-Version geprüft, `npm run check:template` einmal selbst ausgeführt und grün gesehen |
| **M2 Orientierung** | Drei Fragen ohne Suchen beantwortet: (a) Wo steht, was verbindlich gilt? (b) Wo trage ich ein, dass mich etwas aufgehalten hat? (c) Was muss passieren, damit ein Commit durchgeht? |
| **M3 Echte Änderung** | Eine inhaltliche Änderung an einer Füllungs-Stelle gemacht (Stack-Block in `CLAUDE.md` **oder** `ARCHITECTURE.md` §1), `check:template` weiterhin grün |
| **M4 Voller Zyklus** | Branch angelegt · **erste** Freigabe-Datei → Commit · **zweite** Freigabe-Datei → Push auf den Branch |

`[Fakt]` M4 nennt jetzt zwei Freigaben. `commit-guard.js:93-95` behandelt
`commit` und `push` mit demselben Muster, `:144` verbraucht die Datei beim
ersten Treffer — der Push braucht zwingend eine neue.

**Bestanden** = M1–M4 innerhalb von 60 Minuten bei höchstens zwei Rückfragen
an eine harnesskundige Person.

### 2.3 Vorhersage vor der Messung

`[Schlussfolgerung]` Vorhergesagt wird, bevor gemessen wird, damit hinterher
nicht geglättet werden kann. Drei Stellen:

1. **M4, Freigabe-Datei** — die härteste Stelle. `[Fakt]` Zwei belegte
   Fehlschläge beim Autor selbst, beide an der Datei-Kodierung
   (`state/gates.md`, 17.08.2026). `[Schlussfolgerung]` Dazu kommt der
   Zeitzonen-Pfad aus B2 und der doppelte Vorgang aus B1. Paket H zielt genau
   hierhin; bleibt es nach Paket H trotzdem die Bruchstelle, ist das ein
   Befund über die Zwei-Schlüssel-Mechanik selbst, nicht über das Dokument.
2. **M3, Versionsnummern** — `[Fakt]` Prüfung 2 läuft über `CLAUDE.md` und
   `ARCHITECTURE.md` (`check-docs.mjs:149`). Wer den Stack-Block naheliegend
   füllt („Framework: Next.js 15.1"), macht `check:template` rot.
   `[Schlussfolgerung]` Das ist ein korrekt arbeitendes Gate, aber es sieht
   für eine fremde Person wie ein Defekt aus, und „React 19" löst nicht aus,
   „React 19.1" schon. `START-KLEIN.md` sagt den Satz vorweg; tritt es
   trotzdem ein, zählt es nicht als Dokumentfehler.
3. **M4, Sichtprüfung der Freigabe-Datei** — `[Fakt]`
   `commit-guard.js:78-84` verweigert jeden Bash-Befehl, der den Pfad
   `state/freigabe-commit.md` enthält, auch `ls` und `cat`. Absicht, sieht
   aber wie ein Defekt aus. Wird in `START-KLEIN.md` vorweggenommen.

### 2.4 Ressourcenregel und Abbruchbedingung

**Ressourcenregel** (unverändert aus v1): Kalt-Lauf → Fix-Runde → **eine**
menschliche Messung. Scheitert sie, zweite Fix-Runde → **eine** zweite
Messung. Danach Halt.

`[Schlussfolgerung]` Der Kalt-Lauf mit einer frischen Claude-Code-Sitzung ist
ein Defektfinder, **keine** Messung. Ein Modell liest anders, sucht anders und
wird nicht müde. Wer den Kalt-Lauf als Messung verbucht, hat das Tor
weitergewunken.

`[Annahme]` Höchstens drei Kandidaten (die vier minus dem Autor des Harness).
Frische Augen sind einmalig verbrauchbar — dieselbe Logik wie beim
Basislinien-Fenster (P1).

**Abbruchbedingung, gesetzt vor der ersten Messung** (B10):

1. **Trennkriterium.** Jede Intervention wird bei der Auswertung einem von
   zwei Töpfen zugeordnet: *dokumentbedingt* (die Antwort stand irgendwo, war
   nur nicht auffindbar) oder *mechanikbedingt* (die Antwort steht nirgends,
   oder das Verfahren selbst — Zwei-Schlüssel-Freigabe, Frischefenster,
   Gate-Kette — ist die Hürde). Überwiegen im **zweiten** Lauf die
   mechanikbedingten Interventionen, ist der Befund das Harness, nicht das
   Dokument.
2. **Wiederholungskriterium.** Scheitert der zweite Lauf am **selben**
   Meilenstein wie der erste, obwohl die Fix-Runde genau dorthin gezielt hat →
   Halt, unabhängig von der Gesamtzeit.
3. **Folge des Halts.** Ergebnis nach
   `docs/harness/HARNESS-LEARNING-STATE.md` und in die Übergabe. Phase 3
   wartet. Neu bewertet wird dann der **Zuschnitt des Programms**, nicht der
   Plan — vier Personen mit einem Harness, das zwei fremde Augen nicht in
   einer Stunde durchlässt, ist eine Programmfrage.

**Protokoll.** Beobachter schweigt. Jede Intervention mit Uhrzeit, Anlass und
Topf-Zuordnung. Jede Intervention zählt gegen `START-KLEIN.md`, nicht gegen
die Person. Ablage: `programm/adoptionstest-<initialen>.md`, ungetrackt
(`.gitignore:34-38`).

**Ergebnisheimat.** `[Fakt]` Nicht `state/gates.md` — dort stehen laut
`state/gates.md:4-7` nur objektive, mit Rot- und Grün-Fall kalibrierbare
Gates. Eine einmalige Menschenmessung erfüllt das nicht. Heimat ist
`docs/harness/HARNESS-LEARNING-STATE.md` (`state/memory-map.md:19`).

---

## 3. Die Arbeitspakete

### Paket A — Kontextbudget (neu gefasst, B6)

- **Erstlektüre bis M3: `START-KLEIN.md`, höchstens 120 Zeilen. Sonst
  nichts.**
- `README.md` (101 Zeilen) und `SETUP.md` (87 Zeilen) werden aus
  `START-KLEIN.md` heraus **punktuell** adressiert („für den Push brauchst du
  SETUP.md Punkt 1"), nicht als Ganzes gelesen. `[Fakt]` `README.md:72-73`
  verlangt heute „`SETUP.md` lesen und abarbeiten" — das ist auf dem
  gemessenen Pfad die falsche Anweisung und wird in Paket F entschärft.
- `CLAUDE.md` ist **Modellkontext**, keine Menschen-Erstlektüre. `[Fakt]`
  `CLAUDE.md:9-11` adressiert ausdrücklich das Modell. Die Person muss
  wissen, *dass* die Datei gilt — das ist M2-Frage (a) — und nicht, was
  drinsteht.
- Die 200-Zeilen-Grenze für `CLAUDE.md` bleibt als Grenze für Paket E
  bestehen, unabhängig begründet über N8. `[Fakt]` 177 Zeilen heute, 23 Zeilen
  Luft.
- Jede in Phase 2 neu entstehende Datei bekommt im Kopf `Erstlektüre: ja|nein`.
  Voreinstellung nein.

`[Schlussfolgerung]` Der Zahn dieses Budgets ist nicht ein Gate, sondern der
Satz in `START-KLEIN.md`, der ausdrücklich sagt, **was man jetzt nicht liest**
— und der ist im Messlauf sofort prüfbar. Die maschinellen Zähne (N7
Platzhalter-Check, N8 Zeilengrenze) stehen laut Register in Phase 3 und werden
nicht vorgezogen.

### Paket H — Commit-Guard härten (neu, B1 + B2 + B13)

`[Fakt]` Muss **vor** der Messung fertig sein. Deshalb der erste Vertrag der
Phase.

Vier Punkte:

1. **Zeitzone.** `[Fakt]` Das Muster in `commit-guard.js:117` erfasst weder
   Offset noch `Z`; `:126` gibt den Treffer an `new Date`, das ihn als
   Ortszeit liest. Ein echter ISO-Zeitstempel (`…T09:54:13Z`) wird dadurch in
   Sommerzeit als 120 Minuten alt gewertet und bei `:135` verweigert. Fix:
   Offset und `Z` mitparsen und durchreichen.
2. **Kodierung.** `[Fakt]` `:107` liest mit `utf8`; ein BOM wird nicht
   entfernt, UTF-16 nicht erkannt — beides real vorgekommen
   (`state/gates.md`, 17.08.2026). Fix: BOM abschneiden, UTF-16 erkennen.
   **Anker `^` und `m`-Flag bleiben unverändert** — wer den Anker lockert,
   lässt eine Kommentarzeile als Freigabe durchgehen und öffnet einen neuen
   Fehlerpfad, wo einer geschlossen werden soll.
3. **Fehlermeldungen.** Bei ungültigem Muster das erwartete Format **wörtlich**
   ausgeben. `[Fakt]` Heute steht das exakte Format nur in
   `state/tasks/harness-fix-2-commit-guard.md:121-122` — einer Vertragsdatei,
   die auf dem Selbstweg niemand liest. Zusätzlich: bei negativem Alter
   („liegt in der Zukunft") statt „ist -0 Minuten alt".
4. **Push-Fall kalibrieren.** `[Fakt]` `state/gates.md:17` dokumentiert Rot-
   und Grün-Fall nur für `git commit`. Der Push-Pfad des schärfsten Gates im
   Harness ist bis heute ein ungeprüftes Versprechen.

**Prüfartefakt:** vier dokumentierte Fälle in `state/gates.md` — Rot und Grün
für `commit`, Rot und Grün für `push`.

**Prüfpunkt ohne Änderungspflicht** (`[Annahme]`, B13): `:102-103` bildet den
Pfad aus `eingabe.cwd || process.cwd()`. Liegt das Arbeitsverzeichnis nicht
auf der Repo-Wurzel, meldet der Hook „ohne Freigabe-Datei", obwohl sie
existiert. Im Vertrag als Prüfpunkt führen; ändern nur, wenn der Lauf es
bestätigt.

`[Fakt]` Kein Punkt dieses Pakets berührt `.claude/settings.json` — der Hook
ist dort bereits verkabelt (`.claude/settings.json`, `PreToolUse`/`Bash`).

### Paket B — Werkzeug-Katalog: Mechanik ins Template

**Wird gebaut:**

1. `docs/harness/werkzeug-katalog.md` — Legende (Haltbarkeitsklassen A–D),
   Eintragsformat, Quellenregel, Mechanik „Bewusst nicht aufgenommen",
   `Stand dieser Fassung:`-Marker mit **echtem Datum** im Kopf (K4), Kopfsatz
   zum Versionspin (K5, K9), benannte Leerstellen: Web3, Video, Data/ML (K7)
   und die fehlende Skill-Sorte „Handwerk" (K8). Eintragsliste leer, mit
   Verweis, dass die Einträge im Lern-Repo liegen (Phase 3).
2. `docs/harness/HARNESS-GLOSSARY.md` — Eintrag **Haltbarkeitsklassen A–D**.
   `[Fakt]` Die Kollision ist an zwei Stellen real belegt: `README.md:33`
   („Vier-Ebenen-Regelhierarchie") und `docs/guide/00-START-HIER.md:73-83`
   (eigene Vier-Ebenen-Tabelle). Beide meinen die Regelhierarchie, nicht die
   Haltbarkeit. Beide gehören namentlich in die Fundstellen-Spalte (B14).
   `[Fakt]` Gleichzeitig wird `HARNESS-GLOSSARY.md:3` von
   `Stand dieser Fassung: [FÜLLUNG]` auf ein echtes Datum gesetzt — solange
   dort ein Platzhalter steht, ist die Datei aus Prüfung 3 heraus
   (`check-docs.mjs:179`, `:215`).
3. `.claude/skills/werkzeug-auswahl/SKILL.md` — Schritt 2 wird 2a/2b/2c nach
   Teil C.3a. 2c verweist auf die Katalogdatei **im Repo**.
4. `state/triggers.md` — Zeile „Neues Werkzeug im Gespräch → Katalog zuerst,
   dann `werkzeug-auswahl`" und eine Zeile für die Advisor-Pflicht bei
   schreibendem Fremdzugriff, Datenabfluss oder Protokollierung jedes
   Tool-Aufrufs. Die drei Werkzeugnamen (Supabase MCP, OmniRoute, claude-mem)
   stehen als **ausdrücklich markiertes Beispiel** in Klammern hinter dem
   Kriterium — das ist die K3-Mechanik, und die Information geht nicht
   verloren.
5. `state/memory-map.md` — die drei Zuständigkeitszeilen aus C.1 (Katalog vs.
   `state/tooling.md` vs. `docs/adr/`), je mit „nicht hierhin"-Spalte.

**Pfadentscheidung mit ausgetauschter Begründung (B3).** Pfad bleibt
`docs/harness/werkzeug-katalog.md`. `[Fakt]` Die Begründung aus v1 war falsch:
Prüfung 1 prüft **Verweise**, nicht Zieldateien (`check-docs.mjs:104-128`) und
erfasst den Katalog an beiden Pfaden gleichermaßen — sobald ein
Anweisungsdokument auf ihn verweist. Prüfung 3 wiederum überspringt jede Datei
ohne Marker und feuert nur bei einem **jüngeren Datum in derselben Datei**
(`:207-215`); an einer leeren Eintragsliste hat sie nichts zu prüfen.
`[Schlussfolgerung]` Der Pfad ist trotzdem richtig, aber aus zwei schwächeren
Gründen: Nachbarschaft zu den übrigen Harness-Dokumenten, und Prüfung 3 wird
wirksam, sobald Phase 3 die Einträge mit Prüfdaten nachliefert.

`[Fakt]` **K4 bleibt in Phase 2 unbezahnt** — an beiden Pfaden. Ein
Marker-Pflicht-Check existiert nicht und kommt mit N7 in Phase 3. Das steht
hier, damit es nicht als „unter Gate-Abdeckung" verbucht wird. `[Fakt]` Die
einzige Gate-Abdeckung, die der Katalog in Phase 2 tatsächlich hat, ist der
Verweis aus `werkzeug-auswahl/SKILL.md` über Prüfung 1 — deshalb ist dieser
Verweis Pflicht, nicht Kür.

**Wird nicht gebaut — Begründung ausgetauscht (B7).** Die 18 Einträge, das
Verfallsgate (C.3c) und die Rückflussregel (C.3d) ziehen mit dem Lern-Repo
(P4) in Phase 3, **weil ihr Gegenstand dort liegt** — nicht, weil sie „ohne
Einträge nicht kalibrierbar" wären. `[Fakt]` Diese Begründung aus v1 ist am
eigenen Repo widerlegt: Der Rot-Fall des Vertrags-Gates entstand über eine
absichtlich verstümmelte Testdatei (`state/gates.md:121-128`), der des
Doku-Gates über eine temporäre Testzeile (`:11`). Ein Verfallsgate ließe sich
mit einem einzigen Fixture-Eintrag rot machen. `[Schlussfolgerung]` Die
Fixture-Möglichkeit wird ausdrücklich an N4 (Fixtures, Phase 3) gehängt, damit
die Mechanik dort nicht erneut an einer Scheinbegründung hängenbleibt.

`[Fakt]` Damit liefert Paket B genau das, was das Register dem Template
zugedacht hat („~40 Zeilen, reine Mechanik — echtes Skelett"), plus vier
Anbindungen. Der „Schwerpunkt der Phase" bezog sich auf den Katalog als Thema;
seine Masse liegt per Registerentscheidung im Lern-Repo.

### Paket C — Reibungserfassung (N9)

- `state/reibung.md`: eine Zeile pro Eintrag — Datum · was hat aufgehalten ·
  wo (Datei/Schritt) · grobe Kosten · erledigt?. Im Template leer, getrackt.
- `[Fakt]` **Kein `Stand dieser Fassung:`-Marker**, und ein Kommentar im
  Dateikopf, der begründet, warum nicht. `check-docs.mjs:215` überspringt
  Dateien ohne Marker vollständig; mit Marker färbt jeder neue Eintrag
  Prüfung 3 rot (`:228-239`).
- `.claude/hooks/session-reminder.js`: eine Zeile in der bestehenden
  Erinnerung. `[Fakt]` Keine Änderung an `.claude/settings.json` nötig.
- `[Fakt]` **Korrigierte Erwartung (B15):** `session-reminder.js:6` setzt
  `INTERVALL = 30`. `[Schlussfolgerung]` Im 60-Minuten-Messfenster wird die
  Schwelle voraussichtlich nicht erreicht — die Reminder-Zeile ist die
  Langzeitmechanik, nicht der Einstiegspfad. `START-KLEIN.md` muss
  `state/reibung.md` deshalb selbst nennen, sonst ist M2-Frage (b) nicht
  beantwortbar.
- `state/memory-map.md`: eine Zeile.
- `[Fakt]` Bleibt eine Selbstauskunfts-Mechanik ohne Zahn. Ein Gate auf
  fehlende Einträge würde Ehrlichkeit bestrafen und Einträge erzeugen, statt
  Reibung zu messen. Bewusst kein Gate.

### Paket E — Doktrin verankern (R1, R2)

- **R1 Aufteilungsregel** in den Kopfkommentar von `ARCHITECTURE.md`.
  `[Fakt]` Die Datei ist als Ganzes Füllung; der Kopfkommentar ist ihr
  einziger Skelett-Teil und wandert in jeden Klon. Dazu eine Zeile in
  `state/memory-map.md`: abgespaltener Teilbereich → eigene Datei **plus**
  memory-map-Zeile **plus** Rückverweis aus `ARCHITECTURE.md`.
- **R2 erzeugte Wahrheit** als zwei Zeilen in `state/memory-map.md`
  (DB-Schema, API-Vertrag: Heimat = Generat; „nicht hierhin" = von Hand
  gepflegte Datei) und als neuer Punkt in `SETUP.md` (Generator plus
  `diff`-Gate einrichten, sobald das Projekt eine Datenbank oder eine
  öffentliche API hat).
- `[Fakt]` **R2 bekommt in Phase 2 keinen lebenden Beleg mehr.** Der war
  Paket D; Paket D ist gestrichen. R2 bleibt Doktrin, bis der Workforce-Code
  sie einlöst — dort ist der Fall echt statt konstruiert. Das ist der Preis
  der Streichung und wird hier benannt, nicht verschwiegen.
- `CLAUDE.md` wird möglichst nicht angefasst; falls doch, höchstens zwei
  Zeilen gegen die 23 Zeilen Restbudget.

### Paket F — `START-KLEIN.md` (N11)

- Repo-Wurzel, `Erstlektüre: ja`, höchstens 120 Zeilen.
- Inhalt in der Reihenfolge der vier Meilensteine, mit dem ausdrücklichen
  Satz, **was man jetzt nicht liest** (Guide, Deep Dives, Katalog, Doktrin).
- **Muss namentlich enthalten:** Node-Versionsprüfung (B12) · das exakte
  Format der Freigabe-Zeile und den doppelten Vorgang für Commit und Push
  (B1, B2) · dass `ls`/`cat` auf die Freigabe-Datei absichtlich blockiert sind
  (B13) · keine Versionsnummern im Stack-Block (B11) · `state/reibung.md`
  (B15) · den punktuellen Verweis auf `SETUP.md` Punkt 1 für den Push (B6).
- `README.md`, Abschnitt „Loslegen": `START-KLEIN.md` wird erster Schritt, der
  geführte Onboarding-Weg bleibt als zweiter, benannter Weg stehen. `[Fakt]`
  Der heutige Bootstrap-Schritt 2 („`SETUP.md` lesen und abarbeiten",
  `README.md:72-73`) wird auf den punktuellen Verweis umgestellt.
- **`'START-KLEIN.md'` wird in `check-docs.mjs:44-59` aufgenommen** (B5).
  `[Fakt]` Das ist keine neue Regel in `check-rules.mjs`, sondern eine Zeile
  im bestehenden Geltungsbereich von Prüfung 1. `[Schlussfolgerung]`
  Nebenwirkung gleich null: Prüfung 2 läuft nur über `CLAUDE.md` und
  `ARCHITECTURE.md` (`:149`), Prüfung 3 nur über `docs/harness/` und `state/`
  (`:202-205`). Rot-Fall: ein absichtlich toter Verweis in `START-KLEIN.md`,
  nach dem Muster von `_test-verstuemmelt.md`.

### Paket G — Messung (Menschenarbeit, kein Vertrag)

Kalt-Lauf → Fix-Runde → menschliche Messung nach Abschnitt 2 → Protokoll unter
`programm/` → Ergebnis nach `docs/harness/HARNESS-LEARNING-STATE.md` und in
die Übergabe.

---

## 4. Was Phase 2 ausdrücklich nicht tut

- **Kein `triggers.yml`, kein Generator, kein Sync-Gate.** `[Fakt]` N10 hat im
  Register das Fenster „vor Workforce-Code". `[Fakt]` `.yml` ist die einzige
  Endung, die Prüfung 1 nicht erfasst (`check-docs.mjs:112`) — im Repo bereits
  als Befund dokumentiert (`state/advisor-findings-phase1-vertraege.md:116`).
  **Benannter Folgeauftrag:** N10 wird vor dem Workforce-Code umgesetzt; fällt
  die Entscheidung dann für einen maschinenlesbaren Träger, dann als **JSON**,
  nicht YAML — Bordmittel, keine Abhängigkeit, und von Prüfung 1 erfasst.
- **Kein P7** (Evidenz-Modalitätstabelle, Class-Sweep-Regel). `[Fakt]` Die
  LifeOS-Quelle lag zum Planungszeitpunkt nicht vor. Verschoben nach Phase 3,
  mit genau dieser Begründung im Register.
- **Kein 3b** (Prüfbefehl-Indirektion). `[Fakt]` Von Phase 1 ausdrücklich
  hierher vertagt (`state/plan-v2-phase1-vertraege.md:20`, `:234`, `:247`) und
  in Plan v1 verschwunden. **Benannter Folgeauftrag:** erneut vertagt, weil
  die dahinterliegende Grundsatzfrage („ist das Harness node-gebunden? Fünf
  Hook-Aufrufe laufen über `node`, dazu `engines` und die CI-Toolchain") nicht
  nebenbei zu entscheiden ist. **Aber:** Die Node-Bindung wird in dieser Phase
  als **Fund** notiert — in `state/tooling.md` oder
  `docs/harness/HARNESS-LEARNING-STATE.md` —, wie Phase 1 es beschlossen und
  bis heute nicht ausgeführt hat.
- Keine 18 Katalog-Einträge, kein Lern-Repo, kein Verfallsgate, keine
  Rückflussregel (Phase 3, P4).
- Kein Platzhalter-Check, keine Zeilengrenze als Gate (Phase 3, N7/N8).
- Keine neue Regel in `check-rules.mjs`.
- Kein Entfernen von `--no-git` in der CI — die offene Stop-Grenze aus Phase 1
  bleibt offen, bis der gitleaks-Historien-Scan nachgeholt ist.
- `ARCHITECTURE.md` wird nicht auf Vorrat gefüllt; nur der Kopfkommentar.

---

## 5. Verträge

`[Fakt]` Nummerierung schließt an Phase 1 an. Zuschnitt nach der Heuristik aus
`CLAUDE.md:73-77`: ein Baudurchgang plus höchstens eine Korrekturrunde,
eigenständig prüfbares Artefakt.

| Nr | Inhalt | Prüfbares Artefakt |
|---|---|---|
| **5** | **Commit-Guard härten** (Paket H): Zeitzone, Kodierung, Fehlermeldungen, Push-Kalibrierung | Vier Fälle in `state/gates.md` — Rot/Grün für `commit`, Rot/Grün für `push` |
| **6** | Werkzeug-Katalog-Mechanik, Glossar samt Stand-Marker, `werkzeug-auswahl` Schritt 2, Trigger- und memory-map-Zeilen (Paket B) | `check:template` grün; der Verweis aus `werkzeug-auswahl/SKILL.md` löst auf — das prüft Prüfung 1 maschinell |
| **7** | `state/reibung.md`, `session-reminder.js`, Doktrin-Verankerung R1/R2, Node-Bindung als Fund notieren (Pakete C und E) | `check:template` grün, kein Stand-Marker-Fehlalarm in `state/reibung.md` |
| **8** | `START-KLEIN.md`, Einstiegs-Umbau in `README.md`, Aufnahme in `check-docs.mjs` (Paket F) | Rot-Fall: toter Verweis in `START-KLEIN.md` wird von Prüfung 1 gefangen; danach Kalt-Lauf ohne Sackgasse |

**Reihenfolge, präzisiert (B8):**

- `[Fakt]` **Vertrag 5 zuerst** — er muss vor der Messung fertig sein, und die
  Messung ist der einmalig verbrauchbare Teil.
- `[Fakt]` **Vertrag 8 zuletzt** — er beschreibt den Zustand, den 5–7
  herstellen.
- `[Schlussfolgerung]` **6 und 7 sind untereinander frei.** Paket C hängt an
  keiner Zeile aus Paket B. Die Behauptung aus v1, die ganze Kette sei
  bindend, stützte sich auf eine Begründung, die nur für Vertrag 8 trägt —
  derselbe Fehlertyp wie F11 im Phase-1-Pass.

Paket A ist eine Entscheidung, Paket G Menschenarbeit — beide ohne Vertrag.

`[Fakt]` Für jeden Vertrag gilt unverändert: vollständiger `git diff --staged`
vor dem Commit, ausdrückliche Freigabe des Menschen, Stagen nur mit expliziten
Pfaden. `.claude/settings.json` wird ausschließlich vom Menschen selbst
geändert; kein Vertrag dieser Phase braucht das.

---

## 6. Was offen bleibt

- `[offene Unsicherheit]` Ob die Zwei-Schlüssel-Freigabe für eine
  harnessfremde Person auch nach Paket H tragbar ist. Genau das misst M4.
  Bleibt sie nach dem Fix die Bruchstelle, ist der Befund die Mechanik, nicht
  das Dokument — und das ist der wertvollste mögliche Ausgang dieser Phase.
- `[offene Unsicherheit]` Ob der Selbstweg der Weg ist, den die drei anderen
  real gehen werden, oder ob sie den geführten Onboarding-Chat nehmen. Der
  Selbstweg wird gemessen, weil nur er im Repo reparierbar ist.
- `[offene Unsicherheit]` Ursache des Prüfpunkts aus B13 (`cwd`-Ableitung im
  Hook). Wird im Vertrag 5 geprüft, nicht vorab entschieden.
- `[Fakt]` Der Stichtag im Erfolgskriterium steht weiterhin auf `[FÜLLUNG]`.
  Er blockiert Phase 2 nicht, muss aber gesetzt sein, bevor die vier anfangen.
- `[Annahme]` „Höchstens drei Kandidaten" für die Messung. Nicht bestätigt.

---

## 7. Nächster sinnvoller Schritt

Handoff-Vertrag 5 (Commit-Guard härten) nach dem Muster von
`.claude/skills/handoff-vertrag/SKILL.md` schreiben und in Claude Code lokal
im Repo ausführen. Er ist der einzige Vertrag der Phase, der vor der Messung
zwingend fertig sein muss, und der einzige, der einen Sicherheits-Hook
anfasst — er braucht deshalb dieselben ausdrücklichen Halte-Punkte am
Menschen wie sein Vorgänger `harness-fix-2-commit-guard.md`.

## Status
- [x] Freigegeben mit Hinweisen — alle 15 Befunde eingearbeitet, drei
      Entscheidungen des Menschen umgesetzt; die offenen Punkte aus
      Abschnitt 6 sind benannt und blockieren den Baubeginn nicht
- [ ] Freigegeben
- [ ] Nicht freigegeben
- [ ] Blockiert
