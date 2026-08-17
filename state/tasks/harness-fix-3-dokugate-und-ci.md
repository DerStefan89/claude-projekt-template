SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `e3a2840`
(Vertrag 2) in `main` enthalten ist (`git merge-base --is-ancestor e3a2840
HEAD`). Fehlt er, anhalten und melden — nicht raten, ob der Merge
stattgefunden hat. Danach `npm run check` laufen lassen und den
Ausgangsstand protokollieren.

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-3-dokugate-und-ci

GOAL:
Das Doku-Gate deckt tote Verweise auch in Skills und Commands auf, nicht
nur im bisherigen Dateikreis. Die CI-Pipeline pinnt das gitleaks-Image auf
einen geprüften Tag statt `:latest` und schränkt die Workflow-Rechte auf
Lesen ein. Prüfbar an: `npm run check` meldet den toten Verweis vor der
Behebung und ist danach Exit 0 · CI grün · Rot-Fall über einen
Wegwerf-Branch, nie über `main` · Trefferliste von Prüfung 2
(Versionsnummern-Muster) gegen Skills/Commands als dokumentierter
Grün-Fall in `state/gates.md`, damit niemand die Ausweitung dieser Prüfung
in sechs Monaten erneut versucht.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase1-vertraege.md`, Vertrag 3. Advisor-
  Befunde: `state/advisor-findings-phase1-vertraege.md`, insbesondere F2
  (2a unter dem heutigen Shallow-Checkout wirkungslos), F6 (Prüfung 2 auf
  Skills erzeugt neun statt einem Fehlalarm), F13 (gitleaks fehlt in
  `state/tooling.md`).
- [Fakt] `.github/workflows/ci.yml` nutzt `actions/checkout@v5` ohne
  `fetch-depth` — Default ist ein Shallow Clone mit genau einem Commit.
  `--no-git` bei gitleaks zu entfernen ändert damit nichts Messbares,
  solange `fetch-depth: 0` nicht gesetzt ist.
- [Schlussfolgerung] Mit voller Historie meldet gitleaks jedes je
  committete Secret, dauerhaft, bei jedem PR — ohne History-Rewrite
  unbehebbar. Deshalb keine stille Umstellung: Vor `--no-git` entfernen
  und `fetch-depth: 0` setzen läuft eine Stop-Grenze — ein lokaler
  gitleaks-Lauf über die volle Historie. Findet er etwas, hält der Vertrag
  an, bevor `ci.yml` in diesem Punkt angefasst wird.
- [Entschieden 17.08.2026] Punkt D: Nur Prüfung 1 (tote Verweise) wird auf
  `.claude/skills/*/SKILL.md` und `.claude/commands/*.md` ausgeweitet,
  nicht Prüfung 2 (Versionsnummern-Muster). [Fakt] Das Versionsmuster von
  Prüfung 2 trifft in den Skills neunmal. Sieben Treffer sind „Plan v1"
  und „Plan v2" — der Kernbegriff des `advisor-pass`-Verfahrens, kein
  Fremdtext, den man ausklammern könnte. Der achte ist der beabsichtigte
  Versionspin der vendorten `ponytail`-Datei, Pflicht aus
  `werkzeug-auswahl` Schritt 4. [Schlussfolgerung] Prüfung 2 ist auf
  Skills strukturell unbrauchbar, solange ihr zweites Muster ein
  `[FÜLLUNG]`-Platzhalter aus einem fremden Stack ist. Die vollständige
  Trefferliste gehört als Grün-Fall nach `state/gates.md`.
- [Entschieden 17.08.2026] Punkt E: Toter Verweis auf `state/triage.md`
  in `spec-schreiben/SKILL.md` wird auf `state/tasks/` umgebogen, statt
  eine neue Zustandsdatei anzulegen. [Schlussfolgerung] Von drei
  Möglichkeiten die einzige, die keine neue Zustandsdatei erzeugt — eine
  anzulegen, die niemand angefordert hat, wäre ein Feature aus einem Fund.

SCOPE:

1. **`scripts/check-docs.mjs`, Prüfung 1 erweitern.** Zusätzlich zu den
   bisher geprüften Dateien auch `.claude/skills/*/SKILL.md` und
   `.claude/commands/*.md` auf tote Verweise prüfen. Prüfung 2
   (Versionsnummern-Muster) bleibt unverändert auf ihrem bisherigen
   Dateikreis — nicht ausweiten (Punkt D).
2. Toten Verweis beheben, den Punkt 1 aufdeckt:
   `.claude/skills/spec-schreiben/SKILL.md`, Zeile mit Verweis auf
   `state/triage.md` auf `state/tasks/` umbiegen (Punkt E).
3. **`.github/workflows/ci.yml`**: gitleaks-Image von `:latest` auf einen
   geprüften, festen Tag pinnen. `permissions: contents: read` auf
   Workflow-Ebene ergänzen.
4. **Stop-Grenze, vor dem Entfernen von `--no-git`:** gitleaks einmal
   lokal über die volle Historie laufen lassen (`--source .`, ohne
   `--no-git`). Findet er etwas: anhalten, melden, `ci.yml` in diesem
   Punkt nicht anfassen. Findet er nichts: `--no-git` entfernen und
   `fetch-depth: 0` beim Checkout-Schritt setzen (F2). Ist weder `docker`
   noch ein eigenständiges `gitleaks`-Binary lokal verfügbar: anhalten,
   melden, als offenen Folgeschritt in `state/gates.md` vermerken —
   `--no-git` und der implizite Shallow-Checkout bleiben dann
   unverändert. Das Image-Pinning und `permissions: contents: read` aus
   Punkt 3 sind davon unabhängig und werden in jedem Fall umgesetzt.
5. `state/tooling.md`: gitleaks nachtragen (F13).
6. Realen Rot-Fall für den toten Verweis aus Punkt 1/2 durchspielen — der
   reale Zustand des Repos vor der Behebung, kein konstruierter Testfall.
   Nicht über einen separaten Wegwerf-Branch nötig, wenn der Rot-Fall der
   tatsächliche Ausgangszustand vor Punkt 2 ist; ein etwaiger zusätzlicher
   Kalibrierungs-Testfall läuft **nie über `main`.**
7. `state/gates.md`: vollständige Trefferliste von Prüfung 2 gegen
   Skills/Commands als dokumentierter Grün-Fall eintragen (F6), damit die
   Ausweitung dieser Prüfung nicht in sechs Monaten erneut versucht wird.
   Kalibrierungs-Log-Einträge für die Doku-Gate-Erweiterung (Rot/Grün) und
   für den gitleaks-Stop-Grenzen-Versuch aus Punkt 4 (Ergebnis, auch wenn
   nicht ausführbar).

NICHT:
- Prüfung 2 (Versionsnummern-Muster) auf Skills/Commands ausweiten.
  Entschieden: nur Prüfung 1 (Punkt D).
- Eine neue Zustandsdatei für den `triage.md`-Verweis anlegen. Entschieden:
  auf `state/tasks/` umbiegen (Punkt E).
- `--no-git` entfernen oder `fetch-depth: 0` setzen, ohne dass die
  Stop-Grenze aus Punkt 4 zuvor ausgeführt (oder als nicht ausführbar
  dokumentiert) wurde.
- `package.json`, die Prüfkette, den Commit-Guard oder
  `.claude/settings.json` anfassen.
- Weitere Befunde aus dem Register mitnehmen.
- `programm/` anfassen oder stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die Stop-Grenze bei
Punkt 4 zählt nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/3-dokugate-und-ci`, von `main` abgezweigt (nach
  bestätigtem Merge von Vertrag 2).
- Ein Commit auf diesem Branch. Message inhaltsbeschreibend.
- `npm run check` meldet den toten Verweis vor der Behebung, danach
  Exit 0 — beide Ausgaben zeigen.
- Ergebnis der lokalen gitleaks-Stop-Grenze (Punkt 4) im Bericht: entweder
  reale Ausgabe des Laufs, oder — falls `docker`/`gitleaks` nicht
  verfügbar — der Nachweis der Prüfung (PATH-Check) und dass `ci.yml` in
  diesem Punkt unverändert bleibt.
- Trefferliste aus Punkt 7 vollständig im Bericht.
- `git diff --staged` vollständig zeigen, mein "ja" abwarten.
- Push, dann PR-Status klären (`gh auth status`; fehlt `gh`, Link aus der
  Push-Ausgabe). CI-Status melden. NICHT selbst mergen.

ESCALATE:
- `e3a2840` ist nicht in `main` → anhalten, melden, nicht vermuten, ob der
  Merge stattgefunden hat.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- Die lokale gitleaks-Stop-Grenze findet einen Treffer → anhalten, melden,
  `--no-git`/`fetch-depth` nicht anfassen.
- Weder `docker` noch ein eigenständiges `gitleaks`-Binary lokal
  verfügbar → nicht raten, ob die Historie sauber ist; Stop-Grenze als
  nicht ausführbar dokumentieren, `--no-git` und Shallow-Checkout
  unverändert lassen, restlichen Vertrag trotzdem abschließen.
- `npm run check` wird rot → Ausgabe vollständig zeigen, anhalten.

FOLGT:
- Vertrag 4 (`harness-fix-4-pruefkette-und-vertragspruefung`) — schreibe
  ich, sobald du meldest, dass Vertrag 3 durch ist.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit und
warte auf mein ausdrückliches "ja".
