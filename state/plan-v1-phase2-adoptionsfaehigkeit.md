<!--
Stand dieser Fassung: 17.08.2026
Plan v1 für Phase 2 des Harness-Fix-Programms. Ziel-Pfad im Repo:
state/plan-v1-phase2-adoptionsfaehigkeit.md
-->

# Plan v1 — Phase 2: Werkzeug-Katalog und Adoptionsfähigkeit

Vor dem Advisor-Pass. Diese Datei bleibt nach dem Pass unverändert stehen;
das Ergebnis wird `state/plan-v2-phase2-adoptionsfaehigkeit.md`.

Evidenz-Marker: `[Fakt]` belegt · `[Schlussfolgerung]` abgeleitet ·
`[Annahme]` ungeprüft · `[offene Unsicherheit]` ungeklärt.

---

## 0. Geltungsbereich

`[Fakt]` Phase 2 laut `harness-befunde-und-plan.md`, Teil B: Werkzeug-Katalog
(Teil C, Befunde K1–K9), `START-KLEIN.md` (N11), `state/reibung.md` (N9),
`triggers.yml` (N10), Evidenz-Modalitätstabelle und Class-Sweep-Regel (P7),
Aufteilungsregel für ARCHITECTURE.md (R1), Doktrin „erzeugte Wahrheit" (R2).

`[Fakt]` Tor Phase 2: *Eine Person, die das Harness nicht kennt, ist in unter
60 Minuten an einer kleinen realen Aufgabe arbeitsfähig — gemessen, nicht
behauptet.*

`[Fakt]` Für Phase 2 existieren keine vorgeschriebenen Handoff-Verträge.
Es gilt der volle Prozess: Plan v1 → Advisor-Pass → Plan v2 → Verträge.

---

## 1. Ist-Zustand, gegen das Repo geprüft

Alle Angaben aus dem Klon von `main` bei `97afe1e` gelesen, nicht aus der
Übergabe übernommen.

| Beobachtung | Beleg |
|---|---|
| `check:template` = `check-docs` + `check-rules` + `check-contract` | `package.json` |
| Doku-Gate Prüfung 1 (tote Verweise) prüft **nur** `CLAUDE.md`, `ARCHITECTURE.md`, `README.md`, `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, `.claude/commands/*.md` | `scripts/check-docs.mjs:32–59` |
| Doku-Gate Prüfung 3 (Stand-Marker vs. jüngere Daten) prüft **rekursiv** `docs/harness/**` und `state/**` | `scripts/check-docs.mjs:202–205` |
| Doku-Gate Prüfung 5 (Hedging) prüft nur direkte Kinder von `state/` mit `advisor-findings-` oder `review` im Namen | `scripts/check-docs.mjs:297–312` |
| Vertrags-Gate prüft **jede** `.md` in `state/tasks/` auf SCHRITT 0 + acht Marker | `scripts/check-contract.mjs`, `state/gates.md` |
| `session-reminder.js` ist als `UserPromptSubmit`-Hook bereits verkabelt | `.claude/settings.json` |
| `CLAUDE.md` hat 177 Zeilen | `wc -l` |
| `state/triggers.md` ist eine Markdown-Tabelle mit 7 Zeilen + `[FÜLLUNG]` | Datei |
| Freigabe-Datei des Commit-Guards ist zweimal an der Datei-Kodierung gescheitert (UTF-16, UTF-8-BOM), bevor der Grün-Fall lief | `state/gates.md`, Kalibrierungs-Log 17.08.2026 |
| Es gibt heute vier Einstiegspunkte: `README.md`, `SETUP.md`, `docs/guide/00-START-HIER.md`, `docs/onboarding/START-PROMPT.md` | Dateien |

---

## 2. Das Leitproblem dieser Phase

`[Schlussfolgerung]` Phase 2 misst die Lesefläche des Harness und vergrößert
sie gleichzeitig. Von den sechs Punkten des Registers senkt genau einer die
Einstiegshürde (`START-KLEIN.md`). Die anderen fünf fügen Dateien, Regeln
und Doktrin hinzu — jede für sich begründet, in Summe genau das, was das Tor
bestraft.

`[Schlussfolgerung]` Daraus folgt die Leitentscheidung dieses Plans: **Phase 2
bekommt ein Kontextbudget, bevor irgendetwas gebaut wird.** Jede neue Datei
wird ausdrücklich als *Erstlektüre* oder *Nachschlagen* eingeordnet, und die
Erstlektüre hat eine Obergrenze. Ohne diese Klammer scheitert Phase 2 an
ihrem eigenen Tor durch Konstruktion, nicht durch Zufall.

`[Fakt]` Ein zweiter Rahmen kommt aus Phase 1: Ein Gate ohne dokumentierten
Rot-Fall zählt nicht als erledigt. Das entscheidet in Paket B, was in Phase 2
gebaut wird und was auf Phase 3 wartet.

---

## 3. Tor-Operationalisierung — wie gemessen wird

`[Schlussfolgerung]` „In unter 60 Minuten arbeitsfähig" ist so nicht messbar.
Vorschlag zur Übernahme: vier Meilensteine mit Zeitstempel.

| Meilenstein | Erreicht, wenn |
|---|---|
| **M1 Umgebung** | Template benutzt, geklont, `npm run check:template` einmal selbst ausgeführt und grün gesehen |
| **M2 Orientierung** | Die Person beantwortet drei Fragen ohne Suchen: (a) Wo steht, was in diesem Projekt verbindlich gilt? (b) Wo trage ich ein, dass mich etwas aufgehalten hat? (c) Was muss passieren, damit ein Commit durchgeht? |
| **M3 Echte Änderung** | Eine inhaltliche Änderung an einer Füllungs-Stelle ist gemacht (Stack-Block in `CLAUDE.md` **oder** `ARCHITECTURE.md` §1), `check:template` weiterhin grün |
| **M4 Voller Zyklus** | Branch, Freigabe-Datei angelegt, Commit durch den Commit-Guard, Push |

**Bestanden** = M1–M4 innerhalb von 60 Minuten bei höchstens zwei Rückfragen
an eine harness-kundige Person.

**Protokoll.** Beobachter schweigt. Jede Intervention wird mit Uhrzeit und
Anlass notiert; **jede Intervention ist ein Befund gegen `START-KLEIN.md`**,
nicht gegen die Person. Ablage: `programm/adoptionstest-<initialen>.md`,
ungetrackt — dieselbe Begründung wie bei der Basislinie (personenbezogen,
öffentliches Vorlagen-Repo).

**Vorlauf, kein Ersatz.** Vor dem menschlichen Lauf ein Kalt-Lauf mit einer
frischen Claude-Code-Sitzung ohne Vorwissen, die nur das Repo bekommt.
`[Schlussfolgerung]` Der Modelllauf findet Sackgassen, fehlende Schritte und
falsche Pfade — er misst das Tor **nicht**. Ein Modell liest anders, sucht
anders und wird nicht müde. Wer den Kalt-Lauf als Messung verbucht, hat das
Tor weitergewunken.

**Ressourcenregel.** `[Schlussfolgerung]` Frische Augen sind einmalig
verbrauchbar, dieselbe Logik wie beim Basislinien-Fenster (P1). `[Annahme]`
Es gibt höchstens drei Kandidaten (die vier minus dem Autor des Harness).
Deshalb: Kalt-Lauf → Fix-Runde → **eine** menschliche Messung. Scheitert sie,
zweite Fix-Runde → **eine** zweite Messung. Danach ist Halt, nicht ein dritter
Versuch.

**Vorhersage vor der Messung** (damit hinterher nicht geglättet wird):
`[Schlussfolgerung]` M4 fällt am wahrscheinlichsten aus, und zwar an der
Freigabe-Datei. `[Fakt]` Sie hat den Autor des Harness selbst zwei Anläufe
gekostet, beide an der Datei-Kodierung (`state/gates.md`, 17.08.2026). Eine
harnessfremde Person hat dafür kein Vorwissen und keine Fehlermeldung, die
auf Kodierung hinweist.

---

## 4. Die Arbeitspakete

Reihenfolge ist nicht beliebig: `START-KLEIN.md` beschreibt den Zustand nach
B–E und wird deshalb zuletzt geschrieben.

### Paket A — Kontextbudget festlegen (Entscheidung, kein Code)

- Erstlektüre in den ersten 60 Minuten: `START-KLEIN.md` (≤ 120 Zeilen) und
  `CLAUDE.md` (≤ 200 Zeilen, Grenze aus N8). Zusammen ≤ 320 Zeilen.
- Jede in Phase 2 neu entstehende Datei bekommt im Kopf eine Zeile
  `Erstlektüre: ja|nein`. Voreinstellung: nein.
- `[Fakt]` `CLAUDE.md` hat heute 177 Zeilen — 23 Zeilen Luft. Jede Ergänzung
  aus Paket E verbraucht davon.
- `[Schlussfolgerung]` Das Kontextbudget hat in Phase 2 **keinen Zahn**. Es
  ist Text auf Ebene 1. Die Zähne dafür (Platzhalter-Check, Zeilengrenze als
  Prüfungen 6 und 7) stehen laut Register in Phase 3. Das wird hier
  ausgesprochen statt kaschiert; es vorzuziehen hieße, Phase 3 anzubrechen.

### Paket B — Werkzeug-Katalog: Mechanik ins Template, Einträge nicht

**Wird gebaut:**

1. `docs/harness/werkzeug-katalog.md` — Legende (Haltbarkeitsklassen A–D),
   Eintragsformat, Quellenregel, Mechanik „Bewusst nicht aufgenommen",
   `Stand dieser Fassung:`-Marker im Kopf (K4), Kopfsatz „kein Eintrag der
   Klasse C ist ohne Versionspin installationsbereit" (K5, K9), benannte
   Leerstellen (Web3, Video, Data/ML — K7; Skill-Sorte „Handwerk" — K8).
   Eintragsliste leer, mit Verweis, dass die Einträge im Lern-Repo liegen.
2. `docs/harness/HARNESS-GLOSSARY.md` — Eintrag **Haltbarkeitsklassen A–D**
   plus Hinweis, dass der alte Name „Vier-Ebenen-Regel" kursiert und mit der
   Regelhierarchie des Harness kollidiert (K1).
3. `.claude/skills/werkzeug-auswahl/SKILL.md` — Schritt 2 wird zu 2a/2b/2c
   nach Teil C.3a. 2c verweist auf die Katalog-Datei im Repo, nicht auf das
   Lern-Repo (K6).
4. `state/triggers.*` — eine Zeile „Neues Werkzeug im Gespräch → Katalog
   zuerst, dann `werkzeug-auswahl`" (C.3b) und eine Zeile für die
   Advisor-Pflicht bei schreibendem Fremdzugriff, Datenabfluss oder
   Protokollierung jedes Tool-Aufrufs.
5. `state/memory-map.md` — die drei Zuständigkeitszeilen aus C.1 (Katalog vs.
   `state/tooling.md` vs. `docs/adr/`), jeweils mit „nicht hierhin"-Spalte.

**Zwei Abweichungen vom Register, beide begründet:**

- **Pfad.** Das Register nennt `docs/werkzeug-katalog.md`. `[Fakt]` Dieser
  Pfad liegt außerhalb jedes Gates: Prüfung 1 erfasst ihn nicht
  (`check-docs.mjs:44–59`), Prüfung 3 auch nicht (`:202–205`). Der
  `Stand dieser Fassung:`-Marker aus K4 wäre dort wirkungslos — genau der
  Fehler, den K4 behebt. Vorschlag: `docs/harness/werkzeug-katalog.md`.
- **Die drei namentlich genannten Werkzeuge** (Supabase MCP, OmniRoute,
  claude-mem) kommen **nicht** in die Trigger-Datei des Templates.
  `[Schlussfolgerung]` Namentliche Werkzeuge sind Füllung, nicht Skelett; ein
  projektübergreifendes Skelett mit unmarkiertem Werkzeugbezug ist derselbe
  Fehler wie K3, nur an anderer Stelle. Die Mechanik (Kriterium) kommt ins
  Template, die drei Namen in die Einträgeliste.

**Wird nicht gebaut, sondern wartet auf Phase 3:** die 18 Einträge, das
Verfallsgate (C.3c) und die Rückflussregel (C.3d).
`[Schlussfolgerung]` Beide Mechaniken haben ohne Einträge keinen Rot-Fall.
Nach der Tor-Regel aus Phase 1 wären sie kalibrierungsunfähig und zählten
nicht als erledigt. Sie ziehen mit dem Lern-Repo (P4) in Phase 3.

### Paket C — Reibungserfassung (N9)

- `state/reibung.md`: eine Zeile pro Eintrag — Datum · was hat aufgehalten ·
  wo (Datei/Schritt) · grobe Kosten · erledigt?. Im Template leer, getrackt.
- `[Schlussfolgerung]` **Kein `Stand dieser Fassung:`-Marker.** Die Datei ist
  ein Anhänge-Protokoll mit fortlaufenden Daten; mit Marker würde Prüfung 3
  (`check-docs.mjs:202–240`) bei jedem neuen Eintrag rot. Das gehört als
  Kommentar in den Dateikopf, sonst trägt jemand den Marker nach.
- `.claude/hooks/session-reminder.js`: eine Zeile in der bestehenden
  Erinnerung. `[Fakt]` Keine Änderung an `.claude/settings.json` nötig — der
  Hook ist bereits als `UserPromptSubmit` verkabelt.
- `state/memory-map.md`: eine Zeile.
- `[Fakt]` Das bleibt eine Selbstauskunfts-Mechanik ohne Zahn. Ein Gate, das
  fehlende Reibungseinträge rot macht, würde Ehrlichkeit bestrafen und
  Einträge erzeugen, statt Reibung zu messen. Bewusst kein Gate.

### Paket D — Trigger: harte Quelle und erzeugte Ansicht (N10, zugleich R2)

- `state/triggers.yml` wird die Quelle; `state/triggers.md` wird erzeugt und
  trägt im Kopf „ERZEUGT — nicht von Hand ändern".
- `scripts/gen-triggers.mjs` erzeugt die Ansicht; `check:template` bekommt
  eine Stufe, die neu erzeugt und gegen die Datei auf der Platte vergleicht →
  rot bei Abweichung.
- `[Schlussfolgerung]` Damit ist R2 („erzeugte Wahrheit") nicht nur Doktrin,
  sondern hat im Harness selbst einen laufenden Fall — und Befund N12
  (Dogfooding-Lücke) bekommt seinen ersten echten Eintrag. Rot-Fall: eine
  Zeile in `triggers.md` von Hand ändern. Grün-Fall: neu erzeugen.
- `[offene Unsicherheit]` Der eigentliche Konsument der maschinenlesbaren
  Quelle ist der Workforce-Code aus Phase 4. Ohne den Sync-Gate-Gedanken wäre
  das Bauen auf Vorrat und damit gegen die eigene Regel. Siehe offener
  Punkt 2.

### Paket E — Doktrin verankern (R1, R2)

- **R1 Aufteilungsregel** in den Kopfkommentar von `ARCHITECTURE.md`. `[Fakt]`
  Die Datei ist als Ganzes Füllung; der Kopfkommentar ist der einzige
  Skelett-Teil und wandert mit der Datei in jeden Klon. Dazu eine Zeile in
  `state/memory-map.md` (abgespaltener Teilbereich → eigene Datei **plus**
  memory-map-Zeile **plus** Rückverweis).
- **R2 erzeugte Wahrheit** als zwei Zeilen in `state/memory-map.md`
  (DB-Schema und API-Vertrag: Heimat = Generat, „nicht hierhin" = von Hand
  gepflegte Datei) und als neuer Punkt in `SETUP.md` (Generator + `diff`-Gate
  einrichten, sobald das Projekt eine Datenbank oder eine öffentliche API
  hat). Der lebende Beleg ist Paket D.
- `CLAUDE.md` wird möglichst nicht angefasst. Falls doch: höchstens zwei
  Zeilen Verweis, gegen die 23 Zeilen Restbudget aus Paket A gerechnet.

### Paket F — `START-KLEIN.md` (N11)

- Liegt in der Repo-Wurzel, nicht unter `docs/` — eine fremde Person schaut
  zuerst in die Wurzel.
- Inhalt: der Minimalpfad in der Reihenfolge der vier Meilensteine aus
  Abschnitt 3, mit dem ausdrücklichen Satz, **was man jetzt nicht liest**
  (Guide, Deep Dives, Katalog, Doktrin).
- `README.md`, Abschnitt „Loslegen", verweist als ersten Schritt auf
  `START-KLEIN.md`; der Onboarding-Weg über das Claude-Projekt bleibt als
  zweiter, benannter Weg stehen.
- `[Schlussfolgerung]` Damit gibt es fünf Einstiegspunkte. Das ist nur
  vertretbar, wenn genau einer als erster ausgewiesen ist und die anderen von
  dort aus erreicht werden. Siehe offener Punkt 1.

### Paket G — Messung (Menschenarbeit, kein Vertrag)

Kalt-Lauf → Fix-Runde → menschliche Messung → Protokoll → Eintrag in
`state/gates.md`? Nein: `[Schlussfolgerung]` Das Tor ist kein Gate im Sinne
von `state/gates.md` (nicht deterministisch, nicht wiederholbar). Es gehört
als Ergebnis nach `docs/harness/HARNESS-LEARNING-STATE.md` und in die
Übergabe, nicht in die Gate-Tabelle.

---

## 5. Was Phase 2 ausdrücklich nicht tut

- Keine 18 Katalog-Einträge im Template, kein Lern-Repo (Phase 3, P4).
- Kein Verfallsgate, keine Rückflussregel — beide ohne Einträge nicht
  kalibrierbar.
- Kein Platzhalter-Check, keine Zeilengrenze als Gate (Phase 3, N7/N8).
- Keine neue Regel in `check-rules.mjs`.
- Kein Entfernen von `--no-git` in der CI — die offene Stop-Grenze aus
  Phase 1 bleibt offen, bis der Historien-Scan nachgeholt ist.
- `ARCHITECTURE.md` wird nicht auf Vorrat gefüllt; nur der Kopfkommentar.

---

## 6. Offene Punkte — nicht stillschweigend entschieden

**1 — Was genau wird gemessen?** Repo allein (selbsterklärender Pfad über
`START-KLEIN.md`) oder Repo plus geführten Onboarding-Chat? `[Fakt]` Die
`README.md` sagt heute ausdrücklich: „Dieses Repo führt dich nicht von
selbst." Wird der geführte Weg gemessen, misst man zusätzlich die Qualität
eines Claude-Projekts, das außerhalb des Repos lebt; wird der Selbstweg
gemessen, misst man einen Pfad, den vielleicht niemand geht. Neigung dieses
Plans: Selbstweg messen, weil nur er im Repo reparierbar ist. Nicht
entschieden.

**2 — `triggers.yml`: Träger und Berechtigung.** YAML braucht in Node 24
eine Abhängigkeit `[Fakt]`, und eine neue Abhängigkeit ist selbst ein Trigger.
Drei Wege: YAML mit Abhängigkeit (nach `werkzeug-auswahl`) · JSON ohne
Abhängigkeit (unhandlicher von Hand, aber Bordmittel) · eigener Mini-Parser
für die enge Teilmenge (kein Fremdcode, altert schlecht). Dahinter die
größere Frage, ob Paket D ohne Phase-4-Konsument überhaupt gebaut werden
darf. Nicht entschieden.

**3 — P7 ist nicht planbar.** `[offene Unsicherheit]` Evidenz-Modalitäts-
tabelle und Class-Sweep-Regel stammen aus den LifeOS-Unterlagen, die in
diesem Projektwissen nicht liegen. Ohne die Quelle lässt sich weder Umfang
noch Zuschnitt bestimmen. Entweder Quelle nachreichen oder P7 aus Phase 2
herausnehmen und benennen, wohin es geht. Erfinden ist keine Option.

**4 — Katalog-Pfad.** `docs/werkzeug-katalog.md` wie im Register, oder
`docs/harness/werkzeug-katalog.md` mit Gate-Abdeckung (Abschnitt 4, Paket B)?

**5 — Kodierungsfalle der Freigabe-Datei.** `[Fakt]` Zwei belegte Fehlschläge
beim Autor selbst. Der Fix ist klein (BOM abschneiden, UTF-16 erkennen, in
der Fehlermeldung auf die Kodierung hinweisen), steht aber nicht im Register
und wäre Scope-Erweiterung. Alternative: unangetastet lassen und die Messung
genau daran scheitern lassen — das wäre ein echter, wertvoller Befund. Beides
vertretbar, eines muss entschieden sein, **bevor** gemessen wird.

**6 — Abbruchbedingung.** Nach welcher gescheiterten Messung gilt nicht mehr
der Plan als reparaturbedürftig, sondern das Harness als zu schwer für den
gedachten Zweck? Dieser Plan schlägt zwei vor. Ohne vorab gesetzte Grenze
wird nachjustiert, bis es passt.

---

## 7. Risiken

| Risiko | Gegenmittel in diesem Plan |
|---|---|
| Phase 2 vergrößert die Lesefläche, die sie misst | Paket A (Kontextbudget) vor allem anderen |
| Der Katalog zieht seine Einträge nach sich, Paket B wächst | Harte Abgrenzung: kein Eintrag ohne Lern-Repo, keine Mechanik ohne Rot-Fall |
| Fünf Einstiegspunkte | Genau ein ausgewiesener erster Schritt in `README.md` |
| Beobachtereffekt bei der Messung | Interventionsprotokoll; Intervention zählt gegen das Dokument, nicht gegen die Person |
| Frische Augen sind endlich | Kalt-Lauf zuerst; höchstens zwei menschliche Läufe |
| `[Schlussfolgerung]` Paket D auf Vorrat gebaut | Sync-Gate als eigener, sofort wirksamer Nutzen — oder Paket D fällt |

---

## 8. Vorgesehener Vertragszuschnitt (Vorschau, noch kein Vertrag)

`[Annahme]` Vier Verträge, Nummerierung schließt an Phase 1 an. Zuschnitt
nach der Heuristik aus `CLAUDE.md`: ein Baudurchgang plus höchstens eine
Korrekturrunde, eigenständig prüfbares Artefakt.

| Nr | Inhalt | Prüfbares Artefakt |
|---|---|---|
| 5 | Werkzeug-Katalog-Mechanik, Glossar, `werkzeug-auswahl` Schritt 2, Trigger- und memory-map-Zeilen (Paket B) | `check:template` grün, Verweise aus dem Skill lösen auf |
| 6 | `state/reibung.md`, `session-reminder.js`, Doktrin-Verankerung (Pakete C und E) | `check:template` grün, kein Stand-Marker-Fehlalarm |
| 7 | Trigger-Quelle, Generator, Sync-Gate (Paket D) | Rot- und Grün-Fall in `state/gates.md` |
| 8 | `START-KLEIN.md` und der Einstiegs-Umbau in `README.md` (Paket F) | Kalt-Lauf ohne Sackgasse |

Paket A ist eine Entscheidung, Paket G Menschenarbeit — beide bekommen keinen
Vertrag.

`[Schlussfolgerung]` Reihenfolge 5 → 6 → 7 → 8 ist bindend: Vertrag 8
beschreibt den Zustand, den 5–7 herstellen. Fällt Paket D nach offenem
Punkt 2 weg, rückt 8 auf 7 vor; der Rest bleibt unverändert.

---

## 9. Nächster sinnvoller Schritt

Offene Punkte 1, 3 und 5 mit dem Menschen klären (nur er kann sie
entscheiden), dann Advisor-Pass in frischem Kontext gegen diese Datei, mit
den offenen Punkten als benanntem Fokus.

---

## 10. Entscheidungen des Menschen, vor dem Advisor-Pass

`[Fakt]` Am 17.08.2026 entschieden, nachdem dieser Plan geschrieben und
bevor der Advisor-Pass gelaufen war. Die Punkte 2, 4 und 6 aus Abschnitt 6
bleiben ausdrücklich offen und sind der Fokus des Passes.

| Offener Punkt | Entscheidung | Folge für den Plan |
|---|---|---|
| 1 — Messpfad | **Selbstweg** über `START-KLEIN.md`; die Testperson bekommt nur das Repo | Paket F wird der gemessene Pfad. `README.md` muss den Selbstweg als ersten Schritt ausweisen, der geführte Onboarding-Weg bleibt als zweiter Weg benannt |
| 3 — P7 | **Aus Phase 2 herausnehmen**, Begründung „Quelle lag zum Planungszeitpunkt nicht vor", Verschiebung nach Phase 3 | Kein Arbeitspaket für P7. Das Register wird an dieser Stelle nachgezogen |
| 5 — Kodierungsfalle | **Vor der Messung fixen** | Neues Arbeitspaket **B2**: `commit-guard.js` erkennt UTF-16 und schneidet ein BOM ab, Fehlermeldung nennt die Kodierung. Braucht Rot- und Grün-Fall in `state/gates.md`. Zuschnitt und Vertragszuordnung sind noch offen — siehe Auftrag an den Advisor |

`[Schlussfolgerung]` Paket B2 ist eine Scope-Erweiterung gegenüber dem
Register. Sie ist durch zwei belegte Vorfälle gedeckt (`state/gates.md`,
Kalibrierungs-Log 17.08.2026) und betrifft ein bestehendes Gate, keine neue
Regel — die Beförderungsregel „dreimal → Regel" ist deshalb nicht der
richtige Maßstab. Ob sie an Vertrag 6 gehängt oder ein eigener Vertrag wird,
entscheidet Plan v2.

---

## Status
- [ ] Freigegeben
- [ ] Freigegeben mit Hinweisen
- [ ] Nicht freigegeben
- [x] Blockiert — offene Punkte 1, 3 und 5 brauchen eine menschliche
      Entscheidung, bevor der Advisor-Pass sinnvoll ist
