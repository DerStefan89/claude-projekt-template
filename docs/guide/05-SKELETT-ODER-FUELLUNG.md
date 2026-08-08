# Was ist fest, was musst du anpassen?

Das Ordnungsprinzip dieses Templates heißt **Skelett und Füllung**.

- **Skelett** = die Mechanik. Übernimmst du unverändert. Sie funktioniert
  bei einer Web-App genauso wie bei einer Videoproduktion, weil sie nichts
  über den Inhalt annimmt.
- **Füllung** = alles Projektspezifische. Musst du ersetzen. Übernimmst du
  es unverändert, schleppst du fremde Annahmen mit.

Im Repo sind alle Füllungs-Stellen mit `[FÜLLUNG]` markiert. Suche im
gesamten Ordner nach diesem Wort — das ist deine Arbeitsliste.

---

## Übernehmen (Skelett — nicht anfassen)

| Datei / Bereich | Warum unverändert |
|---|---|
| `.claude/hooks/*.js` (alle vier) | Reine Mechanik: Zwischenstand laden, Verdichtung prüfen, Settings schützen, Erinnerung zählen. Keine Zeile darin weiß, was dein Projekt tut |
| `.claude/agents/architecture-advisor.md` | Prüft Pläne. Die Fragen („welche Annahme ist unbelegt?") gelten überall |
| `.claude/agents/code-reviewer.md` | Kriterien-Rahmen ist allgemein; die konkreten Kriterien holt er aus **deiner** ARCHITECTURE.md |
| `.claude/agents/qa.md` | Nutzersicht und Randfälle sind kein Stack-Thema |
| `.claude/skills/*` (alle sieben) | Verfahren, keine Inhalte |
| `scripts/check-docs.mjs` Prüfungen 1, 3, 4, 5 | Suchen nach Widersprüchen, nicht nach Technik |
| `scripts/_mode.ts` | Trockenlauf-Standard für schreibende Skripte |
| `.gitattributes` | Zeilenenden-Normalisierung — Umgebungsproblem, kein Projektproblem |
| `state/zwischenstand/VORLAGE.md` | Reine Vorlage |
| `docs/adr/TEMPLATE.md` | Reine Vorlage |
| `CLAUDE.md`: Briefing-Vorlage, Iterationsprinzip, Definition of Done, Entscheidungsregel, Status-Format | Der bewährte Arbeitsrahmen |
| Die Struktur von `state/` und `docs/harness/` | Welche Datei was merkt — das ist die eigentliche Erfindung |

---

## Ersetzen (Füllung — musst du selbst schreiben)

| Datei / Bereich | Was du tun musst | Aufwand |
|---|---|---|
| `CLAUDE.md` Kopfbereich | Produktsatz, Stack, Befehle eintragen | 20 min |
| `ARCHITECTURE.md` | **Ganze Datei.** Kommt fast leer | 1–2 h, wächst mit |
| `package.json` scripts | `lint`, `typecheck`, `test` mit echten Befehlen füllen | 30 min |
| `.github/workflows/ci.yml` | Bei Node/TypeScript direkt nutzbar. Bei anderer Toolchain die Schritte ersetzen — **Jobname `check` beibehalten** (Branch Protection greift am Namen) | 0–1 h |
| `scripts/check-docs.mjs` Prüfung 2 | Die Namensliste zeigt auf einen fremden Stack. Auf deinen anpassen | 10 min |
| `scripts/check-docs.mjs` Prüfung 4 | `dokumentPaare` ist leer. Erstes Paar eintragen, wenn beide Dateien Inhalt haben | 10 min |
| `scripts/check-rules.mjs` | Leer. Füllt sich erst, wenn ein Fehler dreimal auftrat | später |
| `docs/STATUS.md` | Aktueller Stand und Scope | 15 min |
| `docs/harness/*` | Alle vier starten leer. Wachsen mit dem Projekt | laufend |
| `state/*.md` | Tabellen sind leer. Füllen sich beim Arbeiten | laufend |
| `docs/kommentar-standard.md` | Syntax an deine Sprache anpassen | 10 min |

---

## Entscheidungen, die dir niemand abnimmt

| Frage | Wenn ja | Wenn nein |
|---|---|---|
| Ist es ein UI-Projekt? | `docs/examples/design-guardian.example.md` nach `.claude/agents/design-guardian.md` kopieren und anpassen; `docs/design-system.md` anlegen | `design-guardian` weglassen. Ein Prüfer für ein Kriterium, das es nicht gibt, prüft nichts |
| Liegt es auf GitHub? | Branch Protection einrichten (`SETUP.md` Punkt 1) — vorher Tarif prüfen, siehe Deep Dive 3 | Ohne dieses Gate fehlt die stärkste Sicherung. Ersatz überlegen, nicht ignorieren |
| Brauchst du externe Dienste (MCPs)? | Erst `werkzeug-auswahl`, dann installieren, Ergebnis nach `state/tooling.md` | Erspart dir Tokens und Angriffsfläche |
| Arbeiten mehrere Leute daran? | `.claude/settings.json` ist Team-Policy; jeder legt sich eine eigene `settings.local.json` an | Trotzdem beide Dateien getrennt halten — dein späteres Ich ist auch jemand anders |

---

## Für Nicht-Software-Projekte

Das Template ist aus einem Softwareprojekt destilliert, aber die Mechanik
ist es nicht. Übersetzung:

| Im Template | KI-Videoproduktion | Marketing-Automatisierung |
|---|---|---|
| `npm run check` | Prüfskript: Sind alle Assets da? Stimmen Längen und Formate? | Prüfskript: Sind alle Textbausteine gefüllt? Keine Platzhalter mehr? |
| `lint` | Dateinamens- und Ordnerkonvention prüfen | Linkprüfung, Rechtschreibung |
| `test` | Rendert das Projekt fehlerfrei durch? | Läuft die Strecke mit Testdaten sauber durch? |
| `ARCHITECTURE.md` | Produktionsstandards: Auflösung, Codec, Ordnerstruktur, Namensschema | Datenmodell, Segmentlogik, Ausnahmeregeln |
| `code-reviewer` | Prüft den Schnitt gegen das Briefing | Prüft die Strecke gegen die Zielgruppendefinition |
| `qa` | Verständlich ohne Ton? Ohne Vorwissen? | Was passiert bei fehlendem Vorname, doppeltem Eintrag, Abmeldung? |
| `specs/` | Videokonzept vor der Produktion | Kampagnenkonzept vor dem Bau |
| `docs/adr/` | Warum diese Bildsprache, nicht die andere | Warum diese Segmentierung |

**Der einzige Teil, der Programmierarbeit verlangt**, ist ein Prüfskript,
das `npm run check` aufrufen kann. Notfalls reicht am Anfang ein Skript,
das eine Handvoll Dateien auf Existenz prüft — die Mechanik „ein Befehl,
der alles prüft" ist wichtiger als sein anfänglicher Umfang.

---

## Der Ehrlichkeits-Check

Wenn dir beim Durchgehen etwas auffällt, das **stackgebunden wirkt**,
obwohl es unter „Skelett" steht — das ist ein Fund, kein Feature. Notier
ihn. Genau so ist dieses Template entstanden: indem jemand ein bestehendes
Projekt Zeile für Zeile gefragt hat „gilt das wirklich überall?".
