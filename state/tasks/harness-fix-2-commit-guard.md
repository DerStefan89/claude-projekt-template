SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `fdda1de`
(Vertrag 1) in `main` enthalten ist (`git merge-base --is-ancestor fdda1de
HEAD`). Fehlt er, anhalten und melden — nicht raten, ob der Merge
stattgefunden hat. Danach `npm run check` laufen lassen und den
Ausgangsstand protokollieren.

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-2-commit-guard

GOAL:
Kein `git commit` und kein `git push` läuft über das Modell durch, ohne
dass der Mensch eine frische, einmalige Freigabe in seinem eigenen Editor
angelegt hat. Prüfbar an: ein Commit-Versuch ohne Freigabe-Datei wird real
abgewiesen · ein Commit-Versuch mit frischer, vom Menschen angelegter
Freigabe-Datei läuft durch und die Datei ist danach weg · ein zweiter
Commit-Versuch unmittelbar danach wird wieder abgewiesen · ein
Bash-Schreibversuch auf `.claude/settings.json` wird abgewiesen · ein
Bash-Zugriff, der die Freigabe-Datei referenziert, wird abgewiesen.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase1-vertraege.md`, Vertrag 2. Advisor-
  Befunde: `state/advisor-findings-phase1-vertraege.md`, insbesondere F3
  (settings.json-Zirkelschluss), F4 (fail-closed), F5 (C2 statt C1, wegen
  `CLAUDE.md:64-65`).
- [Fakt] `N1` im Befundregister: drei belegte Vorfälle für Commits ohne
  Freigabe. Beförderungsregel erfüllt.
- [Fakt] `.claude/hooks/guard-settings.js` matcht heute nur `Edit|Write` und
  schützt nur `.claude/settings.json`. Sein dokumentierter Ausweg ("Hook
  temporär entfernen") ist zirkulär, weil das Entfernen selbst ein Edit auf
  dieselbe Datei wäre.
- [Fakt] `CLAUDE.md:64-65`: "Iterationsende heißt: git status prüfen,
  Freigabe einholen, committen UND pushen. Eine Bremse ohne Gaspedal
  erzeugt Halden." Ein Guard, der jeden Commit durch das Modell verbietet
  (Bauform C1), widerspricht diesem Satz direkt.
- [Entschieden 17.08.2026] Bauform **C2**: Einmal-Freigabe-Datei,
  `state/freigabe-commit.md`, vom Hook verbraucht (gelöscht) bei
  erfolgreicher Prüfung. Frischefenster 10 Minuten — [Annahme], ungeprüft,
  passt sich an, sobald `state/reibung.md` echte Werte liefert.
- [Fakt] Die vier bestehenden Hooks im Repo kehren bei einem Fehler still
  mit Exit 0 zurück (dokumentierte Konvention in
  `zwischenstand-laden.js:8-11`). Dieser neue Hook bricht bewusst mit
  dieser Konvention: Kann er seine Eingabe nicht lesen, verweigert er statt
  durchzulassen (Befund F4). Das ist eine Absicht, keine Inkonsistenz —
  im Bericht erwähnen, damit sie nicht als Fehler gemeldet wird.
- [offene Unsicherheit] Das Muster `git` + `commit`/`push` im Befehlstext
  ist breit, nicht exakt — bei einer freien Shell (Variablen, Aliase,
  kodierte Befehle) ist es nicht vollständig schließbar. Dokumentiert
  bleiben, nicht versuchen zu lösen.
- [Schlussfolgerung] Damit die Freigabe-Datei ein echter zweiter Schlüssel
  ist, darf das Modell sie nicht selbst erzeugen können — weder über
  `Edit`/`Write` noch über `Bash`. Beide Wege werden in diesem Vertrag
  gesperrt. Das bedeutet: Auch der Kalibrierungstest kann die Datei nur
  über den Menschen bekommen, nicht über eine Abkürzung im Vertrag selbst.

SCOPE:

1. **`.claude/hooks/commit-guard.js` schreiben (neu).** Drei Aufgaben in
   einem PreToolUse-Hook auf `Bash`:
   - Verweigert `git commit` / `git push` (breites Muster: Befehlstext
     enthält `git` UND `commit`/`push`, je als eigenständiges Wort,
     irgendwo im String — das nimmt `git -C <pfad> commit`,
     `bash -c "git commit"`, verkettete Befehle, `--amend`, `push --force`
     mit), außer eine frische Freigabe-Datei liegt vor. Prüft dort die
     Zeile `Freigegeben: <ISO-Zeitstempel>` gegen ein Frischefenster von
     10 Minuten. Bei gültiger Freigabe: Datei löschen, Befehl durchlassen.
   - Verweigert jeden Bash-Befehl, der `.claude/settings.json`
     referenziert (schließt V1.6/Punkt B).
   - Verweigert jeden Bash-Befehl, der `state/freigabe-commit.md`
     referenziert (schützt den zweiten Schlüssel selbst).
   - Fail-closed: nicht lesbares JSON oder fehlendes `tool_input.command`
     → verweigern, nicht durchlassen.
   - Kopfkommentar analog zu den bestehenden Hooks: Zweck, die drei
     Aufgaben einzeln benannt, die bewusste Abweichung von der
     Fail-Open-Konvention, die dokumentierte Grenze des Musters.

2. **`.claude/hooks/guard-settings.js` erweitern.** Von einem einzelnen
   `GUARDED_SUFFIX` auf eine kleine Liste umstellen: `.claude/settings.json`
   (wie bisher) und `state/freigabe-commit.md` (neu). Beide über
   `Edit`/`Write` gesperrt, mit passender Begründung je nach Datei in der
   `permissionDecisionReason`.

3. **`.gitignore`**: Zeile für `state/freigabe-commit.md` ergänzen, mit
   Begründung im Kommentar (ephemer, personenbezogener Freigabe-Vorgang,
   nie committen).

4. **`state/memory-map.md`**: Zeile für die Freigabe-Datei, „nicht
   hierhin" ausdrücklich gegen `state/zwischenstand/` abgrenzen — andere
   Aufgabe, andere Lebensdauer.

5. **`docs/guide/03-DEEPDIVE-gates.md`**: Den Commit-Guard als vierte
   Stufe neben Lint-Hook / `npm run check` / CI dokumentieren. Erwähnen,
   dass die Freigabe nur im Editor des Menschen entstehen kann und warum.

6. **Kalibrierung, Teil 1 — Unit-Test ohne echten Commit.** `commit-guard.js`
   direkt aufrufen (`node .claude/hooks/commit-guard.js` mit synthetischem
   stdin über `echo | node ...`, wie in Vertrag 1 mit den
   Zwischenstand-Hooks). Drei Fälle: kein `tool_input.command` → verweigert
   · `tool_input.command` referenziert `.claude/settings.json` → verweigert
   · `tool_input.command` referenziert `state/freigabe-commit.md` →
   verweigert. Diese drei sind sichere Trockentests, kein echter
   Git-Befehl läuft dabei.

7. **`.claude/settings.json` — geht über dich, nicht über mich.** Neuen
   PreToolUse-Eintrag mit Matcher `Bash` und Command
   `node .claude/hooks/commit-guard.js` ergänzen. Gib den exakten
   Zielinhalt der betroffenen Zeilen aus und **halte an**. Ich ändere das
   in meinem Editor und melde zurück.

8. **Kalibrierung, Teil 2 — echter Rot-Fall.** Nach der Freigabe aus
   Punkt 7: einen Wegwerf-Branch von der aktuellen Arbeit abzweigen
   (`test/commit-guard-calibration`), einen echten Commit-Versuch machen
   (`git commit --allow-empty -m test`) — **ohne** vorhandene
   Freigabe-Datei. Muss über den echten Hook-Pfad abgewiesen werden (nicht
   über den Unit-Test aus Punkt 6). Das ist der Beweis, dass der Hook nicht
   nur korrekt geschrieben, sondern auch korrekt verkabelt ist.

9. **Kalibrierung, Teil 3 — echter Grün-Fall, geht über dich.** Bitte lege
   in deinem Editor `state/freigabe-commit.md` an, Inhalt genau:
   `Freigegeben: <aktueller Zeitstempel im Format JJJJ-MM-TTThh:mm>`.
   Speichern, melden. Danach denselben `git commit --allow-empty -m test`
   auf dem Wegwerf-Branch erneut versuchen — muss durchgehen. Direkt danach
   `git status` prüfen: Freigabe-Datei muss weg sein. Direkt danach einen
   zweiten `git commit --allow-empty -m test2` versuchen, **ohne** neue
   Freigabe — muss wieder abgewiesen werden (belegt: Freigabe gilt für
   genau einen Commit).

10. Wegwerf-Branch danach lokal löschen (`git branch -D
    test/commit-guard-calibration`), nie pushen.

11. **`state/gates.md`**: Kalibrierungs-Log-Eintrag mit den echten
    Zeitstempeln und Befehlen aus den Punkten 8 und 9 — nach demselben
    Muster wie der Zwischenstand-Loop-Eintrag aus Vertrag 1. Neue Zeile in
    der Gate-Tabelle für den Commit-Guard.

HINWEIS: Sobald Punkt 7 abgeschlossen ist, gilt der Guard **repoweit,
auch für den eigenen Abschluss-Commit dieses Vertrags**. Für den finalen
Commit in OUTPUT wird also selbst noch einmal eine Freigabe-Datei von dir
gebraucht — das ist beabsichtigt, kein Fehler im Ablauf.

NICHT:
- Bauform C1 (hartes Verbot) bauen. Entschieden: C2.
- Versuchen, die Muster-Lücke aus dem offenen Punkt vollständig zu
  schließen. Dokumentieren, nicht lösen.
- Einen Umgehungsweg für die Freigabe-Datei einbauen (Umgebungsvariable,
  Testpfad-Override, Sonderfall im Hook). Jede Abkürzung hier hebt den
  zweiten Schlüssel auf.
- `package.json`, die Prüfkette, `check-docs.mjs` oder `ci.yml` anfassen.
- Weitere Befunde aus dem Register mitnehmen.
- `programm/` anfassen oder stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die zwei Halte-Punkte
(7 und 9) zählen nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/2-commit-guard`, von `main` abgezweigt (nach
  bestätigtem Merge von Vertrag 1).
- Ein Commit auf diesem Branch. Message inhaltsbeschreibend.
- `npm run check` → Exit 0, Ausgabe zeigen.
- Protokoll aus SCHRITT 0 im Bericht (inklusive Merge-Bestätigung).
- Alle drei Unit-Test-Ergebnisse aus Punkt 6 im Bericht.
- Beide echten Kalibrierungsläufe (Rot in Punkt 8, Grün und
  Verbrauchs-Nachweis in Punkt 9) im Bericht, mit den tatsächlichen
  Ausgaben des Hooks.
- Kalibrierungs-Log-Eintrag in `state/gates.md`.
- Für den Abschluss-Commit selbst: Freigabe-Datei anlegen (geht wieder über
  dich), dann `git diff --staged` vollständig zeigen, mein "ja" abwarten.
- Push, dann PR-Status klären (`gh auth status`; fehlt `gh`, Link aus der
  Push-Ausgabe). CI-Status melden. NICHT selbst mergen.

ESCALATE:
- `fdda1de` ist nicht in `main` → anhalten, melden, nicht vermuten, ob der
  Merge stattgefunden hat.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- Der echte Rot-Fall (Punkt 8) läuft NICHT ab, sondern der Commit geht
  durch → sofort anhalten, nicht weiterbauen. Das ist keine kleine
  Abweichung, sondern ein Sicherheitsversagen des Kernstücks dieses
  Vertrags.
- Der Mensch antwortet auf Punkt 7 oder 9 nicht → dort anhalten, nicht mit
  Ersatzlösungen weitermachen.
- Nach Punkt 7 lässt sich `.claude/settings.json` nicht mehr wie gewohnt
  ändern (z. B. weil ein weiterer Fix nötig wird) → das geht ab jetzt immer
  über dich, das ist die neue Dauerregel, nicht ein Fehler.
- `npm run check` wird rot → Ausgabe vollständig zeigen, anhalten.

FOLGT:
- Vertrag 3 (`harness-fix-3-dokugate-und-ci`) — schreibe ich, sobald du
  meldest, dass Vertrag 2 durch ist.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit (nach
eigener Freigabe-Datei) und warte auf mein ausdrückliches "ja".
