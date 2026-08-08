# Start hier — Was ist dieses Repo?

Dieses Repo ist **kein fertiges Produkt und kein Starter-Kit für eine
bestimmte Technologie**. Es ist eine Arbeitsumgebung, in der du mit einer
KI (Claude Code) an einem Projekt arbeitest, ohne dass die KI
unkontrolliert Dinge verändert oder dir stillschweigend Unsinn liefert.

Das Fachwort dafür ist **Harness** — wörtlich „Geschirr", wie bei einem
Zugpferd. Nicht um das Pferd zu bremsen, sondern um seine Kraft in eine
Richtung zu lenken. Genau das macht dieses Repo mit einem KI-Modell.

Es funktioniert für Software, aber genauso für KI-Videoproduktion,
Marketing-Automatisierung oder jedes andere Vorhaben, bei dem über Wochen
viele Einzelschritte anfallen und man den Überblick verliert.

---

## Das Grundproblem, das hier gelöst wird

Wenn du mit einer KI arbeitest, passieren erfahrungsgemäß vier Dinge:

1. **Die KI vergisst.** Jede neue Sitzung beginnt bei null. Absprachen von
   gestern sind weg.
2. **Die KI rät und klingt dabei überzeugt.** Eine Vermutung sieht in der
   Antwort genauso aus wie eine geprüfte Tatsache.
3. **Du vergisst.** Nach vier Stunden Arbeit gibst du Dinge frei, die du
   morgens noch dreimal geprüft hättest.
4. **Es sammelt sich Wildwuchs an.** Regeln stehen in drei Dokumenten,
   zwei davon veraltet, keins davon merkt es.

Alle vier Probleme haben hier eine Antwort — und zwar eine, die nicht auf
gutem Willen beruht, sondern auf Mechanik.

---

## Die fünf Bausteine (Überblick)

```
   ┌─────────────────────────────────────────────────────────┐
   │  1. REGELN — was gilt                                   │
   │     CLAUDE.md · ARCHITECTURE.md                         │
   │     Wird bei jedem Sitzungsstart automatisch geladen    │
   └────────────────────────┬────────────────────────────────┘
                            │  gilt für ↓
   ┌────────────────────────┴────────────────────────────────┐
   │  2. WERKZEUGE — womit die KI arbeitet                   │
   │     .claude/  →  Agents · Skills · Hooks · Settings     │
   │     Prüfrollen, Arbeitsanleitungen, Automatik-Auslöser  │
   └────────────────────────┬────────────────────────────────┘
                            │  wird kontrolliert von ↓
   ┌────────────────────────┴────────────────────────────────┐
   │  3. GATES — was maschinell durchgesetzt wird            │
   │     scripts/ · .github/workflows/ · Branch Protection   │
   │     Kein guter Wille nötig: es geht durch oder nicht    │
   └────────────────────────┬────────────────────────────────┘
                            │  hält fest ↓
   ┌────────────────────────┴────────────────────────────────┐
   │  4. GEDÄCHTNIS — was das Projekt über sich weiß         │
   │     state/  →  Annahmen · Gates · Zwischenstand · Tasks │
   │     docs/   →  Status · Entscheidungen · Lernstand      │
   └────────────────────────┬────────────────────────────────┘
                            │  beschrieben in ↓
   ┌────────────────────────┴────────────────────────────────┐
   │  5. DER PROZESS — in welcher Reihenfolge gearbeitet wird│
   │     Spec → Plan → Advisor → Bau → Review → Gate → Merge │
   └─────────────────────────────────────────────────────────┘
```

Jeder dieser fünf Blöcke hat einen eigenen Deep Dive in diesem Ordner.

---

## Die wichtigste Idee: vier Ebenen der Verbindlichkeit

Eine Regel ist nicht gleich eine Regel. Es gibt vier Stufen, wie fest
etwas gilt — und sie sind **nicht gleich stark**:

| Ebene | Was | Wie zuverlässig |
|---|---|---|
| 1 | **Mensch** — du liest, entscheidest, gibst frei | Am schwächsten. Müdigkeit, Zeitdruck, Routine |
| 2 | **Modell-Evaluator** — eine zweite KI prüft die erste (`.claude/agents/`) | Gut, aber selbst fehlbar |
| 3 | **Deterministische Gates** — Skripte und CI, die stur Ja/Nein sagen | Am stärksten. Kennt keine Müdigkeit |
| 4 | **Berechtigungen** — was die KI technisch gar nicht darf | Hart, aber grob |

**Die zentrale Erkenntnis aus sechs Praxiszyklen:** Ebene 1 ist die, auf
die man instinktiv baut — und die als erste nachgibt. Ebene 3 ist die, die
hält. Wer eine Regel wirklich durchsetzen will, schreibt sie nicht in ein
Dokument, sondern in ein Skript.

Deshalb hat dieses Template ein Doku-Gate (`scripts/check-docs.mjs`), das
Widersprüche in der eigenen Dokumentation automatisch findet — statt zu
hoffen, dass jemand sie bemerkt.

---

## Was du jetzt liest

| Datei | Inhalt | Für wen |
|---|---|---|
| `01-DEEPDIVE-regeln.md` | CLAUDE.md, ARCHITECTURE.md, die Regelhierarchie | alle |
| `02-DEEPDIVE-claude-ordner.md` | Agents, Skills, Hooks, MCPs, Settings — was diese Wörter bedeuten | alle |
| `03-DEEPDIVE-gates.md` | Skripte, CI, Branch Protection: automatische Prüfungen | alle |
| `04-DEEPDIVE-gedaechtnis.md` | `docs/`, `state/`, `specs/` — welche Datei was merkt | alle |
| `05-SKELETT-ODER-FUELLUNG.md` | Tabelle: was übernimmst du unverändert, was musst du anpassen | vor dem Start |
| `06-DER-PROZESS.md` | Wie ein Arbeitsdurchgang tatsächlich abläuft | **wichtigstes Dokument** |
| `07-TOKEN-SPAREN.md` | Wie du dieselbe Arbeit günstiger bekommst | nach dem ersten Projekt |
| `08-EIGENES-PROJEKT.md` | Schritt-für-Schritt zum eigenen Projekt | zum Loslegen |

**Empfohlene Reihenfolge beim ersten Mal:** dieses Dokument →
`06-DER-PROZESS.md` → `05-SKELETT-ODER-FUELLUNG.md` → `08-EIGENES-PROJEKT.md`.
Die Deep Dives 01–04 kannst du nachschlagen, wenn ein Begriff auftaucht,
den du nicht kennst.

---

## Eine ehrliche Warnung vorab

Dieses Harness macht die Arbeit am Anfang **langsamer**, nicht schneller.
Du schreibst Spezifikationen, bevor du baust. Du lässt Pläne prüfen, bevor
du sie umsetzt. Du dokumentierst Entscheidungen, die du auch einfach hättest
treffen können.

Der Gewinn kommt später und woanders: bei Woche sechs, wenn du wissen
willst, warum etwas so gebaut ist. Bei der Sitzung, in der die KI eine
Datei anfasst, die sie nicht anfassen sollte. Bei dem Moment, in dem
auffällt, dass eine Dokumentation seit vier Wochen falsch ist — weil ein
Skript es gemeldet hat und nicht ein Kunde.

Wenn dein Vorhaben in zwei Nachmittagen erledigt ist, ist dieses Harness
Overkill. Ab etwa „mehrere Wochen, mehrere Beteiligte oder etwas, das
nicht kaputtgehen darf" rechnet es sich.
