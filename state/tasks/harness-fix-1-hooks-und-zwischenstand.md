SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach `npm run check` laufen lassen und den Ausgangsstand protokollieren,
bevor irgendetwas geändert wird.

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-1-hooks-und-zwischenstand

GOAL:
Der Zwischenstand-Loop hat kein Loch mehr, das Repo hat eine Lizenz, und
drei stille Widersprüche sind beseitigt. Prüfbar an: `npm run check` → Exit 0
· nach einem `/clear` in einer Sitzung mit vorhandenem Zwischenstand wird
dieser geladen · `state/gates.md` trägt für den Zwischenstand-Loop einen
Rot- und einen Grün-Fall mit Datum.

CONTEXT:
- [Fakt] Ausgangsstand am 17.08.2026, Branch `main`, Arbeitsbaum sauber:
  `npm run check` → Exit 0, Doku-Check „Keine Befunde".
- [Fakt] Plan v2 steht in `state/plan-v2-phase1-vertraege.md`, die
  Advisor-Befunde in `state/advisor-findings-phase1-vertraege.md`. Beide
  lesen, bevor gebaut wird.
- [Fakt] `.claude/settings.json`, SessionStart-Matcher lautet heute
  `startup|resume|compact|fork`. `clear` fehlt. Nach `/clear` lädt
  `zwischenstand-laden.js` nichts.
- [Fakt] `.claude/hooks/zwischenstand-laden.js` kürzt bei `MAX_ZEICHEN`.
  `state/zwischenstand/VORLAGE.md` nennt in der Schlusszeile einen höheren
  Wert. Der Wert im Hook ist der wirksame.
- [Fakt] `.gitattributes` trägt `working-tree-encoding=UTF-8`. Getestet
  wirkungslos (Befund V1.5). [offene Unsicherheit] Ob es in einer anderen
  Umgebung wirkt, ist ungeprüft.
- [Fakt] `state/memory-map.md` hat keine Zeile für `specs/`. Das Verzeichnis
  existiert mit `.gitkeep`.
- [Fakt] `.claude/hooks/guard-settings.js` matcht nur `Edit|Write`. Ein
  Schreibvorgang per Bash umgeht ihn. Befund V1.6 verlangt, diese Grenze zu
  dokumentieren — nicht, sie hier zu schließen. Das passiert in Vertrag 2.
- [Fakt] `docs/guide/02-DEEPDIVE-claude-ordner.md` erklärt den `.claude`-
  Ordner und ist die Stelle, an der die Grenze hingehört.

SCOPE:

1. **`.claude/settings.json` — geht über den Menschen, nicht über dich.**
   Der Guard verweigert `Edit`/`Write` auf diese Datei, und der im Hook
   dokumentierte Ausweg ist zirkulär. Gib den exakten Zielwert des
   SessionStart-Matchers aus (`startup|resume|compact|clear|fork`), sag,
   in welcher Zeile er steht, und **halte an**. Der Mensch ändert die Datei
   in seinem Editor und meldet zurück. Danach weiterarbeiten.
2. `LICENSE` anlegen: MIT, Jahr 2026, Inhaber Stefan Kaufmann.
   [offene Unsicherheit] Falls die Schreibweise des Inhabers abweicht,
   nachfragen statt raten.
3. `state/zwischenstand/VORLAGE.md`: Die Zeichenangabe in der Schlusszeile
   auf den Wert ziehen, der in `zwischenstand-laden.js` als `MAX_ZEICHEN`
   steht. Den Wert im Hook nachlesen, nicht aus dem Gedächtnis einsetzen.
4. `state/memory-map.md`: Zeile für `specs/` ergänzen, mit gefüllter
   „nicht hierhin"-Spalte. Einordnung: Specs sind das WAS eines Vorhabens;
   Pläne und Verträge gehören nicht dorthin.
5. `.gitattributes`: `working-tree-encoding=UTF-8` entfernen. Den bestehenden
   Kommentarblock darüber um zwei Zeilen ergänzen: dass das Attribut
   entfernt wurde, weil es getestet wirkungslos war, und dass ein
   Wiedereinbau einen neuen Test braucht — damit er nicht als Neuentdeckung
   auftritt.
6. `docs/guide/02-DEEPDIVE-claude-ordner.md`: Die Grenze von
   `guard-settings.js` dokumentieren. Zwei bis vier Sätze: Der Hook greift
   bei `Edit` und `Write`, nicht bei Bash-Schreibvorgängen; ab Vertrag 2
   wird diese Lücke geschlossen; die Datei ist Team-Policy und wird vom
   Menschen geändert.
7. `state/gates.md`: Für den Zwischenstand-Loop einen Rot- und einen
   Grün-Fall eintragen, beide **tatsächlich durchgespielt**, mit Datum im
   Kalibrierungs-Log. Vorschlag Rot-Fall: Zwischenstandsdatei mit
   veraltetem `Zuletzt aktualisiert:`-Zeitstempel, manuelle Compaction wird
   blockiert. Grün-Fall: frischer Zeitstempel, Compaction läuft.

NICHT:
- Die Bash-Lücke von `guard-settings.js` schließen. Das ist Vertrag 2, und
  die Reihenfolge ist sicherheitskritisch: Solange sie offen ist, bleibt ein
  Weg zurück, falls eine Hook-Änderung die Sitzung lahmlegt.
- Einen Commit-/Push-Guard bauen.
- `package.json`, `lint`, `typecheck`, `test` oder die Prüfkette anfassen.
- Weitere Befunde aus dem Register mitnehmen, weil sie beim Lesen auffallen.
- `programm/` anfassen oder stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Der Halt an Punkt 1
zählt nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/1-hooks-und-zwischenstand`, von `main` abgezweigt.
- Ein Commit. Message inhaltsbeschreibend, ohne Werbung.
- `npm run check` → Exit 0, Ausgabe zeigen.
- Protokoll des Ausgangsstands aus SCHRITT 0 im Bericht.
- Nachweis, dass der Zwischenstand nach `/clear` geladen wird — von Hand
  gegengeprüft, Beobachtung im Bericht.
- Rot- und Grün-Fall in `state/gates.md`, mit Datum im Kalibrierungs-Log.
- Push, dann PR-Status klären (`gh auth status` prüfen; fehlt `gh`, den
  „Create a pull request…"-Link aus der Push-Ausgabe nennen). CI-Status
  melden. NICHT selbst mergen.

ESCALATE:
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- `npm run check` ist schon am Anfang rot → anhalten. Der Ausgangsstand ist
  dann ein anderer als im CONTEXT belegt, und der ganze Vertrag steht auf
  einer falschen Grundlage.
- Der Mensch antwortet auf Punkt 1 nicht → Punkte 2 bis 7 trotzdem
  ausführen, Punkt 1 als offen melden. V1.1 wandert dann in eine
  Nachfassung, nicht ins Vergessen.
- Eine Hook-Änderung legt die Sitzung lahm → nichts reparieren, melden. Der
  Rückweg über Bash ist in diesem Vertrag noch offen und gehört dem
  Menschen.
- `npm run check` wird nach einer Änderung rot → Ausgabe vollständig zeigen
  und anhalten. Nicht die Datei anpassen, bis geklärt ist, ob das Gate recht
  hat.

FOLGT:
- Bash-Lücke von `guard-settings.js` schließen →
  `state/tasks/harness-fix-2-commit-guard.md`, Position B.
- Falls Punkt 1 offen bleibt: V1.1 in denselben Folgeauftrag aufnehmen.

Zeig mir `git diff --staged` vollständig und warte auf mein ausdrückliches
"ja", bevor du committest.
