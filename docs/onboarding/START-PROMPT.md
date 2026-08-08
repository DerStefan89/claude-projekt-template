# Start-Prompt

Diesen Text in einen **neuen Chat** im Claude-Projekt „Harness-Begleiter"
einsetzen. Die eckigen Klammern vorher ausfüllen — Claude fragt sonst
ohnehin danach.

---

## Der Prompt (kopieren)

```
Ich habe das Repo claude-projekt-template geklont und will damit ein
eigenes Projekt aufbauen. Das Repo liegt bei mir unter:
[Pfad, z. B. C:\Projekte\mein-projekt]

Über mich:
- Feld: [Softwareentwicklung / App / Smart Contracts / Marketing-
  Automatisierung / KI-Video / anderes]
- Erfahrung mit Git und Terminal: [keine / etwas / sicher]
- Erfahrung mit Claude Code: [keine / etwas / sicher]
- Zeit pro Woche: [Stunden]

Was ich vorhabe:
[Ein bis drei Sätze. Wenn du noch kein Projekt hast, schreib das —
dann machen wir den Verstehen-Modus.]

Bevor wir loslegen:
1. Erklär mir in einfacher Sprache, was dieses Harness überhaupt ist und
   welches Problem es löst. Kurz, kein Fachjargon.
2. Erklär mir den Unterschied zwischen den beiden Modi (Verstehen / Bauen)
   und was mich bei jedem erwartet — Aufwand, Ergebnis, Voraussetzungen.
3. Sag mir, welchen du mir für meine Ausgangslage empfiehlst und warum.

Danach warte auf meine Entscheidung. Gib mir noch keine Aufgaben und
noch keine Prompts für Claude Code.
```

---

## Warum der Prompt so gebaut ist

Vier Dinge daran sind Absicht:

**Der Pfad steht drin.** Claude sieht dein Repo nicht. Der Pfad ist die
einzige Chance, dass die Anweisungen später mit den richtigen Ordnernamen
kommen.

**Die Selbsteinschätzung steht drin.** „Keine Erfahrung mit Git" ändert
jede weitere Antwort — vom Erklärtiefe bis zur Frage, ob ein Befehl
kommentiert wird oder nicht.

**Die drei Fragen stehen vor der Entscheidung.** Wer den Modus wählt, bevor
er weiß, was ihn erwartet, wählt raten statt entscheiden.

**Der letzte Satz ist ein Halt.** Und er steht als letzter Satz, nicht in
der Mitte. Ohne ihn liefert Claude die Erklärung und legt gleich mit der
ersten Aufgabe nach — dann liest du beides halb.

---

## Was danach passiert

Claude erklärt, du entscheidest dich für einen Modus, und ab da läuft es in
kleinen Schritten:

```
Claude erklärt den Sinn
   → Claude gibt dir EINEN Schritt
      → du führst ihn aus (meist in Claude Code)
         → du spielst das Ergebnis zurück
            → Claude prüft und gibt den nächsten Schritt
```

Jede Antwort endet mit deinem nächsten Schritt und dem, was du zurückspielen
sollst. Wenn das mal fehlt, frag danach.

---

## Zwei Sätze, die du kennen solltest

**„langsamer"** — teilt den aktuellen Schritt weiter auf. Kein Grund nötig.

**„zeig mir das nochmal am Beispiel"** — bringt eine abstrakte Erklärung auf
einen konkreten Fall herunter.

Beides jederzeit einsetzbar. Nichts davon ist ein Zeichen von Schwäche —
ein Schritt, den du nicht verstanden hast, wird später doppelt teuer.

---

## Wenn du einen neuen Chat anfängst

Lange Chats werden teuer und ungenauer. Wenn dein Chat lang wird, bitte
Claude um eine Übergabe:

```
Gib mir eine Übergabe für einen neuen Chat: Stand, getroffene
Entscheidungen, was offen ist, und was ich dir zeigen muss, bevor es
weitergeht.
```

Diese Übergabe fügst du als erste Nachricht in den neuen Chat ein — dann
kennt Claude deinen Stand, ohne dass du 20 Minuten lang erklärst.
