# Deep Dive 1 — Regeln: CLAUDE.md und ARCHITECTURE.md

## Worum es geht

Eine KI weiß nichts über dein Projekt, bis du es ihr sagst. Und sie
vergisst es wieder, sobald die Sitzung endet. Die Lösung ist keine
bessere Erinnerung, sondern eine **Datei, die bei jedem Start automatisch
mitgelesen wird**.

Das ist `CLAUDE.md`. Sie ist der einzige Text, den Claude Code garantiert
kennt, ohne dass du ihn erwähnst.

---

## Begriffe

**CLAUDE.md**
Eine Markdown-Datei im Projektstammverzeichnis. Claude Code lädt sie bei
jedem Sitzungsstart automatisch. Alltagsvergleich: der Zettel, der am
Arbeitsplatz hängt und den jeder Neue als Erstes liest — nicht das
Handbuch im Schrank, das man erst suchen müsste.

**ARCHITECTURE.md**
Die technischen Detailregeln. Getrennt von CLAUDE.md, weil CLAUDE.md kurz
bleiben muss (siehe unten). CLAUDE.md sagt „lies ARCHITECTURE.md, bevor du
Code schreibst" — damit ist die Verbindung hergestellt, ohne dass der
gesamte Inhalt permanent mitgeschleppt wird.

**Kontextfenster**
Der Arbeitsspeicher der KI für ein Gespräch, gemessen in Tokens. Alles,
was hineingehört — deine Nachrichten, gelesene Dateien, CLAUDE.md — belegt
Platz. Ist er voll, muss zusammengefasst oder vergessen werden. Deshalb
ist jede Zeile in CLAUDE.md teuer: sie wird in **jeder** Sitzung geladen,
für immer.

**Token**
Die Abrechnungseinheit für KI-Text. Grob: ein Token ≈ 4 Zeichen ≈ ein
halbes deutsches Wort. Eine 200-Zeilen-CLAUDE.md kostet dich rund 2 000
Tokens pro Sitzung, unabhängig davon, ob sie gebraucht wird.

---

## Was in CLAUDE.md gehört — und was nicht

| Gehört rein | Gehört nicht rein |
|---|---|
| Was ist das Produkt, für wen (1–2 Sätze) | Ausführliche Produktbeschreibung |
| Technischer Stack, die wichtigsten Befehle | Vollständige API-Dokumentation |
| Arbeitsweise: Briefing, Iterationsprinzip | Der aktuelle Projektstand → `docs/STATUS.md` |
| Definition of Done (Checkliste) | Einzelne Architekturentscheidungen → `docs/adr/` |
| Verweis auf ARCHITECTURE.md | Der Inhalt von ARCHITECTURE.md selbst |
| Bekannte Fallen, die dich zweimal getroffen haben | Fallen, die einmal auftraten (noch kein Muster) |
| Verweis auf die Prüfrollen | Die Prüfrollen-Texte selbst → `.claude/agents/` |

**Faustregel:** Wenn es in 90 % der Sitzungen irrelevant ist, gehört es
nicht in CLAUDE.md, sondern in eine Datei, auf die CLAUDE.md verweist.

---

## Die Definition of Done

Ein Abschnitt in CLAUDE.md, der aussieht wie eine harmlose Checkliste und
in Wahrheit das meistgenutzte Werkzeug im ganzen Harness ist:

```
- [ ] Fehlerzustände berücksichtigt
- [ ] Leere Zustände berücksichtigt
- [ ] `npm run check` → Exit 0
- [ ] KEINE Commits ohne explizite Freigabe
```

Warum das wirkt: „Bist du fertig?" ist eine Meinungsfrage. „Sind alle acht
Punkte abgehakt?" ist eine Faktenfrage. Der Unterschied entscheidet, ob
eine KI (oder du selbst) sich selbst überschätzt.

Die letzte Zeile — keine Commits ohne Freigabe — ist die einzige, die
nicht durch ein Skript geprüft werden kann. Genau deshalb muss sie durch
Ebene 3 abgesichert werden (siehe Deep Dive 3, Branch Protection).

---

## Die vier Ebenen im Detail

### Ebene 1 — Mensch
Du liest den Vorschlag, prüfst ihn, gibst frei. Klingt am
vertrauenswürdigsten, ist es aber nicht: Diese Ebene funktioniert morgens
um 9 anders als abends um 19 Uhr. Sie ist unverzichtbar für alles, was
Urteilsvermögen braucht — und ungeeignet als einziger Schutz gegen
Routinefehler.

### Ebene 2 — Modell-Evaluator
Eine zweite KI-Instanz mit **frischem Kontext** und **ohne Schreibrecht**
prüft die Arbeit der ersten. Das ist keine Spielerei: Eine KI, die ihren
eigenen Plan prüft, sieht die eigenen Annahmen nicht — genau wie ein
Mensch den eigenen Tippfehler überliest.

Warum ohne Schreibrecht: Ein Prüfer, der selbst reparieren darf, repariert
und meldet nicht mehr. Damit verschwindet der Befund und mit ihm die
Chance, das Muster zu erkennen.

### Ebene 3 — Deterministische Gates
Skripte und CI-Läufe. Sie sagen Ja oder Nein, immer nach derselben Regel,
ohne Ermessen. Diese Ebene ist die einzige, die auch dann noch hält, wenn
alle Beteiligten es eilig haben.

Beispiel aus der Praxis: In der Quell-Codebasis dieses Templates gab es
dreimal einen Commit ohne die eigentlich vorgeschriebene Freigabe. Jedes
Mal war Ebene 1 der schwache Punkt (einmal eine unklar formulierte
Anweisung, zweimal ein zu schnell weggeklickter Dialog). Ein technisches
Gate an der richtigen Stelle hätte in allen drei Fällen gegriffen.

### Ebene 4 — Berechtigungen
`.claude/settings.json` legt fest, was die KI überhaupt ausführen darf.
Die härteste, aber gröbste Ebene: Sie kann „darf keine Shell-Befehle
ausführen" durchsetzen, aber nicht „darf diesen Befehl nur nach
Rücksprache".

---

## Was du hier anpassen musst

`CLAUDE.md` im Template ist mit `[FÜLLUNG]` markiert an allen Stellen, die
projektspezifisch sind: Produktbeschreibung, Stack, Befehle. Der Rest
(Briefing-Vorlage, Iterationsprinzip, Definition of Done, Status-Format)
ist bewusst so gelassen — das ist die Mechanik, die sich bewährt hat.

`ARCHITECTURE.md` ist im Template **fast leer und das ist Absicht**. Sie
kann nicht vorausgefüllt werden, ohne dir einen Stack aufzuzwingen. Fülle
sie, wenn du deine erste echte Architekturentscheidung getroffen hast —
nicht vorher, sonst stehen dort Regeln, die du nie geprüft hast.

---

## Häufiger Anfängerfehler

Die Versuchung ist groß, CLAUDE.md immer weiter zu füllen — jede neue
Erkenntnis kommt oben drauf. Nach drei Monaten ist sie 600 Zeilen lang,
kostet in jeder Sitzung Geld, und die wichtigen Regeln gehen zwischen den
unwichtigen unter.

Gegenmittel: Wenn du etwas hinzufügst, frag dich, was dafür rausfliegt.
Und: Erkenntnisse gehören zuerst nach `docs/harness/HARNESS-LEARNING-STATE.md`
(dem Lerntagebuch des Projekts). Erst wenn eine Erkenntnis dreimal
gebraucht wurde, wird sie zur Regel in CLAUDE.md befördert.
