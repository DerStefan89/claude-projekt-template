<!--
Stand dieser Fassung: 17.08.2026
Plan v2 für Phase 1. Ziel-Pfad im Repo: state/plan-v2-phase1-vertraege.md

Entstanden aus state/plan-v1-phase1-vertraege.md nach dem Advisor-Pass.
v1 bleibt unverändert stehen — sonst ist nicht belegbar, was der Pass
bewirkt hat. Befunde: state/advisor-findings-phase1-vertraege.md

Evidenz-Marker: [Fakt] belegt · [Schlussfolgerung] abgeleitet ·
[Annahme] ungeprüft · [offene Unsicherheit] ungeklärt.
-->

# Plan v2 — Phase 1: vier Verträge

## Was sich gegenüber v1 geändert hat

| | v1 | v2 |
|---|---|---|
| Verträge | 3 | **4** — 1a wurde eigenständig (F9) |
| Umfang | 13 Positionen | **12** — 3b wandert nach Phase 2 (F14) |
| Commit-Guard | offen (C1/C2/C3) | **C2**, Einmal-Freigabe (F5) |
| gitleaks | `--no-git` entfernen | zusätzlich `fetch-depth: 0`, plus Stop-Grenze vor `ci.yml` (F2) |
| PostToolUse-Lint | nicht betrachtet | **wird entfernt** und nach `SETUP.md` verlagert (F1) |
| Reihenfolge | zwei Begründungen, beide falsch | eine, die trägt (F11) |
| `state/gates.md` | nur in Vertrag 3 | in allen vier Datei-Listen, Rot- **und** Grün-Fall (F10) |
| Ausgangsstand | stillschweigend angenommen | `[Fakt]` belegt (F12) |

## Ausgangsstand, belegt

`[Fakt]` Am 17.08.2026, Branch `main` nach Merge `c58bb0b`, Arbeitsbaum
sauber: `npm run check` läuft mit **Exit 0** durch. Doku-Check „Keine
Befunde", Regel-Check „Keine Regeln registriert", `lint`/`typecheck`/`test`
geben ihren Platzhaltertext aus und enden mit 0.

`[Schlussfolgerung]` Das ist der Nullpunkt, gegen den jede Abnahme dieser
Phase gemessen wird. „Grün am Ende" ohne „grün am Anfang" ist keine Aussage.

---

## Die vier Verträge

### Vertrag 1 — `harness-fix-1-hooks-und-zwischenstand`

Fasst an: `.claude/settings.json`, `LICENSE` (neu),
`state/zwischenstand/VORLAGE.md`, `state/memory-map.md`, `.gitattributes`,
`docs/guide/02-DEEPDIVE-claude-ordner.md`, `state/gates.md`.

| Nr | Was |
|---|---|
| V1.1 | `clear` in den SessionStart-Matcher |
| V1.2 | LICENSE (MIT) |
| V1.3 | Zeichengrenze in `VORLAGE.md` an `MAX_ZEICHEN` des Hooks angleichen |
| V1.4 | `specs/`-Zeile in `state/memory-map.md` |
| V1.5 | `working-tree-encoding` aus `.gitattributes` entfernen — Punkt A entschieden, siehe unten |
| V1.6 | Grenze von `guard-settings.js` dokumentieren (nur dokumentieren) |

**Abnahme:** `npm run check` Exit 0 · nach `/clear` wird ein vorhandener
Zwischenstand geladen, von Hand gegengeprüft · Rot- und Grün-Fall für den
Zwischenstand-Loop in `state/gates.md`.

### Vertrag 2 — `harness-fix-2-commit-guard`

Fasst an: `.claude/settings.json`, `.claude/hooks/commit-guard.js` (neu),
`.claude/hooks/guard-settings.js`, `state/memory-map.md`, `.gitignore`,
`state/gates.md`, `docs/guide/03-DEEPDIVE-gates.md`.

| Nr | Was |
|---|---|
| 1a | Commit-/Push-Guard als PreToolUse-Hook auf `Bash`, Bauform **C2** |
| B | Bash-Lücke von `guard-settings.js` schließen — **nach** allen `settings.json`-Änderungen |

**Bauform C2, festgelegt:** Der Hook weist `git commit` und `git push` ab,
solange keine Freigabe-Datei vorliegt. Liegt sie vor, lässt er den Befehl
durch und **löscht sie im selben Lauf**. Eine Freigabe gilt für genau einen
Commit.

`[Schlussfolgerung]` Warum C2 und nicht C1: `CLAUDE.md:64-65` verlangt
ausdrücklich, dass am Iterationsende committet **und** gepusht wird — „eine
Bremse ohne Gaspedal erzeugt Halden". C2 lässt diesen Satz intakt.

**Fail-closed, ausdrücklich (F4):** Anders als die vier bestehenden Hooks
kehrt dieser bei einem Fehler **nicht** still mit Exit 0 zurück. Kann er
seine Eingabe nicht lesen, blockiert er. `[Schlussfolgerung]` Ein Guard, der
bei Störung durchlässt, ist kein Guard.

`[offene Unsicherheit]` Die Liste der Umgehungsformen — `git -C <pfad>`,
`bash -c "git commit"`, verkettete Befehle, `--amend`, `push --force` — ist
bei freier Shell nicht abschließend zu schließen. Das gehört als offene
Unsicherheit in den Vertrag und als Rot-Fall-Liste in `state/gates.md`, nicht
als stille Annahme in den Hook.

**Abnahme:** Commit ohne Freigabe-Datei wird abgewiesen · Commit mit
Freigabe-Datei läuft durch, danach ist die Datei weg · ein zweiter Commit
ohne neue Freigabe wird wieder abgewiesen · mindestens drei Umgehungsformen
als Rot-Fall dokumentiert · Freigabe-Datei in `.gitignore` und in
`state/memory-map.md`.

### Vertrag 3 — `harness-fix-3-dokugate-und-ci`

Fasst an: `scripts/check-docs.mjs`, `.github/workflows/ci.yml`,
`.claude/skills/spec-schreiben/SKILL.md`, `state/tooling.md`,
`state/gates.md`.

| Nr | Was |
|---|---|
| V2.1 | **Nur Prüfung 1** um `.claude/skills/*/SKILL.md` und `.claude/commands/*.md` erweitern |
| V2.1b | Toten Verweis auf `state/triage.md` beheben — Punkt E entschieden, siehe unten |
| V2.2 | gitleaks-Image auf einen festen Tag pinnen |
| V2.2b | `permissions: contents: read` auf Workflow-Ebene |
| 2a | `--no-git` entfernen **und** `fetch-depth: 0` setzen |
| — | gitleaks in `state/tooling.md` nachtragen (F13) |

**Warum nur Prüfung 1 (F6, neue Begründung):** `[Fakt]` Das Versionsmuster
von Prüfung 2 trifft in den Skills neunmal. Sieben dieser Treffer sind
„Plan v1" und „Plan v2" — der Kernbegriff des `advisor-pass`-Verfahrens,
kein Fremdtext, den man ausklammern könnte. Der achte und neunte ist der
Versionspin der vendorten `ponytail`-Datei, der eine Pflicht aus
`werkzeug-auswahl` Schritt 4 erfüllt. `[Schlussfolgerung]` Prüfung 2 ist auf
Skills nicht „mit einem Sonderfall behaftet", sondern strukturell
unbrauchbar, solange ihr zweites Muster ein `[FÜLLUNG]`-Platzhalter aus
einem fremden Stack ist. Die vollständige Trefferliste gehört als Grün-Fall
nach `state/gates.md` — sonst versucht es in sechs Monaten jemand erneut.

**Stop-Grenze gitleaks (F2):** Bevor `ci.yml` angefasst wird, läuft gitleaks
einmal lokal über die **volle Historie**. Findet er etwas, hält der Vertrag
an und meldet. `[Schlussfolgerung]` Sonst ist der erste Hinweis auf eine
Altlast ein dauerhaft rotes CI, das jeden Merge blockiert.

**Abnahme:** `npm run check` meldet den toten Verweis vor der Behebung und
ist danach Exit 0 · lokaler Historien-Scan sauber oder gemeldet · CI grün ·
Rot-Fall über einen Wegwerf-Branch, **nie über `main`** · Trefferliste
Prüfung 2 als Grün-Fall in `state/gates.md`.

### Vertrag 4 — `harness-fix-4-pruefkette-und-vertragspruefung`

Fasst an: `package.json`, `scripts/check-contract.mjs` (neu),
`.claude/settings.json`, `.claude/skills/handoff-vertrag/SKILL.md`,
`CLAUDE.md`, `.github/workflows/ci.yml`, `SETUP.md`, `state/gates.md`.

| Nr | Was |
|---|---|
| V3.1 | `lint`, `typecheck`, `test` von `echo` auf Exit 1 mit lesbarer Meldung |
| V3.2 | `check:template` als Kette aus `check-docs`, `check-rules`, `check-contract`; CI ruft diese auf |
| 3a | `scripts/check-contract.mjs` |
| F1a | PostToolUse-Lint-Hook aus `.claude/settings.json` entfernen, als Schritt nach `SETUP.md` |
| F1b | `CLAUDE.md`: ein Satz, der `check` und `check:template` unterscheidet |

**Warum der Lint-Hook weichen muss (F1):** `[Fakt]` Er ruft `npm run lint`
nach jedem `Edit`/`Write`. Sobald `lint` ehrlich mit Exit 1 endet, scheitert
er im leeren Template nach jeder Dateiänderung. `[Schlussfolgerung]` Ein
Lint-Hook ohne Linter ist Dekoration mit Laufzeit — dieselbe Fehlerklasse
wie ein grünes Platzhalter-Gate, nur an anderer Stelle. Er gehört in
`SETUP.md` zu dem Schritt, an dem ein echter Linter eingerichtet wird.

**Erst die Quelle, dann der Checker (F8):** `[Fakt]`
`handoff-vertrag/SKILL.md` schreibt „die sieben Sektionen" und listet acht.
Diese Zahl wird zuerst korrigiert. `check-contract.mjs` prüft danach die
sieben harten Elemente (SCHRITT 0, `TASK`, `GOAL`, `CONTEXT`,
`SCOPE`/`NICHT`, `BUDGET`, `OUTPUT`, `ESCALATE`) und **nicht** `FOLGT` —
das ist eine bedingte Regel, die ein Exit-Code schlecht abbildet.

**Beide Fehlerpfade ausdrücklich (F8):** Fehlendes `state/tasks/` → Exit 0
mit Meldung, kein Absturz. Leeres `state/tasks/` → Exit 0 mit sichtbarer
Meldung „0 Verträge geprüft", kein stilles Grün.

**Abnahme:** `check:template` Exit 0 · `check` Exit 1 mit lesbarer Meldung ·
`check-contract.mjs` wird an einem absichtlich verstümmelten Vertrag rot und
an den vier echten grün · fehlendes und leeres `state/tasks/` je einmal
durchgespielt · CI grün mit `check:template`.

---

## Reihenfolge

```
Vertrag 1 ──▶ Vertrag 2 ──▶ Vertrag 3 ──▶ Vertrag 4
```

**Eine Begründung, und sie trägt (F11):** Vertrag 4 zerstört die Messlatte.
`[Fakt]` Nach V3.1 kann `npm run check` im leeren Template nie mehr Exit 0
liefern. Die Verträge 1 bis 3 definieren ihre Abnahme über genau diesen
Exit-Code. Also muss 4 zuletzt kommen.

`[Fakt]` Zweite, unabhängige Bindung: Vertrag 2 schließt die Bash-Lücke.
Deshalb steht das Schließen am **Ende** von Vertrag 2, nach der
Hook-Registrierung.

**Die Regel, die daraus folgt und ab Vertrag 2 dauerhaft gilt (F3):**

> `.claude/settings.json` wird ausschließlich vom Menschen geändert, in
> seinem eigenen Editor. Das Modell schreibt die Datei nie — weder per
> `Edit`/`Write` noch per Bash. Wo eine Änderung nötig ist, liefert es den
> exakten Zielinhalt und hält an.

`[Schlussfolgerung]` Das ist keine neue Einschränkung, sondern die Absicht,
die `guard-settings.js` seit jeher hat: Die Datei ist Team-Policy. Der im
Hook dokumentierte Ausweg („Hook temporär entfernen") war zirkulär und wird
in Vertrag 2 durch diesen Satz ersetzt. Betroffen sind drei Stellen: V1.1 in
Vertrag 1, die Hook-Registrierung in Vertrag 2, das Entfernen des
Lint-Hooks in Vertrag 4 — alle drei gehen über den Menschen.

`[Schlussfolgerung]` Die beiden Begründungen aus v1 sind gestrichen. Die
erste war ein Wunsch, keine Abhängigkeit; die zweite war schlicht falsch —
`check-docs.mjs` läuft in beiden Ketten.

---

## Entschiedene offene Punkte

**A — `working-tree-encoding`: entfernen.** `[Fakt]` Getestet wirkungslos.
`[Schlussfolgerung]` Eine Zeile, die etwas verspricht, was sie nicht hält,
ist genau die Fehlerklasse dieses ganzen Programms. `[offene Unsicherheit]`
Ob das Attribut in anderer Umgebung wirkt, bleibt ungeprüft; das wird im
Commit als Begründung mitgeschrieben, damit ein späterer Wiedereinbau nicht
als Neuentdeckung auftritt.

**B — Bash-Lücke: schließen, aber als eigene Position in Vertrag 2.** Sie
wird mit dem Commit-Guard zusammen gebaut, weil beide denselben
`Bash`-Matcher brauchen. V1.6 (dokumentieren) bleibt in Vertrag 1 und wird
in Vertrag 2 nachgezogen.

**C — Commit-Guard: C2.** Siehe Vertrag 2.

**D — Nur Prüfung 1 wird ausgeweitet.** Siehe Vertrag 3.

**E — `state/triage.md`: Verweis auf `state/tasks/` umbiegen.**
`[Schlussfolgerung]` Von drei Möglichkeiten die einzige, die keine neue
Zustandsdatei erzeugt. Eine Datei anzulegen, die niemand angefordert hat,
wäre nach der Quellenregel des README ein Feature aus einem Fund.

**F — `check-contract.mjs`: sieben harte Elemente, `FOLGT` nicht.** Siehe
Vertrag 4.

**G — Prüfbefehl-Indirektion: vertagt nach Phase 2.** `[Fakt]` 24 Vorkommen
in 11 Dateien, davon 13 in `docs/guide/` und `docs/onboarding/`.
`[Schlussfolgerung]` Der Nutzen hängt an einer ungeklärten Grundsatzfrage —
ist das Harness node-gebunden? Fünf Hook-Aufrufe laufen über `node`, dazu
`engines` und die CI-Toolchain. Solange die Frage offen ist, macht 3b die
Doku an einer Stelle ehrlicher und die Mechanik keinen Deut portabler.
**Die Node-Bindung wird stattdessen als Fund notiert**, nach der Quellenregel
des README.

---

## Was ausdrücklich nicht in Phase 1 gehört

Prüfbefehl-Indirektion (3b, jetzt Phase 2) · Fixtures für die fünf Prüfungen
(N4) · Platzhalter-Check und Zeilengrenze (N7, N8) · Ausweitung von
Prüfung 5 (N6) · Findings-Ablage (N14) · Bestandstestsatz (R3) · das
Anpassen des `[FÜLLUNG]`-Musters in Prüfung 2, obwohl F6 zeigt, wie kaputt
es ist. `[Fakt]` Auch dann nicht, wenn eine dieser Sachen beim Bauen als
„wäre jetzt einfach" auffällt.
