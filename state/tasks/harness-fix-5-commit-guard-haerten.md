SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git checkout main && git pull`, prüfen dass Commit `97afe1e`
(letzter Stand nach Phase 1) in `main` enthalten ist
(`git merge-base --is-ancestor 97afe1e HEAD`). Fehlt er, anhalten und
melden — nicht raten, ob der Merge stattgefunden hat. Danach
`npm run check:template` laufen lassen und den Ausgangsstand protokollieren
(erwartet: Exit 0).

Zielverzeichnis: C:\Users\stefa\Projekte\claude-projekt-template

## TASK: harness-fix-5-commit-guard-haerten

GOAL:
Der Commit-Guard weist eine Freigabe-Datei nur noch dann ab, wenn sie
wirklich zu alt, zu kurz oder ungültig ist — nicht mehr, weil sie einen
korrekten Zeitzonen-Offset trägt oder mit BOM gespeichert wurde. Prüfbar an:
eine Freigabe-Zeile mit echtem ISO-Zeitstempel inklusive Offset
(`2026-08-17T14:03:00+02:00`) wird vom alten Hook als zwei Stunden alt
abgewiesen und vom neuen Hook akzeptiert · ein `git push` ohne frische
Freigabe wird real abgewiesen · ein `git push` mit frischer Freigabe läuft
real durch · `state/gates.md` enthält danach vier dokumentierte Fälle: Rot
und Grün für `commit`, Rot und Grün für `push`.

CONTEXT:
- [Fakt] Plan v2: `state/plan-v2-phase2-adoptionsfaehigkeit.md`, Paket H und
  Vertrag 5. Advisor-Befunde:
  `state/advisor-findings-phase2-adoptionsfaehigkeit.md`, insbesondere B1
  (Push-Pfad unkalibriert, zwei Freigaben nötig), B2 (Zeitzone und Format
  wahrscheinlicher als Kodierung), B13 (drei weitere Stolperstellen).
- [Fakt] `.claude/hooks/commit-guard.js:116-118` matcht
  `/^Freigegeben:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?)/m`. Das Muster
  erfasst weder einen Zeitzonen-Offset noch `Z`. Der Treffer geht in `:126`
  an `new Date(...)`, das eine Zeitangabe ohne Offset als **Ortszeit** liest.
- [Schlussfolgerung] Wer einen echten ISO-Zeitstempel schreibt
  (`2026-08-17T12:03:00Z`, so liefert `date -u -Is`), bekommt in
  MEZ-Sommerzeit „ist 120 Minuten alt … verweigert" (`:135-139`). Die
  Meldung nennt eine Ursache, die nicht die Ursache ist.
- [Fakt] `:107` liest mit `fs.readFileSync(dateiPfad, "utf8")`. Node entfernt
  dabei kein BOM und erkennt kein UTF-16. Beides ist real vorgekommen:
  `state/gates.md`, Kalibrierungs-Log 17.08.2026 — zwei Fehlschläge des
  Menschen an genau dieser Stelle, bevor der Grün-Fall lief.
- [Fakt] `:93-95` behandelt `commit` und `push` mit demselben Muster, `:144`
  löscht die Freigabe-Datei beim ersten erfolgreichen Treffer.
  [Schlussfolgerung] Ein `git push` direkt nach dem Commit findet keine
  Freigabe mehr und wird abgewiesen. Ein voller Iterationsabschluss laut
  `CLAUDE.md:69-70` („committen UND pushen") braucht deshalb **zwei**
  Freigaben. Das ist beabsichtigtes Verhalten, aber nirgends dokumentiert
  und nirgends kalibriert.
- [Fakt] `state/gates.md:17` dokumentiert Rot- und Grün-Fall ausschließlich
  für `git commit`. Der Push-Pfad des schärfsten Gates im Harness ist bis
  heute ein ungeprüftes Versprechen — nach der Regel in `state/gates.md:4-7`
  zählt er damit nicht als kalibriert.
- [Fakt] `:135` verweigert auch bei `minutenAlt < 0` und meldet dann „ist -0
  Minuten alt". Bei geringer Uhrabweichung eine sinnlose Meldung.
- [Fakt] `:78-84` verweigert jeden Bash-Befehl, der `state/freigabe-commit.md`
  enthält — auch `ls` und `cat`. Das ist Absicht (Vertrag 2, Punkt 3) und
  bleibt unverändert. [Schlussfolgerung] Daraus folgt für diesen Vertrag:
  Das Modell kann die Freigabe-Datei weder anlegen noch lesen noch mit
  anderen Kodierungen befüllen. Der Kodierungsfall ist deshalb **nur als
  Unit-Test der Lesefunktion** prüfbar, nicht Ende-zu-Ende. Das ist eine
  Grenze, keine Nachlässigkeit, und gehört so in `state/gates.md`.
- [Fakt] `.claude/settings.json` wird in diesem Vertrag **nicht** angefasst.
  Der Hook ist dort bereits als `PreToolUse`/`Bash` verkabelt. Es gibt in
  diesem Vertrag keinen Halte-Punkt für Settings.
- [Annahme] `:102-103` bildet den Dateipfad aus `eingabe.cwd ||
  process.cwd()`. Liegt das Arbeitsverzeichnis der Sitzung nicht auf der
  Repo-Wurzel, zeigt der Pfad ins Leere und der Hook meldet „ohne
  Freigabe-Datei", obwohl sie existiert. Ungeprüft — in diesem Vertrag nur
  beobachten und berichten, nicht ändern.

SCOPE:

1. **`.claude/hooks/commit-guard.js` — Zeitzone.** Das Muster in `:116-118`
   um einen optionalen Offset erweitern (`Z`, `+hh:mm`, `-hh:mm`, auch ohne
   Doppelpunkt) und den vollständigen Treffer an `new Date(...)`
   durchreichen. Ein Zeitstempel **ohne** Offset muss weiterhin als Ortszeit
   gelesen werden — das ist das Format, das bisher funktioniert hat, und
   darf nicht brechen.

2. **`.claude/hooks/commit-guard.js` — Kodierung.** Vor dem Parsen:
   UTF-8-BOM abschneiden, UTF-16 (LE und BE, an der Byte-Order-Mark
   erkennbar) dekodieren. Dafür in `:105-114` mit `fs.readFileSync` **ohne**
   Encoding lesen (Buffer) und die Dekodierung in einer eigenen, reinen
   Funktion vornehmen.
   **Der Anker `^` und das `m`-Flag bleiben unverändert.** Wer den Anker
   lockert, lässt eine beliebige Kommentarzeile als Freigabe durchgehen —
   das wäre ein neuer Fehlerpfad an der Stelle, an der einer geschlossen
   werden soll.

3. **`.claude/hooks/commit-guard.js` — Fehlermeldungen.** Drei Stellen:
   - `:119-124` (kein gültiger Treffer): das erwartete Format **wörtlich**
     ausgeben, mit einem konkreten Beispiel beider zulässigen Formen (mit
     und ohne Offset).
   - `:109-113` (Datei fehlt): dasselbe Beispiel ergänzen. [Fakt] Heute
     steht das exakte Format nur in
     `state/tasks/harness-fix-2-commit-guard.md:121-122` — einer
     Vertragsdatei, die auf dem Selbstweg niemand liest.
   - `:135-139`: bei `minutenAlt < 0` eine eigene Meldung („Zeitstempel
     liegt in der Zukunft — Uhr oder Zeitzone prüfen") statt „ist -0 Minuten
     alt".

4. **`.claude/hooks/commit-guard.js` — testbar machen.** Die stdin-Registrierung
   in `if (require.main === module) { … }` einschließen und die beiden reinen
   Funktionen aus Punkt 1 und 2 über `module.exports` verfügbar machen
   (Dekodierung Buffer → Text, Parsen Text → Zeitstempel oder `null`).
   Kopfkommentar entsprechend ergänzen: warum die Trennung existiert (die
   Freigabe-Datei ist für das Modell absichtlich unerreichbar, deshalb ist
   die Lesefunktion die einzige kalibrierbare Ebene für den Kodierungsfall).
   Am Laufzeitverhalten des Hooks darf sich dadurch nichts ändern.

5. **Kalibrierung Teil 1 — Unit-Test der Lesefunktion, ohne echten Git-Befehl.**
   Wegwerf-Skript (nicht committen, danach löschen), das die exportierten
   Funktionen direkt aufruft. Mindestens sechs Fälle, jeder mit im Skript
   konstruierten Bytes:
   - reines UTF-8 ohne BOM, Zeitstempel ohne Offset → erkannt
   - UTF-8 **mit** BOM → erkannt (vor dem Fix: nicht erkannt)
   - UTF-16 LE mit BOM → erkannt (vor dem Fix: nicht erkannt)
   - Zeitstempel mit `Z` → erkannt, und als UTC interpretiert
   - Zeitstempel mit `+02:00` → erkannt, und als MESZ interpretiert
   - Zeile ohne `Freigegeben:` am Zeilenanfang (z. B. als Fließtext
     `# Kommentar Freigegeben: …`) → **nicht** erkannt. Dieser Fall belegt,
     dass der Anker nicht gelockert wurde.
   Ergebnisse vollständig in den Bericht.

6. **Kalibrierung Teil 2 — Rot-Fall `commit`, echt.** Wegwerf-Branch von der
   Arbeit abzweigen (`test/guard-haertung-calibration`),
   `git commit --allow-empty -m test` **ohne** vorhandene Freigabe-Datei →
   muss über den echten Hook-Pfad abgewiesen werden. Ausgabe protokollieren.

7. **Kalibrierung Teil 3 — der entscheidende Vorher/Nachher-Beleg, geht
   über dich.** Bitte lege in deinem Editor `state/freigabe-commit.md` an,
   Inhalt genau eine Zeile:
   `Freigegeben: <aktueller Zeitstempel mit Offset, Format JJJJ-MM-TTThh:mm:ss+hh:mm>`
   Speichern (UTF-8), melden.
   Danach in dieser Reihenfolge, ohne Zeitverlust (Frischefenster 10 Minuten):
   - **Alter Hook gegen dieselbe Datei.** Die Fassung aus `main` als
     `commit-guard.alt.js` danebenlegen (`git show
     main:.claude/hooks/commit-guard.js > .claude/hooks/commit-guard.alt.js`,
     nicht committen) und mit synthetischem stdin aufrufen
     (`{"tool_input":{"command":"git commit -m test"},"cwd":"<Repo-Wurzel>"}`).
     Erwartung: **verweigert**, Meldung nennt ein Alter von rund 120 Minuten.
     Die Datei bleibt dabei liegen, weil der alte Hook sie nicht verbraucht.
   - **Neuer Hook, echter Commit.** Danach `git commit --allow-empty -m test`
     auf dem Wegwerf-Branch → muss durchgehen. `git status` direkt danach:
     Freigabe-Datei ist weg.
   - `commit-guard.alt.js` sofort danach löschen.
   [Schlussfolgerung] Dieselbe Eingabe, zwei Hook-Fassungen, zwei
   Ergebnisse — das ist der Beleg, dass der Fix wirkt, und nicht nur, dass
   der neue Hook irgendetwas durchlässt.

8. **Kalibrierung Teil 4 — Rot-Fall `push`, echt.** Unmittelbar nach dem
   Commit aus Punkt 7, ohne neue Freigabe: `git push` versuchen (der
   Wegwerf-Branch, `--dry-run` ist nicht ausreichend, weil der Hook vor dem
   Befehl greift und der Rot-Fall ohnehin nichts überträgt) → muss
   abgewiesen werden. [Fakt] Das ist der erste dokumentierte Rot-Fall für
   den Push-Pfad im ganzen Repo.

9. **Wegwerf-Branch löschen** (`git branch -D test/guard-haertung-calibration`),
   nie pushen.

10. **`state/gates.md`.** Kalibrierungs-Log-Eintrag mit den echten
    Zeitstempeln, Befehlen und Ausgaben aus den Punkten 5 bis 8, nach dem
    Muster der bestehenden Einträge. Die Zeile des Commit-Guards in der
    Gate-Tabelle um den Push-Pfad und den Grün-Fall aus OUTPUT ergänzen.
    Ausdrücklich mit aufnehmen: dass der Kodierungsfall nur als Unit-Test
    der Lesefunktion belegt ist und nicht Ende-zu-Ende, mit der Begründung
    aus CONTEXT.

11. **`state/memory-map.md`.** Die bestehende Zeile zur Freigabe-Datei um
    den Hinweis ergänzen, dass eine Freigabe für **einen** Git-Vorgang gilt
    und ein vollständiger Iterationsabschluss (Commit und Push) deshalb zwei
    braucht.

NICHT:
- `.claude/settings.json` anfassen. Der Hook ist verkabelt; es gibt hier
  keinen Grund und keine Erlaubnis.
- Den Anker `^` oder das `m`-Flag im Freigabe-Muster lockern.
- Das Frischefenster von 10 Minuten ändern. [Annahme] aus Vertrag 2,
  unverändert gültig, bis `state/reibung.md` echte Werte liefert.
- Einen Umgehungsweg für die Freigabe-Datei einbauen (Umgebungsvariable,
  Testpfad-Override, Sonderfall im Hook). Jede Abkürzung hebt den zweiten
  Schlüssel auf.
- Das breite `git`-Muster aus `:90-95` überarbeiten. Die Grenze ist
  dokumentiert und bleibt offen.
- Die `cwd`-Ableitung aus `:102-103` ändern. Nur beobachten und berichten.
- `START-KLEIN.md`, den Werkzeug-Katalog, `state/reibung.md` oder irgendein
  anderes Paket aus Phase 2 mitnehmen.
- `package.json`, `check-docs.mjs`, `check-rules.mjs`, `check-contract.mjs`
  oder `ci.yml` anfassen.
- `programm/` anfassen oder stagen.

BUDGET:
Ein Baudurchgang plus höchstens eine Korrekturrunde. Die Halte-Punkte
(Punkt 7 und die Freigaben in OUTPUT) zählen nicht als Korrekturrunde.

OUTPUT:
- Branch `harness-fix/5-commit-guard-haerten`, von `main` abgezweigt.
- Ein Commit auf diesem Branch, Message inhaltsbeschreibend.
- `npm run check:template` → Exit 0, Ausgabe zeigen.
- Protokoll aus SCHRITT 0 im Bericht, inklusive Bestätigung von `97afe1e`.
- Alle sechs Unit-Test-Ergebnisse aus Punkt 5 im Bericht.
- Der Vorher/Nachher-Beleg aus Punkt 7 mit beiden Ausgaben im Wortlaut.
- Der Push-Rot-Fall aus Punkt 8 mit Ausgabe im Wortlaut.
- Kalibrierungs-Log-Eintrag in `state/gates.md`.
- **Grün-Fall `push`, echt:** Für den Abschluss werden zwei Freigaben
  gebraucht. Erste Freigabe (geht über mich) → `git diff --staged`
  vollständig zeigen, mein ausdrückliches „ja" abwarten → committen.
  Danach `git push` **ohne** neue Freigabe versuchen, falls Punkt 8 aus
  irgendeinem Grund nicht zustande kam; sonst direkt melden und auf die
  zweite Freigabe warten. Zweite Freigabe (geht über mich) → pushen. Der
  Zeitstempel dieses erfolgreichen Pushes ist der Grün-Fall für den
  Push-Pfad und gehört mit in `state/gates.md`.
- Danach PR-Status klären (`gh auth status`; fehlt `gh`, Link aus der
  Push-Ausgabe). CI-Status melden. NICHT selbst mergen.
- Beobachtung zur `cwd`-Ableitung (Annahme aus CONTEXT): war das
  Arbeitsverzeichnis der Sitzung die Repo-Wurzel, ja oder nein, und ist der
  Hook währenddessen irgendwann fälschlich mit „ohne Freigabe-Datei"
  gelaufen? Eine Zeile im Bericht, keine Änderung.

ESCALATE:
- `97afe1e` ist nicht in `main` → anhalten, melden, nicht vermuten.
- `git status` zu Beginn nicht sauber → anhalten, Ausgabe zeigen.
- Der Rot-Fall aus Punkt 6 oder Punkt 8 läuft NICHT ab, sondern der Befehl
  geht durch → sofort anhalten, nicht weiterbauen. Das ist ein
  Sicherheitsversagen des Kernstücks, keine kleine Abweichung.
- Der alte Hook in Punkt 7 weist die Datei **nicht** ab, sondern akzeptiert
  sie → anhalten und melden. Dann ist die Ursachenanalyse aus B2 falsch, und
  der Fix zielt auf das falsche Problem; das muss geklärt sein, bevor
  weitergebaut wird.
- Das Frischefenster läuft während Punkt 7 ab → nicht improvisieren, neue
  Freigabe bei mir anfordern und den Ablauf wiederholen.
- Ich antworte auf einen Halte-Punkt nicht → dort anhalten, nicht mit
  Ersatzlösungen weitermachen.
- `npm run check:template` wird rot → Ausgabe vollständig zeigen, anhalten.

FOLGT:
- Vertrag 6 (`harness-fix-6-werkzeug-katalog`) und Vertrag 7
  (`harness-fix-7-reibung-und-doktrin`) — untereinander frei in der
  Reihenfolge, beide fassen `state/memory-map.md` an und laufen deshalb
  nacheinander, nicht parallel. Schreibe ich, sobald du meldest, dass
  Vertrag 5 durch ist.
- Vertrag 8 (`harness-fix-8-start-klein`) zuletzt, weil er den Zustand
  beschreibt, den 5 bis 7 herstellen.

Zeig mir `git diff --staged` vollständig für den Abschluss-Commit (nach
erster Freigabe-Datei) und warte auf mein ausdrückliches „ja".

## Nachtrag 17.08.2026 — Korrektur des Testformats in Punkt 7

[Fakt] Punkt 7 verlangt einen Zeitstempel "mit Offset, Format
JJJJ-MM-TTThh:mm:ss+hh:mm". Ein erster Durchlauf am 17.08.2026 zeigte:
Entspricht der geschriebene Offset dem lokalen Offset, liest der alte Hook
denselben Zeitpunkt wie der neue — er schneidet den Offset ab und
interpretiert den Rest als Ortszeit, was sich rechnerisch aufhebt. Der
alte Hook ließ die Datei durch und verbrauchte sie.
[Schlussfolgerung] Das Testformat war untauglich, der Testfall konnte
nicht fehlschlagen. Befund B2 nennt als realistischen Fall ausdrücklich
einen UTC-Zeitstempel (`date -u -Is`); diese Eigenschaft ging beim
Schreiben des Vertrags verloren.
[Entschieden 17.08.2026] Punkt 7 wird mit einem UTC-Zeitstempel in der
Form JJJJ-MM-TTThh:mm:ssZ durchgeführt. Der übrige Ablauf bleibt
unverändert.

## Nachtrag 17.08.2026 — Sekundenbruchteile

[Fakt] Ein Commit-Versuch mit einer echten, vom Menschen im Editor
angelegten Freigabe-Datei wurde vom neuen Hook abgewiesen ("keine gültige
Zeile"). Diagnose gegen synthetische Daten (nicht gegen die echte Datei,
die für das Modell unerreichbar bleibt) fand keinen Fehler im Normalfall,
deckte aber einen echten Bug auf: Ein Zeitstempel mit Sekundenbruchteilen
(`2026-08-17T19:05:00.000Z`, die Form, die `new Date().toISOString()`
erzeugt) wurde zwar erkannt, aber falsch interpretiert — die Regex fasste
nur bis zu den ganzen Sekunden, der abgeschnittene Rest (`.000Z`) blieb
unberücksichtigt, und der verbleibende String wurde als Ortszeit gelesen
statt als UTC.
[Schlussfolgerung] Das ist dieselbe Fehlerklasse wie Befund B2
(abgeschnittener Suffix, Rest fälschlich als Ortszeit gelesen, zwei
Stunden Drift zwischen UTC und MESZ) — nur an einer anderen Stelle im
Zeitstempel. SCOPE Punkt 1 benannte Sekundenbruchteile nicht, weil sie beim
Schreiben des Vertrags nicht bedacht wurden, nicht weil sie als Nicht-Ziel
geprüft und verworfen wurden.
[Entschieden 17.08.2026] Wird in diesem Vertrag mitgefixt, nicht nur
gemeldet: Ein Commit, der "Zeitzone/Offset härten" verspricht und eine
bekannte Instanz derselben Fehlerklasse stehen lässt, wäre unehrlich.
`parseFreigabeZeitstempel` erfasst jetzt optional Sekundenbruchteile
zwischen Sekunden und Offset. Anker `^` und `m`-Flag unverändert.

[Fakt, Korrektur 17.08.2026] Der erste Fix (`(?:\.\d{1,3})?`, auf drei
Nachkommastellen begrenzt) war selbst zu eng: Ab vier Stellen greift
dieselbe Drift erneut — Python `datetime.isoformat()` liefert sechs
Stellen, PowerShell `Get-Date -Format o` sieben, `date -u -Ins` neun.
Ergänzend, und das ist der wichtigere Teil des Befunds: Ein Testfall mit
sieben Stellen und `+02:00` lief im ersten Durchlauf grün, aber nur
scheinbar korrekt — er ging durch, weil sich der abgeschnittene Rest und
der lokale Offset gegenseitig aufhoben, dieselbe Scheinkorrektheit wie im
ersten Kalibrierungsversuch zu Punkt 7 (siehe Nachtrag oben). Auf einer
Maschine in einer anderen Zeitzone wäre er gebrochen.
[Entschieden 17.08.2026] Fix korrigiert zu `(?:\.\d+)?` — beliebig viele
Nachkommastellen, keine willkürliche Obergrenze, die niemand mehr
begründen könnte. Vier Unit-Fälle insgesamt bestanden: zunächst zwei mit
drei Nachkommastellen (Millisekunden, `Z` bzw. `+02:00`), danach zwei
weitere mit sechs bzw. sieben Nachkommastellen gegen den korrigierten Fix,
siehe Kalibrierungs-Log in `state/gates.md`.
