---
name: spec-schreiben
description: Schreibt eine Spec für ein Vorhaben — Problem, prüfbare V-Aussagen (aus denen später Tests werden), Nicht-Ziele als Pflichtsektion, Constraints, offene Fragen. Nutzen VOR Plan und Handoff-Vertrag bei jedem mittleren oder größeren Vorhaben, oder wenn der Nutzer sagt "Spec", "was soll das können", "User Story", "Anforderungen aufschreiben". NICHT nutzen für triviale Einzeländerungen und nicht als Ersatz für den Plan — die Spec sagt WAS, der Plan sagt WIE.
---

<!-- Verfahren aus der Praxis. Wenn du dieses Template als eigene
     Bibliothek pflegst: Änderungen zuerst dort, dann hierher. -->

# Spec schreiben

Eine Spec sagt, **was gelten soll** — in Sätzen, die mit Ja oder Nein
beantwortbar sind. Der Plan sagt, wie es gebaut wird. Das Statusdokument
sagt, warum es das Produkt gibt. Wer die drei mischt, bekommt ein Dokument,
das niemand prüfen kann.

**Merksatz: Eine Spec-Zeile, aus der kein Test werden kann, ist keine
Spec-Zeile.**

## Instructions

1. **Ist-Zustand lesen, bevor du schreibst.** Öffne die betroffenen Dateien
   und notiere im Problem-Abschnitt, was heute tatsächlich passiert — mit
   Datei und Zeile. Eine Spec, die den Ist-Zustand vermutet, beschreibt ein
   Problem, das es vielleicht nicht gibt.

2. **Sechs Abschnitte füllen**, in dieser Reihenfolge:

   - `## Problem & Nutzer` — was heute schiefgeht, für wen, mit
     Datei-/Zeilenbeleg. Evidenz-Marker wie im Handoff-Vertrag: `[Fakt]`,
     `[Schlussfolgerung]`, `[Annahme]`, `[offene Unsicherheit]`.
   - `## Entschieden (vor dem Plan geklärt)` — Fragen, die sonst der Plan
     stillschweigend beantwortet hätte: Bibliothek, Fehlerformat,
     Namenskonvention. Jede Entscheidung mit einem Satz Begründung.
   - `## Gewünschtes Verhalten` — die V-Aussagen, durchnummeriert
     (V1, V2, …), gruppiert nach betroffener Datei.
   - `## Nicht-Ziele` — was ausdrücklich **nicht** dazugehört, je mit
     Begründung. Pflichtsektion.
   - `## Constraints` — Stack-Regeln, bestehende Mechanismen, die
     unverändert weiterlaufen, Budget.
   - `## Offene Fragen` — was du bewusst offen lässt. Der Advisor bekommt
     diese Stellen als Fokus.

3. **V-Aussagen als Testfälle formulieren.** Bauform: *Auslöser → erwartete
   Antwort → statt was heute passiert.* Prüfe jede Aussage mit einer Frage:
   *Könnte ich daraus in einer Zeile einen Test schreiben?* Wenn nein, ist
   sie zu vage.

4. **Bestandsverhalten ausdrücklich kennzeichnen.** Manche V-Aussagen
   fordern keine Änderung, sondern schreiben fest, was heute schon gilt und
   gelten bleiben soll. Markiere sie als solche — sonst hält der Plan sie
   für Arbeit und baut eine Phase ohne Wirkung.

5. **Nicht-Ziele sind die wichtigere Hälfte.** In Scrum begrenzt die
   Kapazität eines Teams den Umfang. Ein Agent hat diese Bremse nicht — er
   ist hilfsbereit, schnell, und müde wird er nie. Ohne ausdrückliche
   Grenze repariert er nebenan gleich mit. Jedes Nicht-Ziel bekommt einen
   Grund; „nicht jetzt" reicht nicht, „eigener Task, weil andere
   Vertrauensgrenze" schon.

6. **Offene Fragen offen lassen.** Eine Spec, die alles entscheidet, hat
   entweder alles geprüft oder geraten — und beim Lesen sieht beides gleich
   aus. Was du nicht belegen kannst, gehört unter „Offene Fragen", nicht
   unter „Entschieden".

7. **Knapp halten.** Keine Einleitung, keine Wiederholung des Auftrags. Die
   Spec wird von jedem Folgeschritt gelesen — jede überflüssige Zeile
   kostet mehrfach.

## Was danach kommt

Spec → Plan v1 → Advisor-Pass (Skill `advisor-pass`) → Plan v2 → je Phase
ein Handoff-Vertrag (Skill `handoff-vertrag`) → Reviewer → Retro mit
mindestens einem neuen Testfall.

Die Spec bleibt dabei unverändert stehen. Ändert sich das Ziel, wird das in
der Spec nachgezogen und begründet — nicht im Plan versteckt.

## Übersetzung für Kunden mit Scrum-Erfahrung

| Agile-Begriff | Äquivalent hier |
|---|---|
| User Story | Spec mit prüfbarem Verhalten |
| Sprint / Iteration | Phase mit frischem Kontext + Tor |
| Definition of Done | DoD im Handoff-Vertrag, geprüft von Gates + Evaluator |
| Daily / Standup | State-File-Review |
| Review / Demo | Reviewer-PASS + menschliche Stichprobe am Artefakt |
| Retro | Lernjournal + neuer Eval-Fall pro Fehlschlag |
| Backlog | `specs/` + `state/tasks/` |

Der Satz für das Kundengespräch: Ihr Scrum-Wissen gilt weiter, nur die
Ausführenden haben gewechselt — und dazu kommt eine Sektion, die Scrum nie
brauchte: Nicht-Ziele.

## Grenzen

Die Spec entscheidet nicht, wie gebaut wird, und benennt keine Phasen — das
ist der Plan. Sie ersetzt keinen Advisor-Pass: Sie prüft, ob das Ziel
richtig beschrieben ist, nicht ob der Weg dorthin trägt.

## Common Issues

- V-Aussagen als Prosa („die Eingabe soll sicher sein") → nicht testbar,
  also nicht prüfbar, also kein Tor.
- Nicht-Ziele fehlen → der Agent baut hilfsbereit das Doppelte.
- Bestandsverhalten nicht als solches gekennzeichnet → der Plan schneidet
  eine Phase zu, die nichts ändert.
- Spec beschreibt Implementierung statt Verhalten → gehört unter
  „Entschieden" mit Begründung oder in den Plan.
- Spec wird nachträglich still an das angepasst, was gebaut wurde → sie
  verliert ihre Funktion als Maßstab.
