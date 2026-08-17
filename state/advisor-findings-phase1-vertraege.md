<!--
Stand dieser Fassung: 17.08.2026
Advisor-Befunde zu state/plan-v1-phase1-vertraege.md, mit Nachprüfung.
Ziel-Pfad im Repo: state/advisor-findings-phase1-vertraege.md

Der Advisor lief in frischem Kontext, nur lesend, auf einem Dateiabzug des
Repos. Der Abzug war unvollständig — ihm fehlten .gitignore, .gitattributes,
docs/guide/, docs/onboarding/, docs/examples/, state/tasks/ und die
Zähne-Taxonomie. Er hat das selbst angezeigt. Jede Aussage unten wurde
danach gegen den echten Arbeitsstand nachgeprüft; die Spalte „Nachprüfung"
ist das Ergebnis, nicht die Behauptung des Advisors.

Evidenz-Marker: [Fakt] belegt · [Schlussfolgerung] abgeleitet ·
[Annahme] ungeprüft · [offene Unsicherheit] ungeklärt.
-->

# Advisor-Befunde — Phase 1, Plan v1

**Urteil des Advisors: Nicht freigegeben.** Vier blockierende Befunde,
zehn weitere. `[Schlussfolgerung]` Begründung des Urteils: Nicht die
Richtung war falsch, sondern vier Stellen, an denen ein Baudurchgang nach
Plan an einer Wand geendet hätte statt an einem Ergebnis.

---

## Die vier blockierenden Befunde

### F1 — V3.1 sprengt den PostToolUse-Hook und macht die Definition of Done unerfüllbar

`[Fakt, nachgeprüft]` `.claude/settings.json` ruft bei **jedem** `Edit`/`Write`
`npm run lint --silent` auf. V3.1 stellt `lint` von `echo` auf Exit 1 um.
Ergebnis: Nach jeder Dateiänderung im leeren Template scheitert der Hook —
Dauerrauschen auf stderr, das echte Hook-Fehler unsichtbar macht.
`[Fakt, nachgeprüft]` `CLAUDE.md:86` verlangt in der Definition of Done
`npm run check` → Exit 0. Nach V3.1 kann die Kette im leeren Template nie
grün werden. Die Abnahmekriterien der Verträge 1 und 2 messen damit etwas,
das ein späterer Vertrag abschafft.
`[Fakt]` `.claude/settings.json` stand in keiner Datei-Liste des Plans.

**Aufgelöst in v2:** Der PostToolUse-Lint-Hook wird aus dem Template
entfernt und als Schritt in `SETUP.md` verlagert — ein Lint-Hook ohne Linter
ist Dekoration mit Laufzeit. `CLAUDE.md` bekommt einen Satz, der `check`
und `check:template` unterscheidet. Beides im selben Vertrag wie V3.1.

### F2 — 2a ist unter dem heutigen Checkout wirkungslos

`[Fakt, nachgeprüft]` `.github/workflows/ci.yml` nutzt `actions/checkout@v5`
ohne `fetch-depth`. Der Default ist ein Shallow Clone mit genau einem
Commit. `--no-git` zu entfernen ändert damit nichts Messbares.
`[Schlussfolgerung]` Der Folgeeffekt ist ernster als der Fix: Mit voller
Historie meldet gitleaks jedes je committete Secret, dauerhaft, bei jedem
PR — ohne History-Rewrite unbehebbar. Das vom Plan verlangte
Abnahmekriterium (Testsecret in einen Commit schreiben) würde CI dauerhaft
rot setzen.

**Aufgelöst in v2:** `fetch-depth: 0` ergänzen. Entschieden am 17.08.2026:
wie geplant bauen. Die Baseline wird nicht als eigener Schritt vorgezogen,
sondern als **Stop-Grenze in den Vertrag gelegt** — gitleaks läuft zuerst
lokal über die volle Historie, und bei Funden hält der Vertrag an, bevor
`ci.yml` angefasst wird. Rot-Fall über einen Wegwerf-Branch, nie über `main`.

### F3 — Vertrag 1 kann sich selbst aussperren

`[Fakt, nachgeprüft]` `guard-settings.js` verweigert jeden `Edit`/`Write` auf
`.claude/settings.json`. V1.1 (SessionStart-Matcher) und der Commit-Guard
sind beides Änderungen an genau dieser Datei. `[Fakt]` Der dokumentierte
Ausweg im Hook selbst — „Hook temporär entfernen" — ist zirkulär: Ihn zu
entfernen heißt, dieselbe Datei zu editieren. Praktisch bleibt nur ein
Schreibvorgang per Bash, also genau die Lücke aus V1.6.
`[Schlussfolgerung]` Damit wird die Reihenfolge sicherheitskritisch: Wird die
Bash-Lücke vor den settings.json-Änderungen geschlossen, ist auch der letzte
Weg zu.

**Aufgelöst in v2:** Alle `settings.json`-Änderungen liegen vor dem Schließen
der Bash-Lücke. Jeder betroffene Vertrag enthält das Entschärfen und das
Wiederscharfstellen des Guards als zwei ausdrückliche, prüfbare
OUTPUT-Punkte.

### F5 — C1 bricht nicht nur einen Skill, sondern den Master-Kontext

`[Fakt, nachgeprüft]` Der Plan nannte nur `git-flow` Schritt 6–7. Der
eigentliche Widerspruch steht eine Ebene höher, in `CLAUDE.md:64-65`:
*„Iterationsende heißt: `git status` prüfen, Freigabe einholen, committen
UND pushen. Eine Bremse ohne Gaspedal erzeugt Halden."*
`[Schlussfolgerung]` Dieser Satz ist als Lehre aus einem realen Schaden
formuliert. C1 baut genau die Bremse ohne Gaspedal, gegen die er warnt.

**Aufgelöst in v2:** Entschieden am 17.08.2026: **C2**. Als einziges der drei
Modelle lässt es `CLAUDE.md:64-65` intakt — das Gaspedal bleibt, es braucht
nur einen Schlüssel.

---

## Die übrigen zehn Befunde

| Nr | Befund | Nachprüfung | Behandlung in v2 |
|---|---|---|---|
| F4 | Der Commit-Guard erbt die Fail-Open-Konvention der vier bestehenden Hooks. Ein Guard muss fail-closed sein. Ungenannte Umgehungsformen: `git -C`, `bash -c`, verkettete Befehle, `--amend`, `--force` | `[Fakt]` bestätigt — alle vier Hooks kehren bei Fehler still mit Exit 0 zurück | Fail-closed als ausdrückliche Vertragszeile. Umgehungsformen als Rot-Fälle. Die Unabschließbarkeit bei freier Shell als `[offene Unsicherheit]` in den Vertrag, nicht als stille Annahme in den Hook |
| F6 | Prüfung 2 auf Skills erzeugt **neun** Fehlalarme, nicht einen. Sieben davon treffen „Plan v1"/„Plan v2" — den Kernbegriff des eigenen Advisor-Verfahrens | `[Fakt]` bestätigt und schlimmer als beschrieben | Entscheidung bleibt (nur Prüfung 1 ausweiten), **Begründung wird ausgetauscht**. Vollständige Trefferliste als dokumentierter Grün-Fall in `state/gates.md`, damit niemand die Ausweitung in sechs Monaten erneut versucht |
| F7 | Der Umfang von 3b ist falsch beziffert | `[Fakt]` halb falsch, Kernaussage verstärkt: README und SETUP haben **0** Vorkommen (Advisor hatte recht), aber `docs/guide/` und `docs/onboarding/` haben zusammen **13**, die er nicht sehen konnte. Gesamt: **24 Vorkommen in 11 Dateien** | Trägt die Vertagung von 3b |
| F8 | `check-contract.mjs` hat keine widerspruchsfreie Quelle: `handoff-vertrag/SKILL.md` schreibt „die sieben Sektionen" und listet acht. Dazu zwei Fehlerpfade — fehlendes `state/tasks/` wirft, leeres `state/tasks/` liefert ein grünes Gate, das nichts geprüft hat | `[Fakt]` bestätigt | Erst die Quelle korrigieren, dann den Checker. Leeres Verzeichnis → Exit 0 mit sichtbarer Meldung „0 Verträge geprüft", nicht stilles Grün |
| F9 | Vertrag 1 und 3 verletzen die Zuschnitt-Regel des Repos selbst (`CLAUDE.md:68-72`). Vertrag 2 ist mustergültig | `[Schlussfolgerung]` überzeugend | Entschieden: aufteilen. Vier Verträge |
| F10 | `state/gates.md` steht nur in der Liste von Vertrag 3, wird aber von jedem Vertrag gebraucht. Zusätzlich verlangt die Datei Rot- **und** Grün-Fall; der Plan verlangte nur Rot | `[Fakt]` bestätigt | `state/gates.md` in alle vier Datei-Listen. Beide Fälle je Gate |
| F11 | Beide Begründungen für die strenge Serialität halten nicht. Die Reihenfolge stimmt aus einem dritten Grund: V3.1 zerstört die Messlatte, an der die früheren Verträge gemessen werden | `[Schlussfolgerung]` überzeugend | Begründung ausgetauscht. Eine falsche Begründung für eine richtige Reihenfolge ist gefährlicher als keine |
| F12 | Der Plan setzt einen grünen Ausgangsstand voraus, ohne ihn festzustellen | `[Fakt]` Der konkrete Beleg ist **falsch** (Artefakt des unvollständigen Abzugs): `npm run check` läuft heute grün, Exit 0, „Keine Befunde". Der methodische Punkt bleibt | Ausgangsstand als `[Fakt]` in v2. SCHRITT 0 jedes Vertrags protokolliert ihn erneut |
| F13 | Neue Zustandsartefakte ohne Eintrag in der Memory Map (Freigabe-Datei aus C2). Nebenbefund: `specs/` existiert nicht. Nebenbefund: gitleaks fehlt in `state/tooling.md` | `[Fakt]` `specs/` **existiert** (mit `.gitkeep`) — Abzugs-Artefakt. Memory-Map-Punkt und gitleaks-Punkt bestätigt | Freigabe-Datei bekommt eine Zeile in `memory-map.md`. gitleaks wird in `state/tooling.md` nachgetragen |
| F14 | 3b löst die Node-Bindung nicht, sondern nur ihre sichtbarste Stelle. Die eigentliche Frage ist: Ist das Harness node-gebunden — ja oder nein? | `[Fakt]` bestätigt: fünf Hook-Aufrufe über `node`, `engines`, CI-Toolchain | Entschieden: 3b nach Phase 2. Die Node-Bindung wird nach der Quellenregel des README als Fund notiert, nicht halb gefixt |

---

## Entlastende Befunde

`[Fakt, entlastend]` Die Ist-Zustands-Erhebung von Plan v1 wurde in drei von
vier Punkten unabhängig bestätigt: getrennte Geltungsbereiche von Prüfung 1
und 2 · der Regelwiderspruch an der vendorten `ponytail`-Datei · das
Nicht-Erfassen von `.yml` durch das Pfad-Muster.

`[Fakt, entlastend]` **Die Selbstanwendungs-Sorge ist geprüft und
unbegründet.** Der Advisor hat das Pfad-Muster von Prüfung 1 gegen alle
sieben Skills und `commands/lessons.md` laufen lassen: genau **ein** Treffer,
`spec-schreiben/SKILL.md:88` → `state/triage.md`. Die Ausweitung erzeugt
keine unbekannten Befunde.

`[Fakt, entlastend]` Der Plan selbst besteht die Prüfkette: ein Stand-Marker,
kein jüngeres Datum, Prüfung 5 greift nicht.

`[Fakt, entlastend]` Der Abschnitt „Was ausdrücklich nicht in Phase 1
gehört" wurde als stärkste Stelle des Plans bewertet, einschließlich der
Vorwegnahme des „wäre jetzt einfach"-Arguments.

---

## Was der Advisor nicht prüfen konnte

`[offene Unsicherheit]` Zähne-Taxonomie, `.gitattributes` (damit offener
Punkt A vollständig), `.gitignore`, `docs/guide/*`, `docs/onboarding/*`, die
drei belegten Vorfälle zum Commit-Guard. Seine Aussagen zu diesen Stellen
sind weder bestätigt noch widerlegt — mit Ausnahme derer, die oben
nachgeprüft wurden.

`[Schlussfolgerung]` Lehre für den nächsten Pass: Der Abzug muss vollständig
sein, sonst kostet jeder Befund eine Nachprüfung. Vier von vierzehn Befunden
waren Abzugs-Artefakte. Das ist keine Schwäche des Verfahrens, sondern eine
des Aufbaus — und gehört als Reibungseintrag notiert, sobald
`state/reibung.md` existiert (N9).
