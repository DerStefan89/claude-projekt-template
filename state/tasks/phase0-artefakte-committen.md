SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: phase0-artefakte-committen

GOAL:
Das Phase-0-Artefakt `docs/harness/zaehne-taxonomie.md` liegt als einzelner
Commit auf einem frischen Branch von `main`, und `programm/` ist dauerhaft
von der Versionskontrolle ausgeschlossen. Prüfbar an: `git log -1 --stat`
zeigt zwei hinzugefügte Dateien plus die `.gitignore`-Änderung, und
`git status` meldet danach einen sauberen Arbeitsbaum ohne `programm/`.

CONTEXT:
- [Fakt] Aktueller Stand: Branch `regel/zielverzeichnis`, HEAD `7ad0086`,
  Arbeitsbaum sauber. Der Branch trägt einen bereits gepushten Commit, der
  nichts mit dieser Aufgabe zu tun hat — nicht darauf committen.
- [Fakt] Drei neue, ungetrackte Dateien liegen bereits auf der Platte:
  `docs/harness/zaehne-taxonomie.md` (soll committet werden),
  `state/tasks/phase0-artefakte-committen.md` — dieser Vertrag selbst,
  soll mit committet werden — und `programm/basislinie.md` (soll NICHT
  committet werden).
- [Fakt] `programm/basislinie.md` enthält Selbstauskünfte von vier
  namentlich genannten Personen. Das Repo ist als öffentliche Vorlage
  angelegt, und beim Ableiten eines Projekts würde der Ordner mitgeklont.
  Beides ist der Grund für den `.gitignore`-Eintrag.
- [Fakt] `.gitignore` folgt einem festen Stil: Abschnittsüberschrift als
  Kommentar, Begründung darunter, dann die Muster. Der neue Eintrag hält
  sich daran.
- [Schlussfolgerung] Der Ordner zieht in Phase 3 in das Lern-Repo
  (Befund P4). Bis dahin existiert er nur lokal, ohne Sicherung — das ist
  eine bewusste Entscheidung, kein Versehen.
- [Fakt] Ein vorheriger Versuch über eine gemountete Ordner-Brücke ist an
  `Operation not permitted` gescheitert und hat drei `.lock`-Dateien in
  `.git/` hinterlassen. Diese wurden nach `.lock.stale` bzw.
  `.lock.stale2` umbenannt. Sie sind wirkungslos, aber Müll.

SCOPE:
1. `git status` und `git branch -vv` zeigen, bevor irgendetwas passiert.
2. Die drei Reste `.git/HEAD.lock.stale`, `.git/index.lock.stale`,
   `.git/index.lock.stale2` und `.git/refs/heads/regel/zielverzeichnis.lock.stale`
   löschen, sofern vorhanden.
3. `git checkout main && git pull`.
4. Neuen Branch anlegen: `git checkout -b phase0/zaehne-taxonomie`.
5. In `.gitignore` am Ende einen neuen Abschnitt anfügen:

   ```
   # Programm-Ebene — Basislinie und Erfolgskriterium der vier Beteiligten.
   # Personenbezogen, gehört nicht in ein öffentliches Vorlagen-Repo und
   # nicht in einen abgeleiteten Projekt-Klon. Zieht in Phase 3 in das
   # Lern-Repo (Befund P4).
   programm/
   ```

6. Prüfen, dass `git status` `programm/` danach nicht mehr als ungetrackt
   meldet.
7. `git add docs/harness/zaehne-taxonomie.md state/tasks/phase0-artefakte-committen.md .gitignore`
   — nur diese drei Pfade, kein `git add .` und kein `git add -A`.
8. `git diff --staged` vollständig ausgeben.

NICHT:
- `programm/` oder `programm/basislinie.md` stagen — unter keinen Umständen,
  auch nicht "zur Sicherheit".
- Den Inhalt von `docs/harness/zaehne-taxonomie.md` verändern, kürzen,
  umformatieren oder korrigieren. Die Datei ist ein Erhebungsartefakt; jede
  Änderung daran macht die Zahlen unbelegt.
- Auf `regel/zielverzeichnis` committen oder diesen Branch mergen.
- Mergen, egal welcher Branch.
- Weitere Befunde aus dem Register mitnehmen, weil sie gerade auffallen.

BUDGET:
Ein Durchgang. Keine Korrekturrunde vorgesehen — scheitert etwas, ist das
ein Fall für ESCALATE, nicht für einen zweiten Versuch mit anderer Methode.

OUTPUT:
- Branch `phase0/zaehne-taxonomie` mit genau einem Commit.
- Commit-Message, inhaltsbeschreibend, ohne Werbung:
  `Phase 0: Zähne-Taxonomie erheben, programm/ von der Versionskontrolle ausnehmen`
- Nach dem Commit: pushen, dann PR-Status klären (`gh auth status` prüfen;
  ist `gh` nicht verfügbar, den "Create a pull request…"-Link aus der
  Push-Ausgabe nennen statt etwas einzurichten).
- CI-Status melden. NICHT selbst mergen.
- Meldung, ob `npm run check` grün läuft — die neue Datei trägt einen
  `Stand dieser Fassung:`-Marker und enthält Datumsangaben, ist damit für
  Prüfung 3 des Doku-Gates relevant.

ESCALATE:
- `git status` ist zu Beginn nicht sauber → anhalten, Ausgabe zeigen,
  nichts ändern.
- `git checkout main` oder `git pull` scheitert → anhalten, NICHT mit
  `--force` oder `reset --hard` nachhelfen.
- `.gitignore` enthält bereits einen `programm/`-Eintrag → anhalten und
  melden, statt einen zweiten anzufügen.
- Eine der drei Dateien fehlt auf der Platte → anhalten, nichts neu
  erzeugen.
- `npm run check` wird rot → Ausgabe vollständig zeigen und anhalten. Die
  Datei nicht anpassen, bis geklärt ist, ob das Gate recht hat.

Zeig mir `git diff --staged` vollständig und warte auf mein ausdrückliches
"ja", bevor du committest.
