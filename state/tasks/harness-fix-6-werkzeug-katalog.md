SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `8d89041`
(Vertrag 5, Commit-Guard härten) in `main` enthalten ist
(`git merge-base --is-ancestor 8d89041 HEAD`). Fehlt er, anhalten und
melden — nicht raten, ob der Merge stattgefunden hat. Danach
`npm run check:template` laufen lassen und den Ausgangsstand protokollieren
(erwartet: Exit 0).

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-6-werkzeug-katalog

GOAL:
Die Mechanik des Werkzeug-Katalogs liegt als Skelett im Template, bereinigt
um die fünf Befunde K1–K5/K9, und der Skill `werkzeug-auswahl` schlägt vor
jeder vollen Prüfprozedur zuerst dort nach. Prüfbar an:
`docs/harness/werkzeug-katalog.md` existiert mit Legende, Eintragsformat,
Quellenregel, Mechanik „Bewusst nicht aufgenommen" und benannten Leerstellen,
ohne einen einzigen Eintrag und ohne toten Verweis · `werkzeug-auswahl`
Schritt 2 ist in 2a/2b/2c geteilt und verweist auf die Katalogdatei, was
Prüfung 1 maschinell nachweist · `HARNESS-GLOSSARY.md` löst die
Namenskollision auf und trägt einen echten `Stand dieser Fassung:`-Marker ·
`state/memory-map.md` trennt Katalog, `state/tooling.md` und `docs/adr/` ·
`state/triggers.md` hat zwei neue Zeilen · `npm run check:template` → Exit 0.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase2-adoptionsfaehigkeit.md`, Paket B und
  Vertrag 6. Befunde: `state/advisor-findings-phase2-adoptionsfaehigkeit.md`,
  insbesondere B3 (Pfadentscheidung und ihre Begründung) und B14 (K1 hat zwei
  konkrete Fundstellen).
- [Fakt] Quelle des Katalogs ist `WERKZEUG-KATALOG.md` aus dem Playbook-Repo,
  Stand 07.08.2026, 19 Einträge in drei Kategorien plus sieben begründete
  Ausschlüsse. Sie liegt im Claude-Projekt „Harness-Projekt", nicht in
  diesem Repo. [Fakt] Das Befundregister spricht von 18 Einträgen, die
  Quelldatei enthält 19 — die Abweichung ist notiert, für diesen Vertrag
  ohne Belang, weil **keine** Einträge übertragen werden.
- [Fakt] Die Quelldatei trägt drei Mängel, die nicht mit übertragen werden
  dürfen: sie verweist in der Legende auf `00-MASTER-BRIEFING.md,
  Abschnitt 2` (existiert hier nicht, K2) · sie nennt das Ponytail-Muster
  „in `toolkompass`" statt im eigenen Repo (Projektbezug in einem als
  projektübergreifend deklarierten Dokument, K3) · sie nennt die
  Haltbarkeitsstufen „Vier-Ebenen-Regel", was mit der
  Vier-Ebenen-Regelhierarchie des Harness kollidiert (K1).
- [Fakt] Die Kollision aus K1 ist im Repo an zwei Stellen real belegt:
  `README.md:33` („Vier-Ebenen-Regelhierarchie: Mensch → Modell-Evaluator →
  deterministische Gates → Permissions") und
  `docs/guide/00-START-HIER.md:73-83` (eigene Vier-Ebenen-Tabelle). Beide
  meinen die Regelhierarchie, nicht die Haltbarkeit.
- [Fakt] `docs/harness/HARNESS-GLOSSARY.md:3` trägt
  `Stand dieser Fassung: [FÜLLUNG]`. Solange dort kein echtes Datum steht,
  überspringt Prüfung 3 die Datei vollständig (`check-docs.mjs:179`, `:215`).
- [Fakt] Pfadentscheidung aus Plan v2: `docs/harness/werkzeug-katalog.md`,
  nicht `docs/werkzeug-katalog.md` wie im Register. [Schlussfolgerung] Die
  Begründung ist **nicht** „damit steht er unter Gate-Abdeckung" — das wäre
  falsch: Prüfung 1 prüft Verweise, nicht Zieldateien, und erfasst ihn an
  beiden Pfaden gleichermaßen, sobald ein Anweisungsdokument auf ihn
  verweist. Die tragenden Gründe sind Nachbarschaft zu den übrigen
  Harness-Dokumenten und die künftige Wirksamkeit von Prüfung 3, sobald
  Phase 3 Einträge mit Prüfdaten nachliefert.
- [Fakt] Die einzige Gate-Abdeckung, die der Katalog in Phase 2 tatsächlich
  hat, ist der Verweis aus `.claude/skills/werkzeug-auswahl/SKILL.md` über
  Prüfung 1 (`check-docs.mjs:36-42`, `:104-128`). Deshalb ist dieser Verweis
  Pflicht, nicht Kür.
- [Fakt] K4 („Stand-Marker in den Kopf") bekommt in Phase 2 **keinen Zahn**.
  Ein Marker-Pflicht-Check existiert nicht und kommt mit N7 (Platzhalter-
  Check) in Phase 3. Das steht hier, damit es niemand als erledigt verbucht.
- [Fakt] `state/tooling.md` listet unter „Im Einsatz" nur gitleaks. Das
  Template führt aber eine vendorte Fremd-Datei mit sich:
  `.claude/skills/ponytail/` (SKILL.md plus LICENSE, Versionspin `v4.8.4` im
  Dateikopf). [Schlussfolgerung] Das Template verletzt damit seine eigene
  Regel aus `SETUP.md` Punkt 3 („Ergebnis — auch das negative — nach
  `state/tooling.md`"). Wird in diesem Vertrag mitgeschlossen, weil er die
  Zuständigkeit von `state/tooling.md` ohnehin in der memory-map festschreibt
  — benannte Erweiterung gegenüber dem Register, keine stille.

SCOPE:

1. **`docs/harness/werkzeug-katalog.md` anlegen (neu)** mit exakt diesem
   Inhalt. Das `<HEUTIGES DATUM>` im Kopf durch das reale Baudatum im Format
   `TT.MM.JJJJ` ersetzen; sonst nichts ändern, nichts ergänzen, nichts
   weglassen:

```
<!--
Ziel-Pfad im Repo: docs/harness/werkzeug-katalog.md
Stand dieser Fassung: <HEUTIGES DATUM>
Erstlektüre: nein — Nachschlagewerk, kein Teil des Einstiegs.
-->
# Werkzeug-Katalog

Skelett, projektübergreifend. Beantwortet: *was gibt es und wann lohnt es
sich.* Die Frage *was läuft in diesem Projekt* beantwortet
`state/tooling.md` — nicht hier. Die Frage *warum diese Stack-Entscheidung*
beantwortet `docs/adr/` — auch nicht hier.

Aufnahme in den Katalog ist keine Empfehlung zur Installation. Die
Entscheidung fällt pro Projekt nach der Auswahlprozedur, Skill
`werkzeug-auswahl` — Bedarf zuerst.

**Kein Eintrag der Haltbarkeitsklasse C ist installationsbereit, solange
sein Versionspin offen ist.** Das gilt für jeden Eintrag, nicht nur für
den, bei dem es zufällig auffällt.

## Legende

**Haltbarkeitsklassen** — wie lange ein Eintrag voraussichtlich gilt:

| Klasse | Was | Haltbarkeit |
|---|---|---|
| A | Konzepte und Verfahren | Jahre |
| B | Erstanbieter-Features | Monate bis Jahre |
| C | Community-Werkzeuge | Wochen bis Monate, austauschbar, Vetting-Pflicht |
| D | Schlagworte | verifizieren oder verwerfen |

Nicht zu verwechseln mit der Vier-Ebenen-Regelhierarchie des Harness
(Mensch, Modell-Evaluator, deterministische Gates, Berechtigungen). Beide
Begriffe kursieren nebeneinander — siehe
`docs/harness/HARNESS-GLOSSARY.md`.

**Vetting-Status:** ungeprüft · recherchiert (Herkunft belegt, nicht
benutzt) · erprobt (real eingesetzt und beobachtet).

**Klasse C zwingend zusätzlich:** Herkunft als Repo-URL und Versionspin.
Muster in diesem Repo: `.claude/skills/ponytail/` — nur die SKILL.md
kopiert, Version im Dateikopf notiert, Lizenz danebengelegt, kein
ausführbarer Code übernommen.

## Eintragsformat

### <Name>
- **Haltbarkeitsklasse:**
- **Zweck:**
- **Herkunft:**
- **Vetting-Status:**
- **Prüfdatum:**
- **Lohnt sich:**
- **Ausdrücklich nicht, wenn:**
- **Token-/Kostenwirkung:**
- **Risiko-Hinweis:**

Das Prüfdatum ist das Datum der letzten Herkunftsprüfung, nicht das der
Aufnahme. Ohne Prüfdatum lässt sich nicht entscheiden, ob ein Eintrag der
Klasse C noch gilt.

## Quellenregel

Rund um Agenten-Werkzeuge existiert ein Schwarm von Verzeichnis-Websites,
die voneinander abschreiben und teils unglaubwürdige Kennzahlen führen. Für
den Herkunfts-Check zählt ausschließlich das Quell-Repo, nie ein
Verzeichnis-Eintrag.

## Bewusst nicht aufgenommen

Geprüfte und verworfene Werkzeuge stehen mit Begründung und Prüfdatum in
einem eigenen Abschnitt — damit dieselbe Prüfung nicht in einem halben Jahr
von vorn beginnt. Ein begründeter Ausschluss ist genauso viel wert wie ein
Eintrag.

## Einträge

[FÜLLUNG] Die Einträge liegen nicht hier, sondern zentral im Lern-Repo —
eine Quelle für alle Projekte, die an einer Stelle altert statt in jedem
Klon. In diesem Repo steht nur die Mechanik.

## Benannte Leerstellen

Eine benannte Leerstelle ist ein Befund, eine unbenannte ist ein Irrtum.
Der Katalog stammt aus einem Web- und Agentenprojekt und deckt derzeit nur
diese Sorte Werkzeug ab. Nicht abgedeckt:

- **Web3** — Test- und Analysewerkzeuge für Smart Contracts,
  Gas-Regression, Testnetz-Zwang.
- **Video** — Medienprüfung, Asset- und Lizenzmanifest, Shot-Protokoll.
- **Data/ML** — Seed-Festlegung, Prüfung auf Datenleckage.
- **Skill-Sorte „Handwerk"** — alle vorhandenen Skills sind Verfahren, also
  Regeln dafür, *wie* gearbeitet wird. Die zweite Sorte — recherchieren,
  schreiben, schneiden — fehlt, weil das Harness aus einem Softwareprojekt
  stammt.
```

2. **`docs/harness/HARNESS-GLOSSARY.md`** — zwei Zeilen in die Tabelle, und
   `Stand dieser Fassung: [FÜLLUNG]` in Zeile 3 durch das reale Baudatum
   ersetzen.
   - `Haltbarkeitsklassen A–D` · Bedeutung: wie lange ein Eintrag im
     Werkzeug-Katalog voraussichtlich gilt · Warum relevant: hieß früher
     „Vier-Ebenen-Regel", der alte Name kursiert noch und kollidiert mit der
     Regelhierarchie · Fundstelle: `docs/harness/werkzeug-katalog.md`.
   - `Vier-Ebenen-Regelhierarchie` · Bedeutung: Mensch → Modell-Evaluator →
     deterministische Gates → Berechtigungen · Warum relevant: gleiche
     Zahl, anderer Gegenstand als die Haltbarkeitsklassen · Fundstelle:
     `README.md` und `docs/guide/00-START-HIER.md`.
   Die `[FÜLLUNG]`-Beispielzeile der Tabelle bleibt stehen.

3. **`.claude/skills/werkzeug-auswahl/SKILL.md`** — Schritt 2 („Prüfen, ob
   es das schon gibt") in drei Teilschritte gliedern, Wortlaut sinngemäß:
   - `2a.` Vorhandene Skills, Subagenten, Slash-Kommandos und selbst gebaute
     Mechanik zuerst durchsehen.
   - `2b.` `state/tooling.md` — wurde das in DIESEM Projekt schon
     entschieden, auch negativ?
   - `2c.` `docs/harness/werkzeug-katalog.md` — wurde das in einem ANDEREN
     Projekt schon geprüft? Eintrag vorhanden: Herkunfts-Check aus Schritt 3
     entfällt, es bleiben Bedarfsfrage und Versionspin. Kein Eintrag: volle
     Prozedur, und das Ergebnis wird ein neuer Katalog-Eintrag.
   Die übrigen Schritte, die Beschreibung im Frontmatter und der Abschnitt
   „Grenzen" bleiben unverändert. Der Verweis auf die Katalogdatei muss in
   Backticks stehen, damit Prüfung 1 ihn erfasst.

4. **`state/triggers.md`** — zwei neue Zeilen in die Tabelle, vor der
   `[FÜLLUNG]`-Zeile:
   - Trigger „Neues Werkzeug im Gespräch" · Bedingung: ein Werkzeug wird
     erwogen · Handlung: zuerst im Werkzeug-Katalog nachschlagen, dann Skill
     `werkzeug-auswahl` · Wer prüft: Mensch.
   - Trigger „Werkzeug mit hohem Blast Radius" · Bedingung: das Werkzeug
     bekommt schreibenden Zugriff auf fremde Systeme, leitet Arbeitsinhalte
     an Dritte weiter oder protokolliert jeden Tool-Aufruf mit · Handlung:
     Advisor-Pass VOR der Installation, kein Ausnahmefall · Wer prüft:
     Mensch + Agent.
   Die vorhandene Zeile „Neues Werkzeug → Skill `werkzeug-auswahl` zuerst
   durchlaufen" wird durch die erste neue Zeile **ersetzt**, nicht
   verdoppelt — sonst stehen zwei Trigger für dieselbe Bedingung da.
   Keine Werkzeugnamen in der Tabelle: namentliche Werkzeuge sind Füllung
   und gehören in die Einträgeliste des Katalogs, nicht in das Skelett.

5. **`state/memory-map.md`** — drei neue Zeilen, jeweils mit gefüllter
   „Nicht hierhin"-Spalte:
   - Was es an Werkzeugen gibt und wann es sich lohnt →
     `docs/harness/werkzeug-katalog.md`; nicht hierhin: was in diesem
     Projekt läuft.
   - Was in diesem Projekt läuft oder abgelehnt wurde → `state/tooling.md`;
     nicht hierhin: allgemeine Werkzeugkunde.
   - Warum diese Stack-Entscheidung fiel → `docs/adr/*.md`; nicht hierhin:
     Werkzeug-Katalog — eine Backend- oder Datenbankwahl ist eine
     Architekturentscheidung, kein Werkzeug.

6. **`state/tooling.md`** — eine Zeile in „Im Einsatz" für die vendorte
   `ponytail`-Kopie: Zweck, Datum aus dem Repo (nicht raten — über
   `git log --diff-filter=A -1 --format=%as -- .claude/skills/ponytail/SKILL.md`
   ermitteln und den ermittelten Wert eintragen), Versionspin `v4.8.4`
   (steht im Kopf von `.claude/skills/ponytail/SKILL.md`), Lizenz MIT, und
   in der letzten Spalte ehrlich: `[Annahme]` vor diesem Programm
   übernommen, keine Prüfspur über den Skill `werkzeug-auswahl` gefunden.

7. **`SETUP.md` Punkt 3** — einen Satz ergänzen: vor der ersten Installation
   im Werkzeug-Katalog nachschlagen, bevor die volle Prozedur läuft. Kein
   neuer Punkt, keine Umnummerierung.

8. **Kalibrierung.** Kein neues Gate, aber ein Nachweis, dass die einzige
   greifende Abdeckung wirklich greift:
   - Rot: den Verweis in `werkzeug-auswahl/SKILL.md` temporär auf einen
     nicht existierenden Pfad umbiegen (z. B.
     `docs/harness/werkzeug-katalog-x.md`) → `node scripts/check-docs.mjs`
     muss genau diesen toten Verweis melden, Exit 1. Ausgabe im Wortlaut.
   - Grün: Verweis zurückstellen → Exit 0.
   - Beides als Kalibrierungs-Log-Eintrag in `state/gates.md`, mit dem Satz,
     dass K4 (Stand-Marker-Pflicht) davon **nicht** abgedeckt ist und mit N7
     in Phase 3 scharf gestellt wird.

NICHT:
- Keine Einträge in den Katalog übertragen. Die 19 Einträge ziehen mit dem
  Lern-Repo in Phase 3 (P4). Wer sie hier einträgt, baut die zweite Wahrheit,
  gegen die der Katalog gerade abgegrenzt wird.
- Kein Verfallsgate (C.3c) und keine Rückflussregel (C.3d). Beide haben ohne
  Einträge keinen Gegenstand und ziehen mit ihnen nach Phase 3.
- Keine Werkzeugnamen in `state/triggers.md` oder im Skelett-Teil des
  Katalogs.
- `docs/werkzeug-katalog.md` (ohne `harness/`) nicht anlegen — der Pfad ist
  in Plan v2 entschieden.
- `state/reibung.md`, `START-KLEIN.md`, `README.md`, `ARCHITECTURE.md` und
  `session-reminder.js` nicht anfassen. Das sind Vertrag 7 und 8.
- `.claude/hooks/*`, `.claude/settings.json`, `package.json`, die Prüfkette,
  `check-docs.mjs`, `check-rules.mjs`, `check-contract.mjs` und `ci.yml`
  nicht anfassen.
- Keine neue Regel in `check-rules.mjs`.
- `programm/` nicht anfassen und nicht stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die Freigabe-Vorgänge
für Commit und Push zählen nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/6-werkzeug-katalog`, von `main` abgezweigt.
- Ein Commit auf diesem Branch, Message inhaltsbeschreibend.
- `npm run check:template` → Exit 0, Ausgabe zeigen.
- Protokoll aus SCHRITT 0 im Bericht, inklusive Bestätigung von `8d89041`.
- Beide Läufe aus Punkt 8 im Wortlaut (Rot mit Befundtext, Grün mit
  „Keine Befunde").
- Kalibrierungs-Log-Eintrag in `state/gates.md`.
- Das per `git log` ermittelte Aufnahmedatum der `ponytail`-Datei im
  Bericht, mit dem Befehl, mit dem du es ermittelt hast.
- Für den Abschluss-Commit: `git diff --staged` vollständig zeigen, mein
  ausdrückliches „ja" abwarten. Freigabe-Datei kommt von mir, für Commit
  und Push getrennt — eine Freigabe gilt für einen Git-Vorgang.
- Beim Push `-u origin harness-fix/6-werkzeug-katalog` verwenden. [Fakt]
  Beim ersten Push eines Branches scheitert ein blankes `git push` an Git
  selbst, und der Hook hat die Freigabe zu diesem Zeitpunkt bereits
  verbraucht — real vorgekommen bei Vertrag 5.
- Danach PR-Status klären. [Fakt] `gh` ist auf dieser Maschine nicht
  installiert; den Link aus der Push-Ausgabe melden. NICHT selbst mergen.

ESCALATE:
- `8d89041` ist nicht in `main` → anhalten, melden, nicht vermuten.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- `docs/harness/werkzeug-katalog.md` existiert bereits → anhalten, nicht
  überschreiben, vorhandenen Inhalt zeigen.
- Der Rot-Fall aus Punkt 8 tritt nicht ein, das Doku-Gate bleibt trotz
  totem Verweis grün → anhalten und melden. Dann greift die einzige
  Gate-Abdeckung des Katalogs nicht, und das muss vor dem Commit geklärt
  sein.
- Das Aufnahmedatum der `ponytail`-Datei lässt sich per `git log` nicht
  ermitteln (flacher Klon, fehlende Historie) → nicht schätzen, sondern
  `[offene Unsicherheit]` eintragen und im Bericht melden.
- Beim Ersetzen der bestehenden Trigger-Zeile fällt auf, dass sie an anderer
  Stelle referenziert wird → anhalten und melden.
- `npm run check:template` wird rot und die Ursache liegt nicht in Punkt 8
  → Ausgabe vollständig zeigen, anhalten.

FOLGT:
- Vertrag 7 (`harness-fix-7-reibung-und-doktrin`) — bereits geschrieben,
  läuft unabhängig von diesem. Beide fassen `state/memory-map.md` an und
  laufen deshalb nacheinander, nicht parallel.
- Vertrag 8 (`harness-fix-8-start-klein`) zuletzt, weil er den Zustand
  beschreibt, den 5 bis 7 herstellen.
- Phase 3, nicht dieser Vertrag: die 19 Einträge nach der Bereinigung
  K1–K5/K9 ins Lern-Repo übertragen, Verfallsgate und Rückflussregel bauen.
  Die Quelldatei liegt im Claude-Projekt „Harness-Projekt" als
  `WERKZEUG-KATALOG.md`, zusammen mit den Verträgen, mit denen sie am
  07.08.2026 entstanden ist.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit und warte
auf mein ausdrückliches „ja".
