<!--
Stand dieser Fassung: 17.08.2026
Advisor-Findings zu Plan v1, Phase 2 des Harness-Fix-Programms.
Ziel-Pfad im Repo: state/advisor-findings-phase2-adoptionsfaehigkeit.md
-->

# Advisor-Findings — Phase 2 Adoptionsfähigkeit

## Kopf

Geprüft wurde `state/plan-v1-phase2-adoptionsfaehigkeit.md` (Plan v1,
17.08.2026) gegen einen frischen Klon von `main` bei `97afe1e` — den realen
Ist-Zustand, nicht die Beschreibung davon.

Gelesene Quellen: der Register-Auszug zu Phase 2 · `scripts/check-docs.mjs`,
`check-contract.mjs`, `check-rules.mjs` · `package.json` ·
`.github/workflows/ci.yml` · `.claude/settings.json` ·
`.claude/hooks/commit-guard.js`, `guard-settings.js`, `session-reminder.js` ·
`.claude/skills/werkzeug-auswahl/SKILL.md`, `handoff-vertrag/SKILL.md` ·
`CLAUDE.md`, `ARCHITECTURE.md`, `README.md`, `SETUP.md` · `state/gates.md`,
`triggers.md`, `memory-map.md`, `tooling.md`,
`advisor-findings-phase1-vertraege.md`, `plan-v2-phase1-vertraege.md`,
`tasks/harness-fix-2-commit-guard.md` · `docs/guide/00-START-HIER.md`,
`docs/onboarding/START-PROMPT.md` · `docs/harness/HARNESS-GLOSSARY.md` ·
`.gitignore`, `.gitattributes`, `.claudeignore`.

**Rollengrenze — und eine Verletzung, die der Advisor selbst benennt.**
Auftrag war ausschließlich Read, Grep, Glob. Der Advisor hat **einen**
Bash-Aufruf gemacht (`ls -la` auf vier Verzeichnisse, rein lesend, keine
Zustandsänderung) und die Grenze danach wieder eingehalten. Er bezeichnet das
selbst als Fehler, nicht als Notbehelf — `Glob` hätte dasselbe geliefert.
Nichts wurde geschrieben, editiert, verschoben oder committet. Alle übrigen
Erkenntnisse stammen aus Read/Grep. `[Fakt]` Der Vorfall bleibt hier stehen,
statt geglättet zu werden: Ein Prüfer, dessen Rollengrenze einmal nachgibt,
ist ein Befund über das Verfahren, nicht nur über diesen Lauf.

**Was wegen der Rollengrenze nicht geprüft werden konnte:**

- `npm run check:template` wurde nicht ausgeführt — jede Aussage über Rot/Grün
  ist aus dem Code abgeleitet, nicht beobachtet.
- Die Hooks wurden nicht ausgeführt. Zeitzonen- und `cwd`-Verhalten von
  `commit-guard.js` sind aus dem Quelltext geschlossen, nicht gemessen.
- Kein `git log`/`git diff` — die belegten Vorfälle sind nur über
  `state/gates.md` bezeugt, nicht über Commits.
- Windows-, CRLF- und Node-Versions-Verhalten nur aus Code und Dokumentation
  abgeleitet.
- Die LifeOS-Quellen zu P7 liegen nicht im Repo. Offener Punkt 3 ist damit
  auch für den Advisor nicht prüfbar; die Entscheidung des Menschen
  (Herausnehmen) ist die einzige belegbare.
- Das Befundregister lag nur als Auszug vor. Aussagen der Form „steht so nicht
  im Register" gelten gegen diesen Auszug.

## Marker-Legende

`[Fakt]` am Code oder an der Datei belegt, Fundstelle genannt ·
`[Schlussfolgerung]` aus Belegen abgeleitet · `[Annahme]` plausibel, aber
ungeprüft · `[offene Unsicherheit]` ungeklärt, auch nach Prüfung ·
`[Fakt, entlastend]` geprüft und in Ordnung.

---

## Befunde — vor Umsetzungsbeginn zu klären

### B1 — M4 verlangt zwei Freigabe-Dateien, nicht eine; der Push-Pfad ist unkalibriert

`[Fakt]` + `[Schlussfolgerung]`

Belege: `.claude/hooks/commit-guard.js:92-95`, `:107`, `:144` ·
`state/gates.md:17` · Plan `:83` (M4) · `CLAUDE.md:69-70`

`[Fakt]` `commit-guard.js:93-95` behandelt `commit` und `push` mit demselben
Muster — beide lösen die Freigabeprüfung aus. `[Fakt]` `:144` löscht die
Freigabe-Datei bei erfolgreicher Prüfung (`fs.unlinkSync`).
`[Schlussfolgerung]` Daraus folgt zwingend: Nach dem Commit ist die Datei weg,
der unmittelbar folgende `git push` fällt in den `catch` bei `:107-113` und
wird abgewiesen. Es braucht eine zweite, erneut vom Menschen angelegte
Freigabe innerhalb eines neuen Zehn-Minuten-Fensters.

`[Fakt]` `state/gates.md:17` dokumentiert Rot- und Grün-Fall ausschließlich
für `git commit`. Ein `git push` taucht in keinem der drei
Kalibrierungsfälle auf. `[Fakt]` `CLAUDE.md:69-70` beschreibt „committen UND
pushen" als *einen* Iterationsabschluss; Plan `:83` formuliert M4 ebenso als
einen Meilenstein.

**Auswirkung.** Der Meilenstein, den der Plan selbst als wahrscheinlichsten
Ausfall vorhersagt, ist enger als vorhergesagt: zwei Schlüssel-Vorgänge statt
einem, keiner davon in `START-KLEIN.md` dokumentiert (die Datei existiert
noch nicht), und der zweite im ganzen Repo nie kalibriert.
`[Schlussfolgerung]` Der Push-Pfad des schärfsten Gates im Harness ist ein
ungeprüftes Versprechen — genau der Zustand, den `state/gates.md:4-7`
ausschließen will.

**Empfehlung.** M4 in Plan v2 als „zwei Freigaben" formulieren oder
aufteilen · der Push-Fall bekommt einen eigenen dokumentierten Rot- und
Grün-Fall (derselbe Wegwerf-Branch-Lauf, fast keine Zusatzkosten) ·
`START-KLEIN.md` benennt den doppelten Vorgang, nicht der Beobachter im
Messlauf.

### B2 — Die wahrscheinlichere M4-Bruchstelle ist Zeitzone und Format, nicht die Kodierung

`[Fakt]` + `[Schlussfolgerung]`

Belege: `.claude/hooks/commit-guard.js:110-111`, `:116-118`, `:126`,
`:135-139` · `state/tasks/harness-fix-2-commit-guard.md:121-122` ·
Plan `:290-295`, `:357`

`[Fakt]` Das Muster in `:117` ist
`/^Freigegeben:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?)/m` — es erfasst
keinen Zeitzonen-Offset und kein `Z`. `[Fakt]` `:126` übergibt den Treffer an
`new Date(...)`; ein ISO-Datum mit Zeit ohne Offset wird in JavaScript als
lokale Zeit interpretiert. `[Fakt]` `:135` verweigert bei `minutenAlt > 10`.

`[Schlussfolgerung]` Konkreter Fehlerpfad mit höherer
Eintrittswahrscheinlichkeit als die Kodierungsfalle: Eine fremde Person liest
die Hook-Meldung `:110-111` — „Freigabe im eigenen Editor anlegen:
Freigegeben: &lt;ISO-Zeitstempel&gt;" — und tut das Naheliegende. Ein echter
ISO-Zeitstempel ist `2026-08-17T09:54:13Z` oder `…+00:00`. Das Muster
schneidet Offset und `Z` stillschweigend ab, `new Date` liest die Uhrzeit als
Ortszeit, in Sommerzeit sind das 120 Minuten Rückstand → „Freigabe ist 120
Minuten alt … verweigert". Die Meldung nennt eine Ursache, die nicht die
Ursache ist.

`[Fakt]` Zweiter Pfad: `2026-08-17 11:54` (Leerzeichen statt `T`) matcht nicht
→ „keine gültige Zeile". `[Fakt]` Das einzige exakte Format steht in
`state/tasks/harness-fix-2-commit-guard.md:121-122` — einer Vertragsdatei, die
eine fremde Person auf dem Selbstweg nicht liest. Weder `README.md` noch
`SETUP.md` noch `CLAUDE.md` nennen das Format. `[Fakt]` Dritter, kleinerer
Pfad: `:135` verweigert auch bei `minutenAlt < 0` und meldet dann „ist -0
Minuten alt".

**Auswirkung.** `[Schlussfolgerung]` Die Vorhersage des Plans (`:109-113`) ist
richtig, die Ursachenzuschreibung unvollständig. Paket B2 fixt BOM und
UTF-16 — die Person scheitert danach an der Zeitzone, und der Messlauf
verbrennt seinen zweiten von zwei Versuchen an einem vorher bekannten Fehler.

**Empfehlung.** Paket B2 um zwei Zeilen erweitern: Offset und `Z` mitparsen
und an `new Date` durchreichen, Fehlermeldung gibt das erwartete Format
wörtlich aus. Zusätzlich das exakte Format in `START-KLEIN.md`, nicht nur in
die Fehlermeldung.

### B3 — Offener Punkt 4: die Gate-Abdeckungs-Behauptung stimmt nicht, wie der Plan sie zitiert

`[Fakt]` (widerlegt) + `[Schlussfolgerung]`

Belege: Plan `:41`, `:160-164`, `:287-288` · `scripts/check-docs.mjs:36-42`,
`:44-59`, `:104-128`, `:179`, `:202-205`, `:207-215` ·
`docs/harness/HARNESS-GLOSSARY.md:3`

`[Fakt]` **Prüfung 1 prüft Verweise, nicht Zieldateien.**
`check-docs.mjs:104-128` liest die Anweisungsdokumente (einschließlich aller
`SKILL.md` über `sammleSkillDateien:36-42`) und prüft jeden dort in Backticks
genannten Pfad auf Existenz (`:117-120`). Paket B Punkt 3 lässt
`werkzeug-auswahl/SKILL.md` genau auf die Katalogdatei verweisen. Damit
erfasst Prüfung 1 den Katalog unter `docs/werkzeug-katalog.md` genauso wie
unter `docs/harness/werkzeug-katalog.md` — sie schützt den Verweis, der Pfad
ist ihr gleichgültig. Die zitierte Belegstelle stützt die Aussage des Plans
nicht.

`[Fakt]` **Prüfung 3 hat am Katalog im Template keinen Zahn.** `:207-215`
überspringt jede Datei ohne gültigen Marker; die Prüfung feuert nur, wenn in
derselben Datei ein Datum steht, das jünger ist als der Marker. Die
Eintragsliste bleibt laut Plan `:143-144` leer — es gibt keine Prüfdaten,
gegen die der Marker widersprüchlich werden könnte. `[Fakt]` Beleg für die
Wirkungslosigkeit: `HARNESS-GLOSSARY.md:3` trägt
`Stand dieser Fassung: [FÜLLUNG]` und ist damit heute vollständig aus
Prüfung 3 heraus, obwohl die Datei unter `docs/harness/` liegt.

**Auswirkung.** `[Schlussfolgerung]` Die Entscheidung des Plans
(`docs/harness/`) ist im Ergebnis richtig, aber aus schwächeren Gründen:
Nachbarschaft zu den übrigen Harness-Dokumenten und künftige Wirksamkeit von
Prüfung 3, sobald Phase 3 Prüfdaten nachliefert. `[Schlussfolgerung]` Das
eigentliche Problem bleibt: K4 („Stand-Marker in den Kopf") bekommt in
Phase 2 an keinem der beiden Pfade einen Zahn. Wer den Umzug als „unter
Gate-Abdeckung" verbucht, hat K4 weitergewunken. Eine falsche Begründung für
eine richtige Entscheidung ist gefährlicher als keine — wörtlich die Lehre aus
F11 des Phase-1-Passes (`state/advisor-findings-phase1-vertraege.md:104`).

**Empfehlung.** Pfad übernehmen, Begründung austauschen. In Plan v2
ausdrücklich festhalten: K4 ist in Phase 2 unbezahnt und wird mit N7 in
Phase 3 scharf gestellt. Der Katalog muss aus mindestens einem
Anweisungsdokument verlinkt sein — das ist die einzige Gate-Abdeckung, die er
in Phase 2 tatsächlich hat.

### B4 — Offener Punkt 2: Paket D gehört nicht in Phase 2; die Trägerfrage ist die kleinere Frage

`[Fakt]` + `[Schlussfolgerung]`

Belege: Register-Auszug (N10-Fenster) · Plan `:194-208`, `:313` ·
`scripts/check-docs.mjs:112` ·
`state/advisor-findings-phase1-vertraege.md:116` · `state/memory-map.md:15` ·
`.github/workflows/ci.yml:26-34`, `:37` · `CLAUDE.md:36-39` ·
`README.md:42-50` · `state/triggers.md:14`

Fünf Belege, alle in dieselbe Richtung:

1. `[Fakt]` Das Register gibt N10 das Fenster **„vor Workforce-Code"**, nicht
   „in Phase 2". Der Plan übernimmt N10, ohne dieses Fenster zu erwähnen. Der
   eigene Zweifel im Plan (`:205-208`) ist begründeter, als er dort steht: Es
   ist nicht nur Bauen auf Vorrat, es ist Bauen außerhalb des vom Register
   gesetzten Fensters.
2. `[Fakt]` `check-docs.mjs:112` erfasst nur die Endungen
   `md|ts|tsx|js|mjs|json`. `.yml` ist nicht dabei — und genau das ist im Repo
   bereits als bestätigter Befund dokumentiert
   (`advisor-findings-phase1-vertraege.md:116`). `[Schlussfolgerung]` Jeder
   Verweis auf `state/triggers.yml` verrottet still. Paket D baut seine harte
   Quelle ausgerechnet in die einzige Endung, die das Doku-Gate nicht sieht.
3. `[Fakt]` `memory-map.md:15` nennt `state/triggers.md` als Heimat der
   Trigger. Paket D dreht diese Zuordnung um, listet aber keine
   memory-map-Zeile — die Pakete B, C und E tun das jeweils.
   `[Schlussfolgerung]` Das verletzt die Pflicht, die derselbe Plan in
   Paket E (R1) gerade als Doktrin verankern will.
4. `[Fakt]` `CLAUDE.md:36-39` und `README.md:42-50` beschreiben die Prüfkette
   namentlich und abzählbar. Paket D fügt eine vierte Stufe hinzu.
   `[Schlussfolgerung]` Beide Beschreibungen werden falsch, und kein Gate
   fängt das — Prüfung 1 prüft Pfade, nicht Aussagen. Zwei stille Lücken in
   genau den zwei Dateien, die eine fremde Person zuerst liest.
5. `[Fakt]` `ci.yml:26-34` fährt bewusst ohne `package-lock.json` und mit
   deaktiviertem npm-Cache, weil das Template keine Abhängigkeiten hat.
   `[Schlussfolgerung]` Die YAML-Variante macht `npm install` zur Vorbedingung
   von M1 und hängt dem gemessenen Pfad einen Netzwerkschritt an. Sie verletzt
   zudem die eigene Regel: Eine neue Abhängigkeit ist selbst ein Trigger
   (`state/triggers.md:14`) und bräuchte einen `werkzeug-auswahl`-Durchlauf
   mit Eintrag in `state/tooling.md` — Arbeit, die der Plan nicht eingeplant
   hat.

**Auswirkung.** `[Schlussfolgerung]` Paket D bringt in Phase 2 keinen Nutzen
außer dem Dogfooding-Argument, erzeugt dafür eine unbewachte Dateiendung, eine
widersprüchliche memory-map, zwei falsch werdende Einstiegsdokumente, einen
vierten Vertrag und — in der YAML-Variante — die erste Laufzeitabhängigkeit
des Templates mitten im gemessenen Pfad. Das Gegenmittel, das der Plan selbst
in `:313` notiert, trägt nicht: Ein Sync-Gate, dessen einzige Quelle sieben
handgeschriebene Zeilen sind, prüft die Übereinstimmung zweier Dateien, die
beide niemand liest.

**Empfehlung.** Paket D aus Phase 2 streichen. N10 an das Register-Fenster
„vor Workforce-Code" binden und dort als benannten Folgeauftrag führen — nicht
in einer NICHT-Liste verschwinden lassen (`handoff-vertrag/SKILL.md:46-52`).
Für R2 bleibt Paket E als Doktrin bestehen; der lebende Beleg kommt mit dem
Workforce-Code, wo er ohnehin echt ist. Falls Paket D trotzdem gewollt ist:
**JSON, kein YAML und kein Mini-Parser** — Bordmittel, keine Abhängigkeit,
keine Alterung, und `.json` ist von Prüfung 1 erfasst. Der Mini-Parser ist die
schlechteste Option: eigener Code ohne Testsatz, in einem Repo, dessen
Bestandstestsatz erst in Phase 3 kommt.

### B5 — `START-KLEIN.md` ist die einzige neue Datei ohne Gate-Abdeckung — und sie trägt das ganze Tor

`[Fakt]` + `[Schlussfolgerung]`

Belege: `scripts/check-docs.mjs:44-59` · Plan `:225-231`, `:328`, `:355`

`[Fakt]` `anweisungsDateien` (`:44-59`) enthält `CLAUDE.md`,
`ARCHITECTURE.md`, `README.md`, alle Agent-Dateien, alle `SKILL.md`, alle
Kommandos. Eine weitere Datei in der Repo-Wurzel ist nicht dabei. `[Fakt]` Der
Plan legt `START-KLEIN.md` in die Wurzel und macht sie durch Entscheidung 1
zum gemessenen Pfad. `[Schlussfolgerung]` Ein toter Verweis in genau der
Datei, an der das Tor hängt, wird von keinem Gate gefunden — und fällt erst
der Testperson auf, wo er als Intervention gegen die Datei zählt.

`[Fakt]` Der Plan sieht als Prüfartefakt für Vertrag 8 nur „Kalt-Lauf ohne
Sackgasse" vor. Das ist kein eigenständig prüfbares Artefakt im Sinn der
Zuschnitt-Heuristik (`CLAUDE.md:73-77`), sondern ein Modelllauf mit
nicht-deterministischem Ergebnis.

**Empfehlung.** `'START-KLEIN.md'` in die Liste `check-docs.mjs:44-59`
aufnehmen. `[Fakt]` Das ist keine neue Regel in `check-rules.mjs` und
verletzt Abschnitt 5 des Plans nicht; es ist eine Zeile im bestehenden
Geltungsbereich von Prüfung 1. `[Schlussfolgerung]` Nebenwirkung gleich null:
Prüfung 2 läuft nur über `CLAUDE.md` und `ARCHITECTURE.md`, Prüfung 3 nur
über `docs/harness/` und `state/`. Rot-Fall: ein absichtlich toter Verweis in
`START-KLEIN.md`, wie in Phase 1 mit `_test-verstuemmelt.md` gehandhabt. Damit
bekommt Vertrag 8 ein hartes Prüfartefakt.

### B6 — Das Kontextbudget zählt die falschen zwei Dateien

`[Fakt]` + `[Schlussfolgerung]`

Belege: Plan `:124-133`, `:355` · `README.md` (101 Zeilen, insb. `:11-29`,
`:72-73`) · `SETUP.md` (87 Zeilen, insb. `:6-26`) · `CLAUDE.md:9-11`

`[Fakt]` Paket A definiert die Erstlektüre als `START-KLEIN.md` plus
`CLAUDE.md`. `[Schlussfolgerung]` Beide Posten sind falsch gewählt:
`CLAUDE.md` ist der Master-Kontext des **Modells**, nicht die Erstlektüre des
Menschen — `CLAUDE.md:9-11` adressiert ausdrücklich das Modell. Eine fremde
Person muss diese Datei in 60 Minuten nicht durchlesen, sie muss wissen, *dass*
sie gilt (das ist M2-Frage a). `[Fakt]` `README.md:72-73` verlangt im
Bootstrap-Schritt 2 ausdrücklich „`SETUP.md` lesen und abarbeiten", mit Branch
Protection als erstem Punkt. `[Schlussfolgerung]` Auf dem entschiedenen
Selbstweg sind `README.md` (101 Zeilen) und `SETUP.md` (87 Zeilen) zwingende
Erstlektüre — 188 Zeilen, die im Budget nicht vorkommen. Die Zahl 320 stimmt
zufällig ungefähr, die Zusammensetzung nicht.

Zur Frage, ob „das Budget hat keinen Zahn" trägt: `[Schlussfolgerung]` Die
Ehrlichkeit trägt, die Schlussfolgerung nicht. Das Tor misst *Zeit bis
arbeitsfähig*, nicht Zeilenzahl. Ein Budget ohne Zahn ist in Phase 2 nicht der
Fehler; der Fehler ist, es auf die zwei Dateien zu legen, die der gemessene
Pfad gar nicht als Erstlektüre hat. Erfüllt `START-KLEIN.md` seine Aufgabe —
ausdrücklich zu sagen, was man jetzt **nicht** liest —, dann ist genau dieser
Satz der Zahn, und er ist im Messlauf sofort prüfbar.

**Empfehlung.** Erstlektüre = `START-KLEIN.md` (≤ 120 Zeilen) und nichts
sonst bis M3. `README.md` und `SETUP.md` werden von dort aus punktuell
adressiert („für den Push brauchst du SETUP.md Punkt 1"), nicht als Ganzes
gelesen. `CLAUDE.md` wird als Modellkontext benannt; die 23-Zeilen-Reserve
bleibt als Grenze für Paket E trotzdem sinnvoll und ist unabhängig davon
begründet (N8).

### B7 — Die Begründung für das Streichen von Verfallsgate und Rückflussregel ist am eigenen Repo widerlegt

`[Fakt]` (widerlegt) + `[Schlussfolgerung]`

Belege: Plan `:172-176` · `state/gates.md:11`, `:121-128` · Register-Auszug
(C.1, P4-Fenster)

Der Plan begründet die Vertagung mit „ohne Einträge kein Rot-Fall, also nach
der Tor-Regel aus Phase 1 nicht kalibrierbar". `[Fakt]` Das Repo hat den
Gegenbeweis in sich: Der Rot-Fall des Vertrags-Gates wurde über eine
absichtlich konstruierte, nicht committete Testdatei erzeugt
(`state/gates.md:121-128`), und beim Doku-Gate wurde derselbe Weg mit einer
temporären Testzeile in `CLAUDE.md` gegangen (`:11`). `[Schlussfolgerung]`
„Ohne Einträge kein Rot-Fall" ist sachlich falsch — ein Verfallsgate ließe
sich mit einem einzigen Fixture-Eintrag rot machen, exakt nach dem etablierten
Muster des Repos.

Die **Entscheidung** bleibt richtig: `[Fakt]` Das Register weist die 18
Einträge dem Lern-Repo zu, und das Lern-Repo liegt in Phase 3; ein
Verfallsgate im Template hätte dort nichts zu prüfen. Es ist die Begründung,
die nicht trägt — und sie trägt in die falsche Richtung, weil sie eine Regel
erfindet („kein Rot-Fall ohne echte Daten"), die künftig jede unbequeme
Mechanik vertagbar macht.

Zur Frage, was vom „Schwerpunkt der Phase" übrig bleibt: `[Fakt]` Das Register
weist dem Template selbst nur Legende, Eintragsformat, Quellenregel und die
Mechanik „Bewusst nicht aufgenommen" zu — ausdrücklich „~40 Zeilen, reine
Mechanik, echtes Skelett". `[Schlussfolgerung]` Paket B liefert genau das,
plus die vier Anbindungen. Der Vorwurf „bequeme Ausrede" trifft die
Reduktion **nicht**; er trifft nur die Begründung.

**Empfehlung.** Begründung austauschen: Verfallsgate und Rückflussregel ziehen
mit dem Lern-Repo in Phase 3, weil ihr Gegenstand dort liegt — nicht, weil sie
nicht kalibrierbar wären. Die Fixture-Möglichkeit ausdrücklich benennen und an
N4 hängen, damit die Mechanik in Phase 3 nicht erneut an derselben
Scheinbegründung hängenbleibt.

### B8 — Die Reihenfolge-Behauptung ist zu stark, und Vertrag 6 ist zu groß geschnitten

`[Fakt]` + `[Schlussfolgerung]`

Belege: Plan `:323-335`, `:357` · `CLAUDE.md:73-77` ·
`.claude/skills/handoff-vertrag/SKILL.md:17-20` ·
`state/tasks/harness-fix-2-commit-guard.md:106-128`, `:154-156` ·
`state/advisor-findings-phase1-vertraege.md:104`

`[Fakt]` Der Plan behauptet, die Reihenfolge 5 → 6 → 7 → 8 sei bindend, weil
Vertrag 8 den Zustand beschreibt, den 5–7 herstellen. `[Schlussfolgerung]`
Diese Begründung stützt genau eine Aussage: **8 kommt zuletzt.** Sie sagt
nichts darüber, warum 5 vor 6 oder 6 vor 7 laufen müsste — Paket C hängt an
keiner Zeile aus Paket B, und Paket D an keiner aus C/E. Genau dieser
Fehlertyp — richtige Reihenfolge, nicht tragende Begründung — ist als F11 im
Phase-1-Pass protokolliert.

`[Fakt]` `CLAUDE.md:73-77` und `handoff-vertrag/SKILL.md:17-20` verlangen: ein
Baudurchgang plus höchstens eine Korrekturrunde, ein eigenständig prüfbares
Artefakt. Vertrag 6 bündelt Paket C und Paket E; dazu soll möglicherweise B2
kommen. `[Fakt]` B2 ist ein Eingriff in einen Sicherheits-Hook mit Pflicht zu
Rot- und Grün-Fall. `[Fakt]` Der Präzedenzfall im Repo —
`harness-fix-2-commit-guard.md` — brauchte dafür zwei ausdrückliche
Halte-Punkte am Menschen und einen Wegwerf-Branch, und der Vertrag musste
diese Halte-Punkte im BUDGET aus der Korrekturrunden-Zählung herausnehmen.
`[Schlussfolgerung]` Vertrag 6 mit B2 sind zwei Baudurchgänge in einem
Vertrag: eine Dokumentationsrunde ohne Halt und eine Hook-Runde mit zwei
Menschen-Halten und Kalibrierung.

**Empfehlung.** Reihenfolge präzisieren: 8 zuletzt (bindend), 5/6/7 frei · B2
wird ein **eigener** Vertrag, zusammen mit dem Push-Fall aus B1 und dem
Zeitzonen-Fix aus B2; Prüfartefakt sind vier dokumentierte Fälle in
`state/gates.md` (Rot/Grün für commit, Rot/Grün für push) · dieser Vertrag ist
der einzige der Phase, der **vor** der Messung fertig sein muss, und gehört an
den Anfang, nicht in die Mitte · Vertrag 8 bekommt zusätzlich zum Kalt-Lauf
ein hartes Artefakt (siehe B5).

### B9 — 3b (Prüfbefehl-Indirektion, Node-Bindung) wurde von Phase 1 hierher vertagt und fehlt vollständig

`[Fakt]`

Belege: `state/plan-v2-phase1-vertraege.md:20`, `:234-241`, `:247` ·
Plan `:17-30`, `:249-258` · `handoff-vertrag/SKILL.md:46-52`

`[Fakt]` `plan-v2-phase1-vertraege.md:20` hält fest: „12 — 3b wandert nach
Phase 2 (F14)", `:234` „Prüfbefehl-Indirektion: vertagt nach Phase 2", und
`:247` führt es unter „Was ausdrücklich nicht in Phase 1 gehört" mit dem
Zusatz „(3b, jetzt Phase 2)". `[Fakt]` Die dahinterliegende Frage lautet
wörtlich: „ist das Harness node-gebunden? Fünf Hook-Aufrufe laufen über
`node`, dazu `engines` und die CI-Toolchain". `[Fakt]` Weder Abschnitt 0 noch
Abschnitt 5 des Plans erwähnt 3b; auch der Register-Auszug führt es nicht —
die Vertagung stand nur im Phase-1-Plan.

**Auswirkung.** `[Schlussfolgerung]` Ein ausdrücklich vertagtes Arbeitspaket
ist zwischen zwei Phasen verschwunden — exakt der Fehler, den das Repo an
anderer Stelle als Regel formuliert: „‚Falls nötig' ohne diese Sektion ist
keine Vertagung, sondern ein Verschwinden — real vorgekommen". Inhaltlich ist
es tor-relevant: Die Node-Bindung entscheidet mit, was eine fremde Person in
M1 installieren und wissen muss.

**Empfehlung.** 3b in Plan v2 aufnehmen — als Arbeitspaket oder mit
ausdrücklicher, benannter Weitervertagung samt Ziel-Phase. Neigung des
Advisors: erneut vertagen, aber die Node-Bindung als Fund in
`state/tooling.md` oder `docs/harness/HARNESS-LEARNING-STATE.md` notieren, wie
Phase 1 es beschlossen hat und wie es bis heute nicht geschehen ist.

### B10 — Offener Punkt 6: Die Abbruchbedingung fehlt, obwohl der Plan behauptet, zwei vorzuschlagen

`[Fakt]` + `[Schlussfolgerung]`

Belege: Plan `:101-106`, `:297-300` · Register-Auszug (Tor Phase 2)

`[Fakt]` Der Plan sagt „Dieser Plan schlägt zwei vor". `[Fakt]` Was in
`:101-106` tatsächlich steht, ist eine **Ressourcenregel** (Kalt-Lauf → Fix →
eine Messung; bei Fehlschlag zweite Fix-Runde → zweite Messung; danach Halt).
Das ist eine Grenze für die Anzahl der Versuche, keine Abbruchbedingung im
Sinn der Frage, die der Plan selbst stellt. `[Schlussfolgerung]` Der Plan
verweist auf einen Vorschlag, den er nicht macht; der offene Punkt ist nicht
nur offen, sondern unbearbeitet.

**Empfehlung.** Vor der ersten Messung schriftlich festlegen, mindestens drei
Bestandteile:

1. **Trennkriterium.** Interventionen werden zwei Töpfen zugeordnet:
   *dokumentbedingt* (die Antwort stand irgendwo, war nur nicht auffindbar)
   und *mechanikbedingt* (die Antwort steht nirgends, oder das Verfahren
   selbst — Zwei-Schlüssel, Frischefenster, Gate-Kette — ist die Hürde).
   Überwiegen im **zweiten** Lauf die mechanikbedingten, ist der Befund das
   Harness, nicht das Dokument.
2. **Wiederholungskriterium.** Scheitert der zweite Lauf am **selben**
   Meilenstein wie der erste, obwohl die Fix-Runde genau dorthin gezielt hat →
   Halt, unabhängig von der Gesamtzeit.
3. **Folge des Halts.** Ergebnis nach
   `docs/harness/HARNESS-LEARNING-STATE.md` und in die Übergabe, Phase 3
   wartet, und der Zuschnitt des Programms — nicht der Plan — wird neu
   bewertet.

`[Fakt, entlastend]` Die Ressourcenregel selbst trägt: die Annahme „höchstens
drei Kandidaten" deckt sich mit dem Programmkontext (vier Personen, minus dem
Autor).

---

## Befunde — dürfen mitlaufen

### B11 — M3 hat eine eingebaute Falle, die der Plan nicht vorhersagt

`[Schlussfolgerung]` auf `[Fakt]`-Grundlage

Belege: Plan `:82`, `:108-113` · `scripts/check-docs.mjs:139-145`, `:149` ·
`CLAUDE.md:19-26`, `:71-72`

`[Fakt]` M3 verlangt eine inhaltliche Änderung am Stack-Block in `CLAUDE.md`
oder `ARCHITECTURE.md` §1 bei weiterhin grünem `check:template`. `[Fakt]`
Prüfung 2 läuft über genau diese beiden Dateien und meldet jedes Vorkommen des
Musters aus `:144`. `[Schlussfolgerung]` Eine fremde Person, die den Block
naheliegend füllt („Framework: Next.js 15.1"), macht `check:template` rot. Die
Regel dazu steht in `CLAUDE.md:71-72`, also in derselben Datei, aber 50 Zeilen
weiter unten.

`[Schlussfolgerung]` Im Kern ist das ein gutes Ergebnis — das Gate tut, was es
soll, und die Person lernt die Regelhierarchie am eigenen Leib. Aber der Plan
sagt es nicht voraus, und was nicht vorhergesagt ist, wird im Protokoll als
Fehlschlag von `START-KLEIN.md` verbucht. Zweitens: „React 19" löst nicht aus,
„React 19.1" schon — die Person erlebt eine Regel, die scheinbar zufällig
greift.

**Empfehlung.** In die Vorhersage vor der Messung aufnehmen, und
`START-KLEIN.md` einen Satz geben: keine Versionsnummern in den Stack-Block,
die gehören in die Paketdatei.

### B12 — Der Messaufbau ist nicht spezifiziert: Remote, GitHub-Tarif, Node-Version

`[Fakt]` + `[offene Unsicherheit]`

Belege: Plan `:80`, `:83`, `:355` · `SETUP.md:6-26`, `:18-23` ·
`package.json:5-7` · `README.md:69-71` · `CLAUDE.md:161-168` ·
`.gitattributes:13`

`[offene Unsicherheit]` M4 endet mit „Push", aber Entscheidung 1 sagt nur „die
Testperson bekommt nur das Repo". Ohne Remote ist M4 nicht ausführbar; mit
Branch Protection ohne Bypass ist ein Push auf `main` korrekt blockiert und
braucht einen PR. `[Fakt]` `SETUP.md:18-23` weist zudem darauf hin, dass
Branch Protection bei privaten Repos auf GitHub Free nicht durchgesetzt wird.
Welcher Aufbau gemessen wird, entscheidet, was M4 überhaupt bedeutet.

`[Fakt]` `package.json:5-7` deklariert `"node": "24.x"`.
`[Schlussfolgerung]` npm erzwingt `engines` ohne `engine-strict` nicht; eine
Person mit zu alter Node-Version bekommt in M1 einen Syntaxfehler ohne Bezug
zum Harness. M1 enthält keinen Versionscheck.

`[Fakt, entlastend]` Zeilenenden sind abgedeckt: `.gitattributes:13` setzt
`* text=auto eol=lf`, und `CLAUDE.md:161-168` beschreibt die verbleibende
Linux-Mount-Falle mit Gegenmittel. `[Annahme]` Das reicht, solange die
Testperson nicht aus einer Linux-Sicht auf ein Windows-Verzeichnis arbeitet.

**Empfehlung.** Der Messaufbau gehört als eigener Abschnitt in Plan v2, nicht
in die Improvisation des Beobachters: Repo-Variante (eigenes GitHub-Konto über
„Use this template" — der realistische Fall), Tarif,
Branch-Protection-Zustand, und ein Node-Versions-Satz als erste Zeile von
`START-KLEIN.md`.

### B13 — Weitere Stolperstellen im `commit-guard.js`, die M4 treffen können

`[Fakt]` + `[Annahme]`

Belege: `.claude/hooks/commit-guard.js:70-84`, `:102-103`, `:107`, `:116-118`,
`:135-139` · `state/tasks/harness-fix-2-commit-guard.md:52-56`

- `[Fakt]` `:78-84` verweigert jeden Bash-Befehl, der die Zeichenkette
  `state/freigabe-commit.md` enthält — auch `ls` oder `cat`. Das ist Absicht
  und richtig. `[Schlussfolgerung]` Für eine fremde Person, die nachsehen
  will, ob ihre Datei angekommen ist, sieht es wie ein Defekt aus. Gehört als
  vorweggenommene Erklärung in `START-KLEIN.md`.
- `[Annahme]` `:102-103` bildet den Dateipfad aus
  `eingabe.cwd || process.cwd()`. Liegt das Arbeitsverzeichnis nicht auf der
  Repo-Wurzel, zeigt der Pfad ins Leere und der Hook meldet „ohne
  Freigabe-Datei", obwohl sie existiert. Nicht ausführbar geprüft; gehört als
  Prüfpunkt in den B2-Vertrag.
- `[Fakt]` `:135-139` verweigert auch bei `minutenAlt < 0` und gibt dann
  „ist -0 Minuten alt" aus. Ein Satz in der Meldung („Zeitstempel liegt in der
  Zukunft") kostet nichts.

`[Fakt, entlastend]` Der vom Plan benannte Ansatzpunkt für den Kodierungsfix
ist richtig gewählt: `:107` (`fs.readFileSync(dateiPfad, "utf8")`) ist die
Stelle, an der ein BOM oder UTF-16 die Kette bricht, und `:116-118` der Punkt,
an dem es sichtbar wird. Wichtig für die Umsetzung: den Anker `^` und das
`m`-Flag behalten und nur das BOM abschneiden bzw. UTF-16 dekodieren. Wer den
Anker lockert, lässt eine Kommentarzeile als Freigabe gelten — ein neuer
Fehlerpfad, wo einer geschlossen werden sollte.

### B14 — K1: die Namenskollision hat zwei konkrete Fundstellen

`[Fakt]`

Belege: `README.md:33` · `docs/guide/00-START-HIER.md:73-83` ·
`docs/harness/HARNESS-GLOSSARY.md:3`, `:12-14` · Plan `:145-147`

`[Fakt]` „Vier-Ebenen" ist im Repo real belegt — `README.md:33`
(„Vier-Ebenen-Regelhierarchie: Mensch → Modell-Evaluator → deterministische
Gates → Permissions") und `docs/guide/00-START-HIER.md:73-83` (eigene Tabelle
mit vier Ebenen). Beide meinen die Regelhierarchie, nicht die
Haltbarkeitsklassen. `[Fakt]` `HARNESS-GLOSSARY.md:12` hat eine Spalte
„Fundstelle", und `:3` trägt `Stand dieser Fassung: [FÜLLUNG]` — solange dort
kein Datum steht, ist die Datei aus Prüfung 3 heraus.

**Empfehlung.** Der Glossareintrag nennt beide Fundstellen namentlich. Wer den
Eintrag schreibt, setzt gleichzeitig den `Stand dieser Fassung:`-Marker auf
ein echtes Datum — sonst bleibt die Datei unbewacht, und der Katalog-Umzug
(B3) verliert seine einzige verbleibende Begründung.

### B15 — `state/reibung.md` wird im Messfenster nicht durch den Reminder gefunden

`[Fakt]` + `[Schlussfolgerung]`

Belege: `.claude/hooks/session-reminder.js:6`, `:24-33` · Plan `:81`,
`:186-188`

`[Fakt]` `session-reminder.js:6` setzt `INTERVALL = 30`; die Meldung erscheint
erst bei jeder 30. Nachricht. `[Schlussfolgerung]` In einem 60-Minuten-Lauf
einer harnessfremden Person wird die Schwelle voraussichtlich nicht erreicht —
die geplante Reibungs-Zeile im Reminder ist im gemessenen Fenster faktisch
unsichtbar. `[Fakt]` M2-Frage (b) setzt aber voraus, dass die Person die Datei
kennt.

**Empfehlung.** `START-KLEIN.md` muss `state/reibung.md` selbst nennen; die
Reminder-Zeile ist die Langzeitmechanik, nicht der Einstiegspfad. Kein
Blocker — Paket C bleibt wie geplant, nur die Erwartung an den Reminder wird
korrigiert.

---

## Entlastende Befunde

`[Fakt, entlastend]` **Die Ist-Zustands-Tabelle in Abschnitt 1 ist überwiegend
korrekt.** Zeile für Zeile nachgeprüft: `check:template` = drei Skripte
(`package.json:15`) · Prüfung 3 rekursiv über `docs/harness/**` und `state/**`
(`check-docs.mjs:202-205`) · Prüfung 5 nicht rekursiv (`:303-312`) ·
Vertrags-Gate prüft jede `.md` in `state/tasks/` (`check-contract.mjs:31-33`,
`:40-62`) · `session-reminder.js` als `UserPromptSubmit` verkabelt
(`.claude/settings.json:22-27`) · `CLAUDE.md` hat 177 Zeilen ·
`state/triggers.md` ist eine Tabelle mit 7 Zeilen plus `[FÜLLUNG]` · vier
Einstiegspunkte · die zwei Kodierungs-Fehlschläge sind belegt
(`state/gates.md:62-67`). Die einzige Zeile, die nicht trägt, ist die
Beschreibung von Prüfung 1 — siehe B3.

`[Fakt, entlastend]` **Kein Stand-Marker in `state/reibung.md` ist richtig
entschieden.** `check-docs.mjs:215` überspringt jede Datei ohne Marker; mit
Marker würde jeder neue Eintrag mit heutigem Datum Prüfung 3 rot färben. Die
Begründung im Plan ist exakt, inklusive des Hinweises, das als Kommentar in
den Dateikopf zu schreiben.

`[Fakt, entlastend]` **Der Kodierungsfix gehört in den Hook, nicht in
`.gitattributes`.** `.gitattributes:8-12` dokumentiert, dass
`working-tree-encoding=UTF-8` bereits versucht und als wirkungslos verworfen
wurde (V1.5). Zusätzlich ist `state/freigabe-commit.md` per `.gitignore:25-28`
nie getrackt, `.gitattributes` greift dort ohnehin nicht.

`[Fakt, entlastend]` **Die Skelett-/Füllung-Begründung für die drei Werkzeuge
trägt.** Das Repo hat für namentliche Werkzeuge bereits eine Heimat
(`state/tooling.md:16-18`) und für projektspezifische Trigger eine
`[FÜLLUNG]`-Zeile (`state/triggers.md:21`); `README.md:88-92` formuliert die
Quellenregel, die genau das verlangt. Das Kriterium ist im Register mit drei
benannten Merkmalen operationalisiert, die der Plan vollständig übernimmt.
Kleine Ergänzung: Die drei Namen als ausdrücklich markiertes **Beispiel** in
Klammern hinter das Kriterium setzen — das ist exakt die K3-Mechanik, und die
Information geht dann nicht verloren.

`[Fakt, entlastend]` **Der Kalt-Lauf ist richtig eingeordnet.** Der Plan
benennt ausdrücklich, dass ein Modelllauf das Tor nicht misst, mit tragender
Begründung. `[Schlussfolgerung]` Das ist die stärkste Stelle des Plans — sie
nimmt die naheliegendste Selbsttäuschung des Verfahrens vorweg.

`[Fakt, entlastend]` **Das Interventionsprotokoll ist richtig gedreht:** jede
Intervention zählt gegen `START-KLEIN.md`, nicht gegen die Person. Ablage
ungetrackt unter `programm/`, gedeckt durch `.gitignore:34-38`.

`[Fakt, entlastend]` **Paket G gehört nicht in `state/gates.md`.**
`state/gates.md:4-7` definiert Gates als objektiv und kalibrierbar; eine
einmalige Menschenmessung erfüllt das nicht.
`docs/harness/HARNESS-LEARNING-STATE.md` ist laut `state/memory-map.md:19` die
richtige Heimat.

`[Fakt, entlastend]` **Vertrag 5 hat ein echtes, selbstprüfendes Artefakt.**
„Verweise aus dem Skill lösen auf" ist exakt das, was Prüfung 1 über
`sammleSkillDateien` (`check-docs.mjs:36-42`, `:53`) automatisch prüft.

`[Fakt, entlastend]` **Die Scope-Erweiterung B2 ist sauber begründet:** zwei
belegte Vorfälle, Eingriff in ein bestehendes Gate statt neuer Regel, und die
Feststellung, dass die Beförderungsregel „dreimal → Regel" hier nicht der
Maßstab ist. Diese Regel gilt für neue Regeln in `check-rules.mjs`, nicht für
Fehlerbehebungen an bestehender Mechanik.

`[Fakt, entlastend]` **Der Plan besteht die eigene Prüfkette.** Ein
Stand-Marker, kein jüngeres Datum, alle Hedging-Stellen mit Evidenz-Marker.

---

## Urteil

**Nicht freigegeben.**

Begründung, nach Schwere sortiert:

1. **Das Tor ist nach diesem Plan nicht bestehbar, aus zwei belegten Gründen
   im selben Meilenstein.** M4 verlangt zwei Freigabe-Vorgänge statt einem,
   und der Push-Pfad ist nirgends kalibriert (B1). Die wahrscheinlichere
   Bruchstelle ist nicht die Kodierung, sondern Zeitzone und Format der
   Freigabe-Zeile — und genau die fasst das dafür eingerichtete Paket B2 nicht
   an (B2). Ein Baudurchgang nach Plan würde die Messung durchführen und am
   zweiten von zwei erlaubten Versuchen an einem Fehler scheitern, der vor der
   Messung bekannt war.
2. **Der zentrale Beleg im Fokus-Punkt 4 stimmt nicht.** Prüfung 1 erfasst den
   Katalog an beiden Pfaden gleichermaßen, Prüfung 3 hat am leeren Katalog
   keinen Zahn (B3). Die Entscheidung bleibt richtig, die Begründung nicht —
   und ein Plan, dessen Verfahren auf Belegen beruht, darf sich an seiner
   eigenen Kernstelle nicht auf einen Beleg stützen, der die Aussage nicht
   trägt.
3. **Paket D ist in Phase 2 nicht zu rechtfertigen** — außerhalb des
   Register-Fensters, in der einzigen vom Doku-Gate nicht erfassten
   Dateiendung, ohne memory-map-Zeile, zwei Einstiegsdokumente still falsch
   machend, und in der YAML-Variante mit der ersten Laufzeitabhängigkeit des
   Templates mitten im gemessenen Pfad (B4). Offener Punkt 2 ist damit keine
   Trägerfrage, sondern eine Streichfrage.
4. **Zwei Lücken, die nach dem Bau teuer werden:** `START-KLEIN.md` trägt das
   ganze Tor und liegt außerhalb jedes Gates, obwohl die Behebung eine Zeile
   kostet (B5); und 3b/Node-Bindung ist zwischen Phase 1 und Phase 2
   verschwunden, obwohl Phase 1 es ausdrücklich hierher vertagt hat (B9).
5. **Fokus-Punkt 6 ist unbearbeitet** — der Plan verweist auf zwei Vorschläge,
   die er nicht macht (B10).

Nicht „Blockiert": Der Plan ist beurteilbar, die Richtung stimmt, und in der
Kalt-Lauf-Einordnung, in Abschnitt 5 und in der Ehrlichkeit über den fehlenden
Zahn steckt Arbeit, die trägt. Nicht „mit Hinweisen": B1, B2 und B4 sind keine
Feinjustierungen, sondern drei Stellen, an denen ein Baudurchgang nach Plan an
einer Wand endet statt an einem Ergebnis.

## Nächster sinnvoller Schritt

Die drei Fokus-Punkte mit dem Menschen entscheiden, in dieser Reihenfolge:

1. **Offener Punkt 2 → Empfehlung: Paket D streichen.** Fällt die Entscheidung
   anders: JSON, kein YAML, kein Mini-Parser, plus memory-map-Zeile plus
   Nachziehen von `CLAUDE.md:36-39` und `README.md:42-50`.
2. **Offener Punkt 4 → Pfad `docs/harness/werkzeug-katalog.md` übernehmen,
   Begründung austauschen**, und festhalten, dass K4 in Phase 2 unbezahnt
   bleibt und mit N7 in Phase 3 scharf gestellt wird.
3. **Offener Punkt 6 → Abbruchbedingung schriftlich setzen**, nach den drei
   Bestandteilen aus B10, **bevor** der Kalt-Lauf startet.

Danach Plan v2 mit vier strukturellen Änderungen: B2 wird ein eigener Vertrag
und rückt an den Anfang (er trägt B1 und B2 zusammen: Push-Fall, Zeitzone,
BOM/UTF-16, plus die drei Prüfpunkte aus B13) · `START-KLEIN.md` kommt in
`check-docs.mjs:44-59` und liefert Vertrag 8 sein hartes Artefakt · 3b wird
benannt, aufgenommen oder ausdrücklich weitervertagt · das Kontextbudget wird
neu zusammengesetzt (B6).

Erst dann der Kalt-Lauf. Die menschliche Messung ist der einmalig
verbrauchbare Teil — jeder Punkt, der vorher nicht geklärt ist, verbrennt sie.
