# Der Prozess — wie ein Arbeitsdurchgang tatsächlich abläuft

**Das wichtigste Dokument dieses Ordners.** Alles andere beschreibt
Bauteile. Hier steht, wie sie zusammen arbeiten.

---

## Die Grundfigur: acht Schritte

```
  1. SPEC        Was soll entstehen? Woran erkennt man es?
       ↓
  2. PLAN v1     Wie würde man es bauen? (als Datei, nicht im Chat)
       ↓
  3. ADVISOR     Zweite KI, frischer Kontext, kein Schreibrecht
       ↓
  4. PLAN v2     Überarbeitet — als NEUE Datei, v1 bleibt erhalten
       ↓
  5. HANDOFF     Auftrag in Vertragsform: Scope, Budget, Output, Eskalation
       ↓
  6. BAU         Umsetzung
       ↓
  7. REVIEW      code-reviewer, qa (+ design-guardian bei UI)
       ↓
  8. GATE        npm run check → PR → CI → Merge
```

Nicht jeder Durchgang braucht alle acht. Bei einer Kleinigkeit springst du
von 1 direkt zu 6. Aber du **entscheidest** das bewusst und überspringst
es nicht aus Bequemlichkeit.

---

## Schritt 1 — Spec: die Übersetzung vom Wunsch zur Prüfbarkeit

Du hast einen Wunsch im Kopf. Er ist unschärfer, als du denkst. Der Spec
zwingt zu drei Antworten:

- **Wer will was, und warum?** („Als Nutzer will ich X, damit Y")
- **Woran erkennt man, dass es fertig ist?** Prüfbar, nicht „soll gut
  aussehen"
- **Was gehört ausdrücklich nicht dazu?**

Der dritte Punkt ist der, den alle weglassen und alle brauchen. Ohne ihn
liefert eine KI zuverlässig mehr als gewollt — und du merkst es erst beim
Prüfen.

**Warum vor dem Bauen:** Eine Korrektur kostet hier einen Satz. Nach dem
Bau kostet sie einen halben Tag. Das ist der gesamte Grund für diesen
Schritt.

Skill: `spec-schreiben` → Ergebnis nach `specs/`.

---

## Schritte 2–4 — Der Advisor-Pass

Der wirksamste Teil des Verfahrens, und der, den man am ehesten für
Bürokratie hält.

**Ablauf:**

1. Plan als **Datei** schreiben (`state/plan-v1-<thema>.md`) — nicht als
   Chat-Nachricht.
2. Den Agent `architecture-advisor` darauf ansetzen. Er hat frischen
   Kontext, nur Leserechte, und schreibt seine Befunde in eine eigene
   Datei.
3. Befunde lesen, entscheiden, welche du übernimmst.
4. `state/plan-v2-<thema>.md` schreiben. **Nicht v1 überschreiben.**

**Warum eine Datei statt Chat:** Ein Plan im Chat verschwindet. Ein Plan
als Datei kann von einer Instanz geprüft werden, die dein Gespräch nicht
kennt — und genau das ist der Punkt.

**Warum frischer Kontext:** Eine KI, die ihren eigenen Plan prüft, sieht
die eigenen Annahmen nicht. Sie hat sich in derselben Kette selbst
überzeugt. Der Advisor kennt die Kette nicht und stellt deshalb die
naiven Fragen, die weh tun.

**Warum v1 bleiben muss:** Sonst weißt du in drei Wochen nicht mehr, was
der Advisor eigentlich verbessert hat — und ob die Überarbeitung ein
Fortschritt war oder nur eine andere Meinung.

**Wann du das brauchst:** Wenn die Entscheidung mehr als eine Datei
betrifft und schwer rückgängig zu machen ist. Bei einer Textänderung
nicht.

Skill: `advisor-pass`.

---

## Schritt 5 — Der Handoff-Vertrag

Ein Auftrag, so geschrieben, dass eine Sitzung ohne Vorkontext ihn
ausführen kann. Acht Abschnitte:

| Abschnitt | Was hinein gehört | Warum |
|---|---|---|
| `TASK` | Was zu tun ist, ein Satz | Zwingt zur Fokussierung |
| `GOAL` | Woran man Erfolg erkennt | Ohne das ist „fertig" Meinung |
| `CONTEXT` | Was man wissen muss — **mit Evidenz-Markern** | Trennt Geprüftes von Vermutetem |
| `SCOPE` | Was dazugehört — **und was NICHT** | Der wichtigste Abschnitt |
| `BUDGET` | Angemessener Aufwand | Verhindert Ausufern |
| `OUTPUT` | Was am Ende vorliegen muss | Prüfbare Übergabe |
| `ESCALATE` | Wann abbrechen und fragen | Verhindert stundenlanges Falschbauen |
| `FOLGT` | Was direkt danach kommt | Gegen „gegebenenfalls später" |

**Evidenz-Marker** im CONTEXT:

```
[Fakt]                — überprüft, mit Beleg
[Schlussfolgerung]    — aus Fakten abgeleitet
[Annahme]             — nicht geprüft, bewusst angenommen
[offene Unsicherheit] — ungeklärt
```

Klingt umständlich, verhindert aber die häufigste Fehlerart überhaupt:
Eine Vermutung wird weitergereicht und in der nächsten Sitzung als Tatsache
behandelt, weil ihr die Unsicherheit nicht mehr anzusehen ist.

**Guter Zuschnitt** heißt: ein Baudurchgang plus höchstens eine
Korrekturrunde, mit einem eigenständig prüfbaren Ergebnis. Braucht es
drei Runden, war die Aufgabe zu groß.

Skill: `handoff-vertrag` → Datei nach `state/tasks/`.

---

## Schritt 7 — Review

Nach dem Bau, vor dem Commit:

- `code-reviewer` — Wartbarkeit, Robustheit, Abweichung von deinen Regeln
- `qa` — Nutzersicht, Randfälle
- `design-guardian` — nur bei UI-Projekten

Alle drei melden nur. **Sie räumen ihre Befunde nicht selbst weg, und das
ist Absicht.** Ein Prüfer mit Schreibrecht repariert still und meldet
nichts mehr — damit verschwindet die Information, dass es überhaupt ein
Problem gab. Und erst diese Information zeigt dir, welcher Fehler sich
wiederholt und deshalb zur Regel werden muss.

---

## Schritt 8 — Das Tor

```
npm run check   (lokal, alles)
      ↓ grün
git commit      ← FREIGABE-HALT: hier stoppt die KI und fragt
      ↓
git push + PR
      ↓
CI läuft auf fremder Maschine
      ↓ grün
Merge nach main
```

Skill: `git-flow`.

---

## Die drei Regeln, die den Unterschied machen

### 1. Der Freigabe-Halt steht als **letzter** Satz

Formulierst du „zeig mir den Diff, dann committe und pushe — aber frag
vorher", hat die KI die gesamte Kette autorisiert bekommen. Der Halt in
der Mitte hält nichts.

Richtig: Die Anweisung endet dort, wo gestoppt werden soll. Was danach
kommt, ist eine neue Anweisung.

*Das ist real passiert und hat einen ungewollten Commit erzeugt. Nicht,
weil die KI ungehorsam war, sondern weil sie exakt das tat, was dastand.*

### 2. Kein Hedging statt Marker

„Vermutlich", „offenbar", „wahrscheinlich" sind ungekennzeichnete
Annahmen. Entweder du prüfst es (`[Fakt]`) oder du kennzeichnest es
(`[Annahme]`). Prüfung 5 des Doku-Gates erzwingt das in Berichtsdateien.

*Auch das ist real passiert: zweimal stand eine falsche Behauptung in
einer Doku, beide Male in ein Hedging-Wort verpackt.*

### 3. Verifizieren statt vermuten

Ergebnisse auf der Festplatte prüfen — Datei erneut lesen, `git status`,
Terminalausgabe. Nicht dem Editorfenster und nicht der Zusammenfassung der
KI vertrauen.

*Beispiel: Eine Prüfung meldete „nirgends übernommen" — die Änderung war
40 Minuten zuvor übernommen worden, nur war der lokale Stand veraltet. Ein
`git fetch` vorher hätte die Fehldiagnose verhindert.*

---

## Ein realistischer Tagesablauf

**Vormittag — Vorbereitung (viel Text, wenig Ausführung)**
Spec schreiben. Plan v1. Advisor drauf. Befunde lesen. Plan v2.
Handoff-Vertrag. — Noch keine einzige Zeile gebaut, und das ist richtig.

**Mittag — Bau (wenig Text, viel Ausführung)**
Vertrag an eine frische Sitzung geben. Bauen lassen. Zwischenergebnisse
prüfen — **selbst prüfen, nicht dem Bericht glauben**.

**Nachmittag — Absicherung**
`code-reviewer`, `qa`. Befunde abarbeiten. `npm run check`. Freigeben.
Commit, Push, PR, CI, Merge.

**Vor dem Aufhören**
Zwischenstand schreiben, wenn etwas offen ist. Lerntagebuch nachtragen,
wenn ein Zyklus endete. Beides dauert fünf Minuten und spart morgen
vierzig.

---

## Orchestrierung: wann welche Instanz

Ein Punkt, der oft unklar bleibt: Du arbeitest nicht mit *einer* KI,
sondern mit mehreren, die absichtlich nichts voneinander wissen.

| Instanz | Kontext | Rechte | Rolle |
|---|---|---|---|
| Hauptsitzung | dein laufendes Gespräch | voll | baut, koordiniert |
| `architecture-advisor` | frisch, kennt nur die Plandatei | nur lesen | prüft Pläne |
| `code-reviewer` | frisch | nur lesen | prüft Code |
| `qa` | frisch | nur lesen | prüft aus Nutzersicht |
| Bau-Sitzung (per Handoff) | frisch, kennt nur den Vertrag | voll | führt aus |

**Die Trennung ist der Punkt, nicht ein Nebeneffekt.** Zwei Instanzen mit
demselben Kontext machen denselben Denkfehler. Zwei mit getrenntem Kontext
finden ihn gegenseitig.

Praktisch heißt das auch: Ein Prüfergebnis ist nur so viel wert, wie der
Prüfer wirklich uninformiert war. Wenn du dem Advisor vorab erklärst,
warum dein Plan gut ist, hast du ihn gerade wertlos gemacht.

---

## Was schiefgeht, wenn man abkürzt

| Abkürzung | Was passiert |
|---|---|
| Kein Spec | Die KI baut etwas Plausibles, das nicht dein Ziel war. Eine Runde verloren |
| Kein Advisor | Der Denkfehler im Plan wird gebaut, statt korrigiert. Ein Tag verloren |
| Kein `SCOPE — NICHT` | Du bekommst Zusatzfunktionen, die du prüfen, warten und später wieder ausbauen musst |
| Kein Zwischenstand | Die nächste Sitzung beginnt bei null, du erklärst 20 Minuten lang den Kontext |
| Kein Lerntagebuch | Derselbe Fehler passiert in vier Wochen wieder, und niemand merkt, dass es Wiederholung ist |
| Reviewer mit Schreibrecht | Befunde verschwinden. Muster werden unsichtbar. Regeln entstehen nie |
