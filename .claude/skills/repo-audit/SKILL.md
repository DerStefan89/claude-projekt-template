---
name: repo-audit
description: Fuehrt eine Sanierungs-Pruefung durch, gleicht Anweisungsdokumente (CLAUDE.md, ARCHITECTURE.md, README.md, .claude/agents/*.md) gegen die reale Repo-Struktur ab und findet tote Verweise, veraltete Behauptungen und ungeprueft Kopien. Nutzen nach mehreren abgeschlossenen Zyklen, vor einem neuen Zyklus, oder wenn der Nutzer sagt "Sanierungsdurchgang", "Repo-Audit", "Doku gegen Realitaet pruefen", "Drift-Check" oder "ist das noch aktuell". NICHT nutzen fuer einzelne Code-Reviews (dafuer code-reviewer/qa).
---

<!-- Verfahren aus der Praxis. Wenn du dieses Template als eigene
     Bibliothek pflegst: Aenderungen zuerst dort, dann hierher. -->

# Repo-Audit

## Instructions

1. **Quelle & Alter klaeren, bevor du urteilst.** Fuer jedes zu pruefende
   Dokument zuerst die letzten Aenderungen (git log) ansehen. Alter ist der
   Sortierschluessel — kein Beweis, aber der beste Hinweis, wo zuerst
   geschaut wird.
2. **Anweisungs- von Planungsdokumenten trennen.** Anweisungsdokumente
   (CLAUDE.md, ARCHITECTURE.md, README.md, .claude/agents/*.md) muessen
   woertlich wahr sein. docs/STATUS.md ist ein Planungsdokument — veraltete
   Verweise darin sind kein Fund, sondern normal.
3. **Jede Aussage pruefen, nicht nur verdaechtige.** Ein Dokument, das an
   einer Stelle falsch ist, ist selten nur dort falsch.
4. **In beide Richtungen pruefen:** Was steht drin, das es nicht gibt? Und
   was gibt es, das nirgends steht?
5. **Bericht statt Reparatur.** Ergebnis als Tabelle: Fundort | Behauptung |
   Ist-Stand | Kategorie (tot/veraltet/undokumentiert) | Alter der Quelle.
   NICHT selbststaendig reparieren — jeder Fund geht einzeln zur Freigabe.

## Common Issues

- Nur nach "verdaechtigen" Stellen gesucht statt systematisch.
- docs/STATUS.md wie ein Anweisungsdokument behandelt → Fehlalarme.
- Fund ohne Alter-Angabe gemeldet → nicht nachvollziehbar, ob noch aktuell.
- Ergebnis wird automatisch repariert statt dem Menschen vorgelegt.
