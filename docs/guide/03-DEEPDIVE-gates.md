# Deep Dive 3 — Gates: was maschinell durchgesetzt wird

## Der Kerngedanke

Ein **Gate** ist eine Prüfung, die stur Ja oder Nein sagt. Kein Ermessen,
kein „diesmal ausnahmsweise", keine Müdigkeit.

Alltagsvergleich: die Schranke am Bahnübergang. Sie diskutiert nicht, ob
du es eilig hast.

Das ist die Ebene, die tatsächlich hält. Alles, was dir wirklich wichtig
ist, sollte irgendwann hier landen — nicht in einem Dokument, das jemand
lesen müsste.

---

## Die vier Stufen im Template

```
  Beim Tippen       Vor dem Commit      Beim Commit-Versuch     Vor dem Merge
  ───────────       ──────────────      ────────────────────    ─────────────
  PostToolUse-Hook → npm run check   →  commit-guard.js      →  CI + Branch Protection
  (Linter, sofort)   (alles, lokal)     (PreToolUse, Bash)       (alles, fremde Maschine)

  schnell, eng       vollständig, deins  wer darf drücken        vollständig, unbestechlich
```

Jede Stufe fängt ab, was die vorige durchgelassen hat. Die letzte ist die
einzige, die du selbst nicht umgehen kannst — deshalb ist sie die
wichtigste.

Die dritte Stufe prüft etwas anderes als die übrigen drei: nicht
Codequalität, sondern **Autorisierung**. `npm run check` kann grün sein und
der Commit trotzdem nicht laufen — weil niemand ihn freigegeben hat.
`.claude/hooks/commit-guard.js` verweigert jeden `git commit`/`git push`
über das Modell, außer eine frische Einmal-Freigabe
(`state/freigabe-commit.md`, 10 Minuten Frischefenster) liegt vor; danach
löscht er sie sofort. Die Freigabe-Datei kann **nur im Editor des
Menschen** entstehen — `guard-settings.js` sperrt Edit/Write darauf, der
Commit-Guard selbst sperrt jeden Bash-Zugriff darauf. Könnte das Modell
sie sich selbst schreiben, wäre sie kein zweiter Schlüssel, sondern nur
eine Formalität, die sich selbst erfüllt.

---

## `npm run check` — das lokale Tor

Ein einziger Befehl, der fünf Prüfungen hintereinander laufen lässt:

```
lint  →  typecheck  →  check-docs.mjs  →  check-rules.mjs  →  test
```

Bricht eine ab, bricht alles ab. Es gibt kein „vier von fünf".

Der Sinn eines einzigen Befehls: Du musst dir nicht merken, welche
Prüfungen es gibt. Und wenn eine dazukommt, läuft sie ab sofort überall
mit — auch in der CI, auch bei Kollegen, ohne dass jemand etwas ändern muss.

**Anpassbar:** Was hinter `lint`, `typecheck` und `test` steckt, ist
projektspezifisch (im Template stehen dort Platzhalter). Die **Kette**
selbst ist die Mechanik und bleibt.

---

## `check-docs.mjs` — das Doku-Gate

Die interessanteste Datei im Repo, weil sie ein Problem löst, das die
meisten Projekte gar nicht als Problem erkennen: **Dokumentation, die
langsam falsch wird, ohne dass es jemandem auffällt.**

Fünf Prüfungen:

### Prüfung 1 — Zeigt jeder Dateiverweis auf etwas Existierendes?
Steht in CLAUDE.md „siehe `docs/design-system.md`" und die Datei gibt es
nicht, ist die Anweisung wertlos. Geprüft werden nur
**Anweisungsdokumente** — Dateien, deren Inhalt befolgt wird.

`docs/STATUS.md` ist bewusst ausgenommen: Ein Planungsdokument spricht per
Definition über Dateien, die noch nicht existieren.

### Prüfung 2 — Stehen Versionsnummern nur an einer Stelle?
Eine Version, die in der Paketdatei **und** im Fließtext steht, ist an
einer der beiden Stellen bereits falsch — man weiß nur noch nicht, an
welcher. Diese Prüfung erzwingt: Versionen stehen ausschließlich dort, wo
das Werkzeug sie ohnehin verwaltet.

*(Die Namensliste hier ist stackabhängig und mit `[FÜLLUNG]` markiert.)*

### Prüfung 3 — Widerspricht sich ein Dokument selbst?
Konvention: Eine Zeile `Stand dieser Fassung: 08.08.2026` erklärt eine
Datei für dieses Datum gültig. Steht im selben Dokument irgendwo ein
**jüngeres** Datum, wurde etwas ergänzt, ohne den Marker nachzuziehen —
die Datei behauptet also, aktueller zu sein, als sie ist. Das Gate meldet
das.

### Prüfung 4 — Ist ein Dokument gegenüber einem anderen zurückgeblieben?
Prüfung 3 schaut nur **innerhalb** einer Datei. Sie kann eine Datei nicht
erwischen, die schlicht **nie** angefasst wurde — denn eine nie
aktualisierte Datei ist in sich perfekt widerspruchsfrei.

Genau das ist real passiert: Ein Lerntagebuch blieb einen ganzen Zyklus
lang stehen. Kein Gate schlug an, weil kein Gate zwei Dateien miteinander
verglich. Prüfung 4 tut das jetzt: Sie koppelt zwei Dokumente, die sich
gemeinsam bewegen müssen.

Kommt im Template **leer** — du trägst dein erstes Paar ein, sobald beide
Dateien echten Inhalt haben (`SETUP.md` Punkt 5).

### Prüfung 5 — Getarntes Raten
Berichtsdateien markieren, wie sicher eine Aussage ist:

| Marker | Bedeutung |
|---|---|
| `[Fakt]` | überprüft, mit Beleg |
| `[Schlussfolgerung]` | aus Fakten abgeleitet |
| `[Annahme]` | nicht geprüft, bewusst angenommen |
| `[offene Unsicherheit]` | ungeklärt, bleibt offen |

Das Schlupfloch: Statt `[Annahme]` schreibt man „vermutlich" oder
„offenbar" — und schmuggelt eine ungeprüfte Behauptung an der Disziplin
vorbei, weil das Wort im Fließtext harmlos aussieht.

Prüfung 5 sucht in Berichtsdateien nach *vermutlich, wahrscheinlich,
offenbar, scheinbar, anscheinend* und meldet jedes Vorkommen, das im
selben **Absatz** keinen Evidenz-Marker hat.

*(Absatzweise, nicht zeilenweise: In Markdown gehören mehrere Zeilen zu
einem Absatz — ein Marker und das Wort können durch einen Umbruch getrennt
sein, ohne dass inhaltlich etwas fehlt.)*

**Warum das keine Wortklauberei ist:** In der Quell-Codebasis stand
zweimal eine falsche Behauptung in einer Doku, beide Male in ein
Hedging-Wort verpackt. Beide fielen erst auf, als jemand die zugrunde
liegende Datei tatsächlich las. Wer „vermutlich" schreibt, weiß, dass er
rät — er hat es nur nicht kenntlich gemacht.

### Der Notausgang
Jede Prüfung akzeptiert `check-docs-ignore:` als Kommentar in der Zeile —
**mit Begründung im selben Kommentar**. Wie bei einer Ausnahme im Linter:
erlaubt, aber sichtbar und begründet, nicht stillschweigend.

---

## `check-rules.mjs` — das Regel-Gate

Prüft projektspezifische Regeln im Code — nicht Textmuster, sondern
Struktur (z. B. „in diesem Ordner darf nie direkt auf die Datenbank
zugegriffen werden").

**Kommt im Template absichtlich leer.** Ein Harness ohne Regeln. Der
Grund: Eine Regel, die du dir ausgedacht hast, ohne dass der zugehörige
Fehler jemals passiert ist, ist ungeprüft — und kostet dich vom ersten Tag
an Reibung.

**Beförderungsregel:** Passiert derselbe Fehler dreimal, wird er zur
Regel. Vorher nicht.

---

## CI — dieselbe Prüfung auf fremder Maschine

**CI** heißt *Continuous Integration*: Bei jedem Push läuft `npm run check`
noch einmal auf einem frisch aufgesetzten Rechner in der Cloud.

Warum, wenn es lokal schon lief? Weil „bei mir läuft es" der ältesten
Fehlerquelle überhaupt entspricht: Auf deinem Rechner ist etwas
installiert, konfiguriert oder zwischengespeichert, was woanders fehlt. Die
CI hat nichts davon.

Zusätzlich läuft dort ein **Secret-Scan** (gitleaks): Er sucht nach
versehentlich eingecheckten Passwörtern und Zugangsschlüsseln. Ein einmal
gepushtes Passwort ist auch nach dem Löschen noch in der Historie — dieser
Scan ist deshalb einer der wenigen, bei denen „zu spät" wirklich zu spät
bedeutet.

---

## Branch Protection — das härteste Gate

**Was das ist:** Eine Einstellung bei GitHub, die festlegt: Auf den
Hauptzweig `main` kommt nichts, was nicht durch einen Pull Request und
einen grünen CI-Lauf gegangen ist.

**Begriffe kurz:**
- *Branch* — eine Arbeitskopie des Projekts. Du arbeitest nie direkt am
  Hauptstand, sondern in einem Zweig.
- *Pull Request (PR)* — der Antrag, den Zweig in den Hauptstand zu
  übernehmen. Der Ort, an dem geprüft wird.
- *Required Status Check* — der CI-Lauf, der grün sein muss, bevor der
  Antrag durchgeht.

**Der entscheidende Haken heißt „Do not allow bypassing the above
settings".** Ohne ihn darf der Repo-Besitzer — also du — das Gate im
Zweifel selbst umgehen. Ein Gate, das man umgehen kann, wenn man es eilig
hat, ist genau dann wirkungslos, wenn es gebraucht wird.

**Diese Einstellung kann kein Template mitliefern.** Sie existiert nur in
den GitHub-Einstellungen, nicht als Datei. Deshalb ist sie Punkt 1 in
`SETUP.md` und muss bei jedem neuen Projekt von Hand gesetzt werden.

**Wichtige Einschränkung, die man vorher wissen sollte:** Branch
Protection wird bei **privaten** Repos auf einem persönlichen
GitHub-Free-Konto **nicht durchgesetzt** — die Regel lässt sich anlegen,
GitHub zeigt sie aber als „Not enforced" an. Erforderlich sind GitHub Pro
oder ein Team-/Enterprise-Konto; bei öffentlichen Repos gilt die Regel
auch im Free-Tarif. Prüf das, bevor du dich auf dieses Gate verlässt —
sonst hältst du für gesichert, was nur beschriftet ist.
([GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches))

---

## Kalibrierung: ein Gate, das nie ausgelöst hat, ist ungeprüft

`state/gates.md` verlangt für jedes Gate zwei belegte Fälle:

- ein **Rot-Fall**: etwas, das es nachweislich blockiert hat
- ein **Grün-Fall**: etwas, das es nachweislich durchgelassen hat

Ohne beides weißt du nicht, ob das Gate funktioniert — nur, dass es
existiert. Ein Skript mit einem Tippfehler im Suchmuster meldet nie etwas
und sieht dabei genauso aus wie ein Skript, bei dem alles in Ordnung ist.

Deshalb: Nach dem Einrichten eines Gates einmal absichtlich dagegen
verstoßen und prüfen, dass es rot wird. Ergebnis mit Datum nach
`state/gates.md`.
