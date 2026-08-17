<!--
[FÜLLUNG] Diese Datei ist zur Hälfte Skelett, zur Hälfte Füllung. Abschnitte
ohne Zusatz sind Skelett — Mechanik, unverändert übertragbar. Abschnitte mit
[FÜLLUNG] müssen pro Projekt neu geschrieben werden.
-->

# [PROJEKTNAME] — Master-Kontext

## Pflichtlektüre
Lies `ARCHITECTURE.md` bevor du Code schreibst. Alle Konventionen dort sind
verbindlich.

---

[FÜLLUNG] Ein Satz: Was ist das Produkt, für wen ist es.

---

## 🏗️ Technischer Stack [FÜLLUNG]

```
Framework:    ...
Sprache:      ...
Datenbank:    ...
Hosting:      ...
```

### Befehle [FÜLLUNG]

```
npm install
npm run dev
npm run check     # das Tor vor jedem Commit — Kette siehe package.json
```

`npm run check` ist die volle Kette inklusive Projekt-Lint/Typecheck/Test;
`npm run check:template` prüft nur den Harness selbst (Doku-Gate,
Regel-Gate, Vertragsprüfung), unabhängig vom Projektstack, und bleibt im
leeren Template grün.

---

## 📐 Arbeitsweise — IMMER einhalten

### Vor jeder Aufgabe: Briefing
```
1. Ziel der Iteration
2. Relevante Referenz (Design-Screenshot, Spec-Datei — je nach Projekt)
3. Komponenten/Module und Datenbedarf
4. Zustände: Default / Leer / Ladend / Fehler [FÜLLUNG bei UI: + Hover]
5. Akzeptanzkriterien
6. Risiken
```

### Iterationsprinzip
- Jede Iteration ist klein, prüfbar und abgeschlossen.
- Keine großen Funktionspakete auf einmal. Erst planen, dann umsetzen.
- Ein Task nach dem anderen pro Arbeitsverzeichnis — mehrere
  Arbeitsverzeichnisse (Worktrees) dürfen parallel laufen.
- Ein Schreiber pro Arbeitsverzeichnis. Keine zweite Sitzung im selben
  Ordner; parallele Arbeit nur in getrennten git-Worktrees.
- Ein Zielverzeichnis pro Auftrag. Hat eine Sitzung Zugriff auf mehrere
  Ordner, benennt jeder Auftrag sein Zielverzeichnis ausdrücklich und
  beginnt mit einer Prüfung des Arbeitsverzeichnisses — passt es nicht,
  wird abgebrochen statt gewechselt. Jeder Befehlsblock beginnt mit `cd`
  auf den vollständigen Pfad, nie mit einem relativen Sprung. Das gilt für
  Mensch und Modell gleichermaßen: Ein verfügbarer Zweitordner ist bequem
  und genau deshalb gefährlich.
- Iterationsende heißt: `git status` prüfen, Freigabe einholen, committen
  UND pushen (Skill `git-flow`). Eine Bremse ohne Gaspedal erzeugt Halden.
- Keine Versionsnummern in Prosa. Versionen stehen ausschließlich in der
  Paketdatei des Stacks.
- Zuschnitt-Heuristik für Handoff-Verträge: ein Baudurchgang plus höchstens
  eine Korrekturrunde ohne Eskalation, mit eigenständig prüfbarem Artefakt
  (Test + grünes `npm run check`). Abhängigkeit von einer vorherigen Phase
  ist kein Zuschnittsfehler, solange sie im CONTEXT-Abschnitt explizit
  benannt ist.

### Definition of Done
- [ ] Komponenten/Module sind wiederverwendbar
- [ ] Typisiert, kein `any` (oder Sprachäquivalent)
- [ ] Fehlerzustände berücksichtigt (catch + Logging)
- [ ] Leere Zustände berücksichtigt
- [ ] [FÜLLUNG, nur UI] Lange Texte zerstören das Layout nicht
- [ ] [FÜLLUNG, nur UI] Mobile Darstellung berücksichtigt; jeder Container
      mit max-width hat auch width: 100%
- [ ] [FÜLLUNG, nur UI] Design bleibt treu (Design-Tokens, keine neuen
      Farben/Schatten ohne Freigabe)
- [ ] Code ist sinnvoll kommentiert (Datei-Header + Funktionsdoku, siehe
      `docs/kommentar-standard.md`)
- [ ] `npm run check` → Exit 0
- [ ] KEINE Commits ohne explizite Freigabe

---

Aktueller Phasen-Stand & Scope: siehe `docs/STATUS.md`

---

## 🔧 Bestehende Helper (NUTZEN, nicht neu schreiben) [FÜLLUNG: Pfade]

Vor dem Schreiben neuer Utility-/Format-/Auth-Funktionen IMMER erst
`lib/utils/`, `lib/data/` und `lib/auth/` (oder die entsprechenden
Ordner des eigenen Stacks) prüfen.

---

## 🤖 Prüfrollen als Subagenten

Liegen als echte Subagenten in `.claude/agents/`: eigener Kontext, keine
Schreibrechte (`tools: Read, Grep, Glob`). Sie werden nicht gelesen, sondern
delegiert.

| Rolle | Wofür |
|---|---|
| `architecture-advisor` | Pläne VOR dem Bau prüfen |
| `code-reviewer` | Code nach dem Bauen prüfen |
| `qa` | Akzeptanztests und Randfälle definieren |
| `design-guardian` [FÜLLUNG, nur UI-Projekte] | Design-Treue gegen Referenzen prüfen |

Sie können ihre Befunde nicht selbst wegräumen — das ist Absicht. Ein
Prüfer mit Schreibrechten wird heimlich zum Autor.

---

## 🔄 Entscheidungsregel bei Unsicherheit

1. [FÜLLUNG, nur UI] Design-Referenz respektieren
2. Aktuellen Scope laut `docs/STATUS.md` einhalten
3. Wartbarkeit bevorzugen
4. Komplexität reduzieren
5. Entscheidung dokumentieren — niemals stillschweigend in Code verwandeln

---

## ✅ Status-Format (Jede Ausgabe endet damit)

```
## Status
- [ ] Freigegeben
- [ ] Freigegeben mit Hinweisen
- [ ] Nicht freigegeben
- [ ] Blockiert

## Nächster sinnvoller Schritt
...
```

## ⚠️ Bekannte Fallen

Drei der folgenden vier Fallen sind umgebungs-, nicht stackbedingt: Sie
gelten für jedes Projekt, das auf Windows, in einem cloudsynchronisierten
Ordner (OneDrive, Dropbox) oder über einen Sandbox-Mount entwickelt wird.
Alle drei wurden mehrfach real beobachtet.

- Symptom: `git add` übernimmt manche Dateien stillschweigend nicht
  (OneDrive-Reparse-Points).
- Was tun: Nach jedem `git add` von Binärdateien mit `git status` prüfen,
  ob sie wirklich staged sind.

- Symptom: `git status` meldet Dutzende unangetasteter Dateien als
  geändert, der Diff zeigt jede Zeile als ersetzt — tritt auf, wenn
  dasselbe Repo aus einer Linux-Umgebung betrachtet wird (gemountetes
  Windows-Verzeichnis). Ursache: Arbeitskopie hat CRLF, die Git-Datenbank
  LF, `core.autocrlf` dort nicht gesetzt.
- Was tun: Nicht von der Linux-Seite aus stagen oder committen. Windows-Git
  ist die maßgebliche Sicht. Gegenprüfen: `git diff --ignore-cr-at-eol`
  oder `file <datei>` gegen `git show HEAD:<datei> | cat -A`.

- Symptom: Ein Test-/Gate-Lauf scheitert einmalig ohne erkennbaren Grund
  (kein Code, keine Config geändert) und läuft beim nächsten Versuch grün.
- Was tun: Erst wiederholen, bevor man etwas repariert. Tritt es erneut
  auf: Uhrzeit, Umgebungszustand (z. B. laufende Cloud-Sync) festhalten —
  ohne diese Angaben bleibt der Fehler unerklärbar.

- [FÜLLUNG] Projektspezifische Fallen hier ergänzen, sobald sie zweimal
  aufgetreten sind. Eine einmalige Beobachtung ist noch kein Muster.
