<!--
Ziel-Pfad im Repo: docs/harness/werkzeug-katalog.md
Stand dieser Fassung: 18.08.2026
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
