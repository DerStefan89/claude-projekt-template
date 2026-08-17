<!--
Stand dieser Fassung: 17.08.2026
Plan v1 für Phase 1 des Harness-Fix-Programms. Ziel-Pfad im Repo:
state/plan-v1-phase1-vertraege.md

Dies ist v1 — der Stand VOR dem Advisor-Pass. Nicht überschreiben; v2
entsteht als eigene Datei, damit belegbar bleibt, was der Advisor bewirkt
hat.

Evidenz-Marker: [Fakt] belegt · [Schlussfolgerung] abgeleitet ·
[Annahme] ungeprüft · [offene Unsicherheit] ungeklärt.
-->

# Plan v1 — Phase 1: drei Verträge plus vier Ergänzungen

## Ausgangslage

`[Fakt]` Die im Register erwähnten Verträge 1–3 existieren nicht als Datei
— weder in `claude-projekt-template/state/tasks/` noch in
`ClaudePlaybook/tasks/`. Sie stammen aus früheren Chats. Entschieden am
17.08.2026: neu schreiben, mit vollem Prozess.

`[Fakt]` Repo-Stand: `main`, Merge `c58bb0b` (Zähne-Taxonomie), Arbeitsbaum
sauber. `programm/` ist gitignoriert.

`[Fakt]` Umfang: neun Befunde aus Gruppe 1 (V1.1–V1.6, V2.1, V2.2, V3.1)
plus vier Ergänzungen (1a, 2a, 3a, 3b) plus die Torbedingung aus N3 — je ein
dokumentierter Rot-Fall pro neuem Gate.

---

## Befunde aus der Ist-Zustands-Prüfung

Vor dem Planen gelesen, nicht angenommen. Vier Dinge, die den Zuschnitt
verändern:

**(1) `[Fakt]` Prüfung 1 und Prüfung 2 haben getrennte Geltungsbereiche.**
Prüfung 1 läuft über `anweisungsDateien` (CLAUDE.md, ARCHITECTURE.md,
README.md, `.claude/agents/*.md`). Prüfung 2 läuft über eine *fest
verdrahtete* Liste: `['CLAUDE.md', 'ARCHITECTURE.md']` — nicht einmal
README.md. V2.1 sagt nur „Doku-Gate erfasst Skills und Commands nicht" und
lässt offen, welche Prüfung gemeint ist.

**(2) `[Fakt]` Würde Prüfung 2 auf Skills ausgeweitet, schlägt sie sofort
zu — und zwar zu Unrecht.** `.claude/skills/ponytail/SKILL.md` trägt im
Herkunftskommentar eine Versionsangabe. Das Muster `/\bv?\d+\.\d+\.\d+\b/`
trifft sie. `[Schlussfolgerung]` Diese Angabe ist nicht der Fehler, den
Prüfung 2 sucht, sondern eine ausdrückliche Pflicht aus `werkzeug-auswahl`
Schritt 4 („Version pinnen und Herkunft dokumentieren"). Zwei Regeln des
Harness widersprechen sich hier.

**(3) `[Fakt]` Der belegte tote Verweis ist bestätigt:**
`.claude/skills/spec-schreiben/SKILL.md:88` verweist auf `state/triage.md`.
Die Datei existiert nicht. Kein weiterer toter Verweis in Skills oder
Commands — die übrigen drei Treffer (`architecture-advisor.md`,
`state/tooling.md`, `state/`) lösen auf oder werden vom Muster nicht erfasst.

**(4) `[Fakt]` Das Muster von Prüfung 1 erfasst `.yml` nicht.** Verweise auf
`.github/workflows/ci.yml` bleiben ungeprüft. `[Schlussfolgerung]` Nicht Teil
von V2.1, aber dieselbe Fehlerklasse — gehört in denselben Vertrag oder
ausdrücklich nicht.

---

## Der Zuschnitt: drei Verträge

Jeder Vertrag ist ein Baudurchgang mit eigenständig prüfbarem Artefakt und
fasst nur Dateien an, die inhaltlich zusammengehören.

### Vertrag 1 — Hooks, Permissions, Zwischenstand-Loop

Fasst an: `.claude/settings.json`, `.claude/hooks/`, `LICENSE`,
`state/zwischenstand/VORLAGE.md`, `state/memory-map.md`, `.gitattributes`,
`docs/guide/02-DEEPDIVE-claude-ordner.md`.

| Nr | Was | Wie |
|---|---|---|
| V1.1 | `clear` im SessionStart-Matcher | Matcher zu `startup\|resume\|compact\|clear\|fork` erweitern |
| V1.2 | LICENSE | MIT-Datei anlegen, Jahr und Inhaber setzen |
| V1.3 | Zeichengrenze | `VORLAGE.md` auf denselben Wert wie `MAX_ZEICHEN` im Hook ziehen |
| V1.4 | `specs/`-Zeile | Zeile in `state/memory-map.md` ergänzen, inklusive „nicht hierhin" |
| V1.5 | `working-tree-encoding` | Attribut entfernen — siehe offener Punkt A |
| V1.6 | Grenze von `guard-settings.js` | Dokumentieren, nicht schließen — siehe offener Punkt B |
| **1a** | **Commit-/Push-Guard** | Neuer PreToolUse-Hook auf `Bash` — siehe offener Punkt C |

**Prüfbares Artefakt:** `npm run check` grün · nach `/clear` wird ein
vorhandener Zwischenstand geladen (von Hand gegengeprüft) · ein Commit-Versuch
ohne Freigabe wird nachweislich abgewiesen.

### Vertrag 2 — Doku-Gate und CI

Fasst an: `scripts/check-docs.mjs`, `.github/workflows/ci.yml`,
`.claude/skills/spec-schreiben/SKILL.md`.

| Nr | Was | Wie |
|---|---|---|
| V2.1 | Prüfung 1 erfasst Skills und Commands | `anweisungsDateien` um `.claude/skills/*/SKILL.md` und `.claude/commands/*.md` erweitern. **Nur Prüfung 1** — siehe offener Punkt D |
| V2.1b | Toter Verweis beheben | `state/triage.md` in `spec-schreiben/SKILL.md:88` — siehe offener Punkt E |
| V2.2 | gitleaks fixieren | `:latest` durch einen festen Versions-Tag ersetzen |
| V2.2b | CI-Rechte | `permissions: contents: read` auf Workflow-Ebene ergänzen |
| **2a** | **Historie mitscannen** | `--no-git` entfernen |

**Prüfbares Artefakt:** `npm run check` meldet den toten Verweis, solange er
besteht, und ist danach grün · CI läuft grün · ein testweise eingefügtes
Secret im Arbeitsstand **und** eines in einem früheren Commit werden beide
gemeldet.

### Vertrag 3 — Prüfkette, Vertragsprüfung, Indirektion

Fasst an: `package.json`, `scripts/check-contract.mjs` (neu),
`.github/workflows/ci.yml`, `README.md`, `SETUP.md`, `CLAUDE.md`,
`state/gates.md`, `docs/guide/03-DEEPDIVE-gates.md`.

| Nr | Was | Wie |
|---|---|---|
| V3.1 | Platzhalter-Gates ehrlich machen | `lint`, `typecheck`, `test` von `echo` auf einen Befehl umstellen, der mit Exit 1 und lesbarer Meldung endet |
| V3.2 | `check:template` | Neue Kette aus den Prüfungen, die im leeren Template tragen: `check-docs`, `check-rules`, `check-contract`. CI ruft **diese** auf |
| **3a** | **`scripts/check-contract.mjs`** | Prüft jede Datei unter `state/tasks/` auf SCHRITT 0 und die Sektionen — siehe offener Punkt F |
| **3b** | **Prüfbefehl-Indirektion** | Skelett-Dokumente sprechen nur noch vom „Prüfbefehl" — siehe offener Punkt G |

**Prüfbares Artefakt:** `check:template` grün · `check` rot mit lesbarer
Meldung · `check-contract.mjs` wird an einem absichtlich verstümmelten
Vertrag rot.

### Quer über alle drei: die Torbedingung

`[Fakt]` Tor laut Register: **je ein dokumentierter Rot-Fall pro neuem Gate**
in `state/gates.md`. `[Schlussfolgerung]` Aus der Zähne-Taxonomie (S41)
folgt, dass das der eigentliche Inhalt dieser Phase ist, nicht ihr Anhang:
Die Kalibrierungspflicht ist selbst nur Text, deshalb stehen heute fünf von
sieben Gates auf `[FÜLLUNG]`. Ohne Gegenmaßnahme enden die neuen genauso.

**Vorschlag:** Jeder der drei Verträge trägt den Rot-Fall-Nachweis in seiner
eigenen `OUTPUT`-Sektion, nicht als vierten Vertrag am Ende. Ein
Kalibrierungs-Nachtrag, der als eigener Schritt geplant ist, ist der
Schritt, der wegfällt.

---

## Reihenfolge und Abhängigkeiten

```
Vertrag 1 ──▶ Vertrag 2 ──▶ Vertrag 3
```

`[Schlussfolgerung]` Streng seriell, aus zwei Gründen: Vertrag 1 baut den
Commit-Guard, der ab dann für Vertrag 2 und 3 selbst gilt — das ist der
erste echte Test des Guards. Und Vertrag 3 baut die Prüfkette um, die
Vertrag 2 noch in der alten Form braucht.

`[Annahme]` Ein Baudurchgang plus eine Korrekturrunde je Vertrag. Bei zehn
Wochenstunden entspricht der Tagesansatz aus dem Register etwa einer halben
Woche.

---

## Offene Punkte — nicht stillschweigend entschieden

### A — `working-tree-encoding`: entfernen oder mit Begründung stehen lassen?

`[Fakt]` Getestet wirkungslos (V1.5). `[Fakt]` `.gitattributes` trägt die
Zeile `* text=auto eol=lf working-tree-encoding=UTF-8`, und der Kommentar
darüber begründet ausführlich den `eol=lf`-Teil, nicht das Encoding.
`[offene Unsicherheit]` Ob das Attribut in einer anderen Umgebung (anderes
Git, anderer Editor) doch wirkt, ist nicht geprüft — „getestet wirkungslos"
bezieht sich auf eine Konfiguration.

Ein No-op zu entfernen ist billig; ihn stehen zu lassen erzeugt eine Zeile,
die etwas verspricht, was sie nicht hält — genau die Fehlerklasse, gegen die
das ganze Programm läuft.

### B — `guard-settings.js`: Bash-Lücke schließen oder nur dokumentieren?

`[Fakt]` Der Hook matcht `Edit|Write`. Ein Schreibvorgang per Bash
(`echo >`, `sed -i`) umgeht ihn. `[Fakt]` Das Register verlangt unter V1.6
nur, die Grenze zu dokumentieren.

`[Schlussfolgerung]` Wenn Vertrag 1 ohnehin einen `Bash`-Matcher-Hook
einführt (1a), ist die Lücke mit wenigen Zeilen im selben Hook zu schließen.
Die Frage ist, ob das Zuschnittserweiterung ist oder eine natürliche
Mitnahme.

### C — Wie genau bremst der Commit-Guard? (die wichtigste Entscheidung)

`[Fakt]` Drei belegte Vorfälle, Beförderungsregel erfüllt. `[Fakt]` Ein
PreToolUse-Hook greift vor der Permission-Prüfung — er ist damit stärker als
der Wildcard-Eintrag aus Vorfall (b), der genau diese Ebene unterlaufen hat.

Drei Bauformen, alle drei mit Preis:

| Form | Wie | Preis |
|---|---|---|
| **C1 Hart** | Jeder `git commit`/`git push` wird abgewiesen; der Mensch committet selbst | `[Fakt]` Widerspricht `git-flow` Schritt 6–7, wo das Modell nach Freigabe committet. Eine Regel, die eine andere bricht |
| **C2 Einmal-Freigabe** | Der Mensch legt eine Freigabe-Datei an; der Hook prüft sie und **verbraucht** sie | Zwei-Schlüssel-Prinzip, mechanisch durchgesetzt. Mehr Code, neue Datei, neuer Handgriff je Commit |
| **C3 Weich** | Hook warnt, blockiert nicht | `[Schlussfolgerung]` Erzeugt eine Selbstauskunft mit Wecker — genau das, was die Taxonomie als H6 bereits kennt. Löst N1 nicht |

`[Schlussfolgerung]` C3 scheidet aus, weil es den Befund nicht behebt.
Zwischen C1 und C2 entscheidet, ob „Freigabe" ein gesprochenes Wort bleiben
darf oder ein Artefakt werden muss. `[offene Unsicherheit]` Bei C2 ungeklärt:
Was passiert bei `git commit --amend`, bei einem Commit aus einem
Worktree, und wie verhindert man, dass die Freigabe-Datei aus Bequemlichkeit
dauerhaft liegen bleibt.

### D — Welche Prüfungen werden auf Skills und Commands ausgeweitet?

`[Fakt]` Prüfung 2 auf Skills auszuweiten erzeugt sofort einen Fehlalarm an
der vendorten `ponytail`-Datei, deren Versionsangabe eine Pflicht aus
`werkzeug-auswahl` erfüllt.

**Vorschlag:** nur Prüfung 1 ausweiten. Prüfung 2 bleibt bei den beiden
Regeldateien. `[Schlussfolgerung]` Die Alternative — Prüfung 2 ausweiten und
die ponytail-Zeile mit `check-docs-ignore:` versehen — beschädigt die
Eigenschaft „unverändert kopiert, kein fremder Code angefasst", die den
Herkunftsnachweis dieser Datei trägt.

`[offene Unsicherheit]` Ob Prüfung 3 (Stand-Marker) auf Skills gehört, ist
gar nicht gestellt worden. Skills tragen heute keinen Marker.

### E — Was wird aus `state/triage.md`?

`[Fakt]` `spec-schreiben/SKILL.md:88` nennt in einer Abgrenzungstabelle
„Backlog → `specs/` + `state/triage.md`". Die Datei existiert nicht und ist
in `memory-map.md` nicht vorgesehen.

Drei Möglichkeiten: Verweis streichen · auf `state/tasks/` umbiegen ·
`state/triage.md` tatsächlich anlegen und in die Memory Map aufnehmen.
`[Schlussfolgerung]` Die dritte erzeugt eine neue Zustandsdatei, die niemand
angefordert hat — nach der Quellenregel des Repos wäre das ein Feature aus
einem Fund.

### F — Wie streng prüft `check-contract.mjs`?

`[Fakt]` Der `handoff-vertrag`-Skill nennt inzwischen **acht** Elemente:
SCHRITT 0, `TASK`, `GOAL`, `CONTEXT`, `SCOPE`/`NICHT`, `BUDGET`, `OUTPUT`,
`ESCALATE` — und `FOLGT`, das nur dann Pflicht ist, *wenn* die NICHT-Liste
Arbeit vertagt. `[Schlussfolgerung]` Sieben Elemente sind hart prüfbar, das
achte ist bedingt und damit genau die Sorte Regel, die ein Exit-Code schlecht
abbildet.

`[Fakt]` Der bereits existierende Vertrag
`state/tasks/phase0-artefakte-committen.md` hat keine `FOLGT`-Sektion. Er
vertagt auch nichts — nach der Regel korrekt, nach einer naiven Prüfung rot.
Das ist der erste Testfall.

`[offene Unsicherheit]` Ob Evidenz-Marker im `CONTEXT` erzwungen werden
sollen (mindestens einer), ist offen. Prüfbar wäre es.

### G — Wo steht der Prüfbefehl, wenn nicht in der Doku?

`[Fakt]` `npm run check` steht heute in README, SETUP, CLAUDE.md,
`state/gates.md` und halbem Guide (N5). Für ein Solidity- oder
Videoprojekt ist das falsch.

`[offene Unsicherheit]` Die Indirektion braucht eine Quelle. `package.json`
als Quelle zu nennen löst das Problem nicht, weil `package.json` selbst
node-gebunden ist. Ein eigener Träger (etwa eine Zeile in `state/gates.md`
oder eine eigene Datei) wäre stackneutral, ist aber eine neue Konvention —
und neue Konventionen sind teuer.

`[Annahme]` Der Umbau betrifft nur Skelett-Dokumente. Der Guide ist
Erklärtext und darf konkrete Beispiele nennen, solange er sie als Beispiel
kennzeichnet. Diese Annahme ist ungeprüft und entscheidet über den halben
Umfang von 3b.

---

## Was ausdrücklich nicht in Phase 1 gehört

Fixtures für die fünf Prüfungen (N4) · Platzhalter-Check und Zeilengrenze
(N7, N8) · Ausweitung von Prüfung 5 (N6) · Findings-Ablage (N14) ·
Bestandstestsatz (R3) · alles aus Phase 2 und 3. `[Fakt]` Auch dann nicht,
wenn eine dieser Sachen beim Bauen als „wäre jetzt einfach" auffällt.
