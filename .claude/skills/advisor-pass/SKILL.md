---
name: advisor-pass
description: Führt einen Advisor-Pass auf einen Plan durch, BEVOR gebaut wird — Plan v1 als Datei, frischer Kontext, Findings mit Evidenz-Marker und Belegstelle, vierstufiges Urteil, Plan v2 als eigene Datei. Nutzen vor jeder Umsetzung mit Nebenwirkungen (Auth, Geld, öffentliche Endpunkte, DB-Schreibzugriff, neues Gate, Schema-Änderung), oder wenn der Nutzer sagt "Advisor-Pass", "prüf meinen Plan", "ist das overengineered", "bevor ich baue". NICHT nutzen für fertigen Code — dafür Reviewer (code-reviewer/qa) — und nicht als Ersatz für Spec oder Handoff-Vertrag.
---

<!-- Verfahren, destilliert aus sechs realen Praxiszyklen eines
     Produktivprojekts. Wenn du dieses Template als eigene Bibliothek
     pflegst: Änderungen zuerst dort, dann hierher. -->

# Advisor-Pass

Ein Reviewer prüft, was gebaut wurde. Ein Advisor prüft, was gebaut werden
soll. Der Unterschied ist der Preis: Ein Fehler im Plan kostet eine
Korrekturzeile, derselbe Fehler im Code kostet einen Umbau — und manche
fallen erst im Betrieb auf.

Die Prozedur unten ist die Arbeit des **Menschen**. Der Prompt für den
Advisor selbst steht in seiner Agent-Datei (`.claude/agents/architecture-advisor.md`).

## Instructions

1. **Entscheide sichtbar, ob ein Pass fällig ist — auch das Nein.**
   Fällig bei Nebenwirkungen: Auth, Geld, öffentliche Endpunkte,
   DB-Schreibzugriff, neues blockierendes Gate, Schema- oder
   Migrationsänderung, neues Architekturmuster. Nicht fällig bei kleinen,
   reversiblen Änderungen (eine Doku-Zeile, ein Hook, ein Textfix).
   Ein übersprungener Pass wird ausgesprochen und begründet, nicht
   stillschweigend übersprungen — sonst ist nicht unterscheidbar, ob
   entschieden oder vergessen wurde.

2. **Schreibe Plan v1 als Datei**, nicht ins Fenster
   (`state/plan-v1-<slug>.md`). Ein Plan im Chatverlauf überlebt keine
   Compaction, und ohne v1 auf der Platte ist später nicht belegbar, was
   der Advisor eigentlich verändert hat.

3. **Markiere im Plan selbst, was offen ist.** Ein Abschnitt „Offener
   Punkt, nicht stillschweigend entschieden" pro echter Unklarheit. Diese
   Stellen bekommt der Advisor als Fokus — er prüft alles, aber er weiß,
   wo du selbst unsicher bist. Erfahrungsgemäß liefern genau diese Stellen
   die härtesten Findings.

4. **Frischer Kontext.** Der Advisor läuft nicht in der Sitzung, die den
   Plan geschrieben hat. Autor und Prüfer im selben Kontext ergeben
   Zustimmung, nicht Prüfung.

5. **Rollengrenze ausdrücklich mitgeben und im Bericht festhalten:** nur
   Lesezugriff (Read/Grep/Glob), kein Schreibrecht, kein Bash/Git. Wo die
   Grenze die Prüftiefe einschränkt, gehört das in den Bericht — ein
   Prüfer, der seine blinden Flecken benennt, ist mehr wert als einer, der
   Vollständigkeit behauptet.

6. **Verlange Belege statt Urteile.** Jedes Finding nennt Datei und Zeile.
   Jedes Finding trägt einen Evidenz-Marker: `[Fakt]` im Code belegt ·
   `[Schlussfolgerung]` aus Fakten abgeleitet · `[Annahme]` unbelegte
   Prämisse von Spec oder Plan · `[offene Unsicherheit]` weder belegt noch
   widerlegt. Ohne Marker ist ein Finding von einer Meinung nicht zu
   unterscheiden.

7. **Verlange auch entlastende Befunde** (`[Fakt, entlastend]`). Ein
   Advisor, der nur Mängel liefert, erzeugt den Eindruck, der Plan sei
   durchgehend schwach — und lässt dich raten, welche Teile geprüft und in
   Ordnung waren. Bestätigte Stellen sind Prüfergebnis, nicht Höflichkeit.

8. **Verlange ein vierstufiges Urteil mit Begründung:** Freigegeben ·
   Freigegeben mit Hinweisen · Nicht freigegeben · Blockiert. Die
   Begründung sortiert die Findings nach Schwere und benennt, welche vor
   Umsetzungsbeginn zu klären sind und welche mitlaufen dürfen. Ein Urteil
   ohne diese Sortierung zwingt dich, sie selbst zu erfinden.

9. **Schreibe Plan v2 als eigene Datei.** `state/plan-v1-<slug>.md` bleibt
   unverändert stehen. Wer v1 überschreibt, löscht den Beleg dafür, dass
   der Pass etwas bewirkt hat — und macht die Frage „lohnt sich der
   Aufwand?" unbeantwortbar.

10. **Nachtrag statt Neufassung.** Löst sich eine `[offene Unsicherheit]`
    später auf — meist beim ersten echten Gebrauch —, kommt ein Abschnitt
    `## Nachtrag` ans Ende der Findings-Datei mit Datum, Beleg und dem
    Satz, dass der ursprüngliche Befund als historischer Stand
    unverändert stehen bleibt. Eine stillschweigend korrigierte Datei
    behauptet, man hätte es von Anfang an gewusst.

## Ausgabe

Drei Dateien pro Pass, alle unter `state/`:

- `plan-v1-<slug>.md` — vor dem Pass
- `advisor-findings-<slug>.md` — Kopf (was wurde gegen welche Quellen
  geprüft, Rollengrenze), Marker-Legende, nummerierte Befunde, Urteil,
  „Nächster sinnvoller Schritt"
- `plan-v2-<slug>.md` — nach dem Pass

## Grenzen

Der Advisor prüft Pläne, nicht fertigen Code — dafür sind Reviewer da. Er
kommentiert, er schreibt nicht um; deshalb bekommt er bewusst kein
Schreibrecht. Ein Prüfer mit Schreibrechten wird heimlich zum Autor.

Ein bestandener Advisor-Pass ist keine Freigabe zum Bauen ohne Reviewer
danach, und er ersetzt keine Spec: Er prüft, ob der Weg trägt, nicht ob
das Ziel richtig ist.

## Common Issues

- Advisor läuft in derselben Sitzung wie der Plan → prüft die eigene
  Argumentation und bestätigt sie.
- Findings ohne Datei-/Zeilenbeleg → nicht nachprüfbar, also wertlos.
- Plan v1 wird überschrieben statt ergänzt → Wirkung des Passes nicht mehr
  belegbar.
- Pass wird bei „kleinen" Änderungen weggelassen, ohne dass jemand das
  entschieden hat → beim nächsten Mal fehlt die Grenze, ab der er fällig ist.
- Nur Mängel im Bericht → unklar, was geprüft und in Ordnung war.
