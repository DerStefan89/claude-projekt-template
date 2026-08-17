<!--
Stand dieser Fassung: 17.08.2026
Phase-0-Artefakt (P2) aus dem Harness-Fix-Programm. Rein diagnostisch:
Diese Datei repariert nichts, sie stellt fest.

Erhebungsgrundlage: Arbeitskopie claude-projekt-template, Branch
regel/zielverzeichnis, HEAD 7ad0086, Arbeitsbaum sauber.

Evidenz-Marker: [Fakt] belegt · [Schlussfolgerung] abgeleitet ·
[Annahme] ungeprüft · [offene Unsicherheit] ungeklärt.
-->

# Zähne-Taxonomie — Bestandsaufnahme aller Regeln

## Wozu diese Datei

Jede Regel des Harness wird einer von vier Kategorien zugeordnet. Die Frage
ist nicht, ob eine Regel gut ist, sondern **was passiert, wenn sich jemand
nicht daran hält**.

| Kategorie | Definition | Was bei Verstoß passiert |
|---|---|---|
| **HOOK** | Greift am Ort der Handlung, bevor sie stattfindet. Weder Mensch noch Modell kann sie im laufenden Betrieb umgehen, ohne die Mechanik selbst anzufassen | Die Handlung findet nicht statt |
| **GATE** | Deterministische Prüfung mit Exit-Code an einem Kontrollpunkt | Der Durchlauf wird rot; die Handlung war schon passiert |
| **GATE (leer)** | Die Mechanik existiert, der Inhalt fehlt. Läuft grün, weil sie nichts prüft | Nichts. Sieht aber aus wie ein GATE |
| **SELBSTAUSKUNFT** | Steht als Text da. Einhaltung hängt davon ab, dass Mensch oder Modell sie liest, erinnert und meldet | Nichts, außer jemand merkt es |

Die vierte Kategorie steht nicht im Register, ist aber beim Erheben
unvermeidlich geworden: `[Schlussfolgerung]` Eine leere Mechanik ist etwas
anderes als reiner Text. Sie kostet weniger, sie zu füllen (Inhalt
eintragen), als eine Selbstauskunft zu bewehren (Mechanik erst bauen). Wer
beides in einen Topf wirft, überschätzt die Restarbeit.

---

## Teil 1 — HOOK (greift am Ort der Handlung)

| # | Regel | Träger | Einschränkung |
|---|---|---|---|
| H1 | Schreibzugriff auf geteilte `.claude/settings.json` wird verweigert | `.claude/hooks/guard-settings.js`, PreToolUse `Edit\|Write` | `[Fakt]` Matcher erfasst nur `Edit` und `Write`. Ein Schreibvorgang über Bash (`echo > ...`, `sed -i`) läuft daran vorbei. Die Grenze ist nirgends dokumentiert — Befund V1.6 |
| H2 | Prüfrollen haben keine Schreibrechte | `tools: Read, Grep, Glob` im Frontmatter der drei Agent-Dateien | `[Fakt]` Von der Plattform durchgesetzt, nicht vom Text. Der einzige Zahn im Harness, der ohne eigene Zeile Code auskommt |
| H3 | Manuelle Compaction wird blockiert, wenn der Zwischenstand fehlt oder älter als sechzig Minuten ist | `.claude/hooks/zwischenstand-pruefen.js`, PreCompact, `decision: "block"` | `[Fakt]` Nur bei `trigger === "manual"`. Bei automatischer Compaction nur `systemMessage` — also Selbstauskunft im entscheidenden Moment |
| H4 | Zwischenstand wird beim Sitzungsstart automatisch geladen | `.claude/hooks/zwischenstand-laden.js`, SessionStart | `[Fakt]` Matcher `startup\|resume\|compact\|fork` — `clear` fehlt. Nach `/clear` lädt nichts. Befund V1.1 |
| H5 | Nur `Bash(npm run *)` ist ohne Rückfrage erlaubt | `permissions.allow` in `.claude/settings.json` | `[Fakt]` Wirkt als Untergrenze. `[offene Unsicherheit]` Was eine projektlokale `settings.local.json` daraus macht, ist pro Maschine verschieden und im Repo nicht sichtbar — genau der Weg, über den Befund N1(b) entstanden ist |
| H6 | Erinnerung an Kontext-Hygiene alle dreißig Nachrichten | `.claude/hooks/session-reminder.js`, UserPromptSubmit | `[Schlussfolgerung]` Der Hook feuert zuverlässig, aber sein Ergebnis ist ein Hinweistext. Mechanisch ein HOOK, in der Wirkung eine Selbstauskunft mit Wecker |

**Sechs Einträge. Zwei davon (H4, H6) erzeugen am Ende nur Text; einer (H1)
hat ein belegtes Loch; einer (H3) schaltet sich im häufigeren der beiden
Fälle selbst ab.**

---

## Teil 2 — GATE (prüft deterministisch, Exit-Code)

| # | Regel | Träger | Kalibriert? |
|---|---|---|---|
| G1 | Kein Pfad-Verweis in Anweisungsdokumenten zeigt ins Leere | `check-docs.mjs`, Prüfung 1 | `[Fakt]` Ja, Rot- und Grün-Fall in `state/gates.md` dokumentiert. Bekannte Einschränkung der `.gitignore`-Auswertung ist im Kalibrierungs-Log vermerkt |
| G2 | Versionsnummern stehen nur in der Paketdatei | `check-docs.mjs`, Prüfung 2 | `[Fakt]` Ja, Rot- und Grün-Fall dokumentiert |
| G3 | Kein Datum im Text ist neuer als der `Stand dieser Fassung:`-Marker derselben Datei | `check-docs.mjs`, Prüfung 3 | `[Fakt]` Nein. Kein Rot-Fall dokumentiert |
| G4 | CI läuft `npm run check` auf frischer Maschine | `.github/workflows/ci.yml`, Job `check` | `[Fakt]` Nein — beide Spalten in `state/gates.md` stehen auf `[FÜLLUNG]`. Befund N3 |
| G5 | Secret-Scan vor dem Merge | `ci.yml`, gitleaks im Container | `[Fakt]` Nein. Zusätzlich: unfixiertes Image-Tag (V2.2) und `--no-git`, wodurch die Historie ungescannt bleibt — womit der Scan die eigene Begründung im Guide verfehlt (N2) |
| G6 | Kein Merge auf `main` ohne grünen Status-Check | Branch Protection, GitHub-Einstellung | `[Fakt]` Nein, beide Spalten `[FÜLLUNG]`. `[offene Unsicherheit]` Kein Datei-Artefakt im Repo — ob die Einstellung überhaupt gesetzt ist, ist aus dem Repo heraus nicht feststellbar |
| G7 | Lint läuft nach jedem `Edit`/`Write` | `.claude/settings.json`, PostToolUse | `[Fakt]` Ruft `npm run lint` auf — siehe L1. Der Aufruf ist echt, das Ziel ist leer |

**Sieben Einträge, davon zwei kalibriert.** `[Schlussfolgerung]` Nach der
eigenen Regel aus `state/gates.md` („Ohne Kalibrierung ist ein Gate ein
ungeprüftes Versprechen") zählen fünf dieser sieben derzeit nicht als
gesichert.

---

## Teil 3 — GATE (leer): Mechanik vorhanden, Inhalt fehlt

| # | Regel, die es sein sollte | Träger | Warum sie heute nichts tut |
|---|---|---|---|
| L1 | Linter läuft | `package.json` → `lint` | `[Fakt]` `echo '[FÜLLUNG] …'` → Exit 0 |
| L2 | Typprüfung, kein `any` | `package.json` → `typecheck` | `[Fakt]` `echo` → Exit 0. Dieselbe Zeile steht als Pflicht in der Definition of Done |
| L3 | Tests laufen | `package.json` → `test` | `[Fakt]` `echo` → Exit 0 |
| L4 | Architektur-Regeln über AST | `scripts/check-rules.mjs` | `[Fakt]` `const regeln = []`; das Skript beendet sich mit Exit 0 und einem Hinweis. Absicht laut Kommentar (Beförderungsregel: dreimal derselbe Fehler) |
| L5 | Dokumentenpaare ziehen ihren Marker nach | `check-docs.mjs`, Prüfung 4 | `[Fakt]` `dokumentPaare` ist leer. Das vorgesehene Paar (Changelog ↔ Learning-State) ist auskommentiert — Befund N12 |
| L6 | Hedging ohne Evidenz-Marker wird gemeldet | `check-docs.mjs`, Prüfung 5 | `[Fakt]` Läuft, aber der Geltungsbereich sind ausschließlich direkte Kinder von `state/` mit `advisor-findings-` oder `review` im Namen. Solche Dateien existieren im Repo derzeit nicht. Zusätzlich ist die Wortliste deutschsprachig fest verdrahtet — Befund N6 |
| L7 | Verbotene Patterns | `ARCHITECTURE.md` §7 | `[Fakt]` Tabelle enthält eine `[FÜLLUNG]`-Zeile |

**Sieben Einträge.** `[Schlussfolgerung]` Die Kette `npm run check` besteht
aus fünf Gliedern; drei davon (L1, L2, L3) sind `echo`, eines (L4) ist per
Absicht leer. Ein grüner Durchlauf belegt heute ausschließlich, dass die
beiden kalibrierten Doku-Prüfungen G1 und G2 nichts gefunden haben. Das ist
Befund V3.1, hier von der anderen Seite bestätigt.

---

## Teil 4 — SELBSTAUSKUNFT

Sortiert nach Fundort. `[Fakt]` Für jede dieser Zeilen gilt: Es existiert
kein Mechanismus, der einen Verstoß bemerkt.

### Aus `CLAUDE.md`

| # | Regel | Anmerkung |
|---|---|---|
| S1 | `ARCHITECTURE.md` vor dem Schreiben von Code lesen | Pflichtlektüre ohne Nachweis |
| S2 | Briefing in sechs Punkten vor jeder Aufgabe | |
| S3 | Iterationen klein, prüfbar, abgeschlossen | |
| S4 | Ein Task pro Arbeitsverzeichnis, ein Schreiber pro Worktree | |
| S5 | Ein Zielverzeichnis pro Auftrag; jeder Befehlsblock beginnt mit `cd` auf den vollen Pfad | Jüngste Regel im Repo (HEAD-Commit). `[Schlussfolgerung]` Sie beschreibt einen realen Vorfall und ist trotzdem als Text angelegt |
| S6 | Iterationsende: Status prüfen, Freigabe, committen **und** pushen | |
| S7 | Zuschnitt-Heuristik für Handoff-Verträge | |
| S8 | DoD: Module wiederverwendbar | |
| S9 | DoD: typisiert, kein Escape-Hatch | Wäre G/L2, wenn `typecheck` gefüllt wäre |
| S10 | DoD: Fehlerzustände mit catch und Logging | |
| S11 | DoD: leere Zustände berücksichtigt | |
| S12 | DoD: drei UI-Regeln (lange Texte, Mobil, Design-Treue) | Nur in UI-Projekten |
| S13 | DoD: Kommentar-Standard eingehalten | |
| S14 | **DoD: keine Commits ohne explizite Freigabe** | Befund N1. Drei belegte Vorfälle. Einzige DoD-Zeile ohne Gate |
| S15 | Vorhandene Helper prüfen, bevor neue geschrieben werden | |
| S16 | Entscheidungsregel bei Unsicherheit, fünf Stufen | |
| S17 | Jede Ausgabe endet mit dem Status-Block | |
| S18 | Vier bekannte Fallen beachten (Reparse-Points, Zeilenenden, Flatter-Fehlschlag) | `[Schlussfolgerung]` Zwei davon sind maschinell prüfbar und stehen trotzdem als Prosa da |
| S19 | `CLAUDE.md` bleibt unter zweihundert Zeilen | Befund N8. `[Fakt]` Steht nicht einmal in der Datei selbst, sondern nur im Onboarding-Chat |

### Aus `state/triggers.md`

| # | Trigger | Anmerkung |
|---|---|---|
| S20 | Neues Werkzeug → `werkzeug-auswahl` zuerst | |
| S21 | Architekturentscheidung mit Alternativen → ADR anlegen | |
| S22 | Architekturentscheidung mit Nebenwirkungen → Advisor-Pass | |
| S23 | UI-Aufgabe fertig → `code-reviewer`, ggf. `design-guardian` | |
| S24 | Vor „fertig" → `qa`-Agent | |
| S25 | Zyklus-Ende → Learning-State und Changelog nachtragen | Wäre L5, wenn das Dokumentenpaar eingetragen wäre |
| S26 | Sitzungsunterbrechung → Zwischenstand schreiben | H3 fängt davon nur den Compaction-Fall, und nur den manuellen |

`[Fakt]` Die Datei sagt über sich selbst, ein Trigger sei per Definition
nicht rein syntaktisch prüfbar. `[Schlussfolgerung]` Das stimmt für die
Bedingung, nicht durchgängig für die Handlung: Ob ein Advisor-Pass
stattgefunden hat, ist an der Existenz von `state/plan-v1-<slug>.md`
ablesbar. Die Kategorie „nicht prüfbar" ist damit kleiner, als die Datei
annimmt.

### Aus den Skills

| # | Regel | Skill |
|---|---|---|
| S27 | Entscheidung über einen Advisor-Pass wird ausgesprochen, auch das Nein | `advisor-pass` |
| S28 | Plan v1 als Datei, nicht ins Fenster | `advisor-pass` |
| S29 | Advisor läuft in frischem Kontext | `advisor-pass` |
| S30 | `git add` nur der besprochenen Dateien, nie `git add .` | `git-flow` |
| S31 | `git diff --staged` vollständig zeigen, Freigabe abwarten | `git-flow`. Gegenstück zu S14 |
| S32 | Der Freigabe-Halt steht als letzter Satz, nie in der Mitte | `git-flow`. `[Fakt]` Mit einem ungewollten Commit bezahlt |
| S33 | Niemals selbst mergen | `git-flow` |
| S34 | Vertrag beginnt wörtlich mit SCHRITT 0 | `handoff-vertrag`. Befund N13: deterministisch prüfbar |
| S35 | Sieben Sektionen im Vertrag | `handoff-vertrag`. Befund N13 |
| S36 | Ist-Zustand lesen statt annehmen | `handoff-vertrag`, `spec-schreiben` |
| S37 | V-Aussagen müssen als Test formulierbar sein | `spec-schreiben`. Befund R4: niemand prüft, ob aus V3 je ein Test wurde |
| S38 | Nicht-Ziele sind Pflichtsektion | `spec-schreiben` |
| S39 | Acht Schritte der Werkzeugprüfung, Entscheidung auch bei Ablehnung schreiben | `werkzeug-auswahl` |
| S40 | Bericht statt Reparatur | `repo-audit` |

### Aus den übrigen Zustandsdateien

| # | Regel | Fundort |
|---|---|---|
| S41 | Jedes Gate braucht einen bekannten Rot- und einen Grün-Fall | `state/gates.md`. `[Schlussfolgerung]` Die Kalibrierungspflicht ist selbst unbewehrt — deshalb stehen fünf von sieben Gates auf `[FÜLLUNG]` |
| S42 | Jeder Fakt hat genau eine Heimat („nicht hierhin"-Spalte) | `state/memory-map.md` |
| S43 | Jede Annahme wird eingetragen und aufgelöst | `state/assumption-ledger.md` |
| S44 | Werkzeugentscheidungen werden festgehalten, auch die negativen | `state/tooling.md` |
| S45 | Zwischenstand bleibt unter zehntausend Zeichen | `VORLAGE.md`. `[Fakt]` Der Ladeweg kürzt bei neunfünfhundert — Befund V1.3 |
| S46 | Beförderungsregel: dreimal derselbe Fehler wird zur Regel | `check-rules.mjs`, Kopfkommentar. `[Schlussfolgerung]` Ohne Findings-Ablage für zwei der drei Prüfrollen ist „dreimal" nicht zählbar — Befund N14 |
| S47 | Alle `[FÜLLUNG]`- und `[PROJEKTNAME]`-Marker sind nach dem Bootstrap ersetzt | Überall. Befund N7. `[Fakt]` Keine Prüfung, obwohl `SETUP.md` genau diese Fehlerklasse beschreibt |
| S48 | ARCHITECTURE.md ist Pflichtlektüre vor jedem Commit | `ARCHITECTURE.md`, Kopfzeile. Dublette zu S1, andere Auslösebedingung |

---

## Teil 5 — Das Ergebnis

| Kategorie | Anzahl | Anteil |
|---|---|---|
| HOOK | 6 | 9 % |
| GATE (kalibriert) | 2 | 3 % |
| GATE (unkalibriert) | 5 | 7 % |
| GATE (leer) | 7 | 10 % |
| SELBSTAUSKUNFT | 48 | 71 % |
| **Summe** | **68** | |

`[Fakt]` Von achtundsechzig erhobenen Regeln greifen heute acht ohne
Mitwirkung dessen, der sie einhalten soll — sechs Hooks und zwei kalibrierte
Gates. Das sind zwölf Prozent.

`[Schlussfolgerung]` Drei Beobachtungen, die aus der Sortierung folgen und
nicht schon im Register standen:

1. **Die Zähne sitzen nicht dort, wo die belegten Vorfälle sind.** Alle drei
   dokumentierten Vorfälle betreffen ungefragtes Committen (S14/S31/S32) —
   also drei Selbstauskünfte. Die sechs vorhandenen Hooks bewachen
   Zwischenstand, Kontextlänge und eine Konfigurationsdatei. Keiner von
   ihnen bewacht die Handlung, die nachweislich schiefgegangen ist.

2. **Die Kalibrierungspflicht ist selbst eine Selbstauskunft (S41).** Das
   erklärt N3 vollständig: Nicht Nachlässigkeit hat die `[FÜLLUNG]`-Zellen
   stehen lassen, sondern das Fehlen eines Mechanismus, der ihr
   Stehenbleiben bemerkt. `[Schlussfolgerung]` Solange das so bleibt, wird
   jedes neue Gate mit derselben Wahrscheinlichkeit unkalibriert bleiben —
   auch die aus Phase 1.

3. **„Nicht prüfbar" ist im Bestand großzügiger ausgelegt als nötig.**
   Mindestens neun Selbstauskünfte sind per Exit-Code entscheidbar, ohne
   dass ein Modell befragt werden muss: S14 (Commit ohne Freigabe → Hook),
   S19 (Zeilen zählen), S25 (Dokumentenpaar), S28 (Datei existiert),
   S34/S35 (Vertragsstruktur), S37 (Testpfad in der OUTPUT-Sektion),
   S45 (Zeichen zählen), S47 (Marker suchen). Das ist genau die Regel aus
   N13b, angewandt auf den eigenen Bestand: *Alles, was per Exit-Code
   entscheidbar ist, wird ein Skript im Harness.*

`[offene Unsicherheit]` Nicht erhoben ist, welche der achtundvierzig
Selbstauskünfte im Alltag tatsächlich befolgt werden. Die Taxonomie sagt,
was passiert, wenn jemand sie bricht — nicht, wie oft das geschieht. Diese
Zahl liefert erst die Basislinie (P1) zusammen mit der Reibungserfassung
(N9); sie ist der Grund, warum beide vor dem Start stehen und nicht danach.

---

## Anhang — was diese Datei nicht ist

Kein Plan, keine Priorisierung, keine Empfehlung, welche Regel als nächstes
Zähne bekommt. Die Reihenfolge steht in Teil B des Befundregisters. Diese
Datei liefert nur den Ist-Stand, gegen den sich der Fortschritt der Phasen 1
bis 3 später messen lässt — dieselbe Erhebung nach Phase 3 wiederholt,
ergibt die einzige belastbare Aussage darüber, ob das Fix-Programm gewirkt
hat.
