<!--
[FÜLLUNG — GANZE DATEI] ARCHITECTURE.md ist Füllung, nicht Skelett: Die
Abschnittsstruktur unten hat sich in der Praxis bewährt, der Inhalt jedes
Abschnitts ist stackgebunden und entsteht in deinem Projekt neu.

Fülle sie erst, wenn du deine erste echte Architekturentscheidung getroffen
hast — vorher stehen hier Regeln, die nie geprüft wurden.

Aufteilungsregel: Ein Abschnitt wird eine eigene Datei, wenn drei Dinge
zutreffen — er trägt mindestens drei echte, belegte Entscheidungen · er
wird unabhängig vom Rest nachgeschlagen · er hat ein eigenes Gate. Vorher
bleibt er ein Abschnitt.

Bei jeder Abspaltung gelten zwei Pflichten: ein memory-map-Eintrag mit
„nicht hierhin"-Spalte, und ein Rückverweis aus ARCHITECTURE.md, damit
Prüfung 1 des Doku-Gates den Verfall fängt. `CLAUDE.md` muss danach sagen,
WANN welche Datei zu lesen ist, nicht nur DASS es sie gibt.
-->

# ARCHITECTURE.md — [PROJEKTNAME]

Pflichtlektüre vor jedem Commit. Verbindliche Code-Konventionen.

## 1. Ordnerstruktur

[FÜLLUNG]

## 2. Datenzugriff

[FÜLLUNG — z. B. ORM-Konventionen, Transaktionsgrenzen, wer darf schreiben]

## 3. Auth

[FÜLLUNG — Schichten benennen, falls mehrschichtig. Beispiel für eine
Web-Anwendung: Defense-in-Depth über drei Schichten (Middleware/Proxy,
Layout-Prüfung, Server-seitige Prüfung). Ein Pflichtdokument, das nur eine
von drei Schichten kennt, kann versehentlich unterlaufen werden.]

## 4. Fehlerbehandlung

[FÜLLUNG — Logging-Konvention, wann Sentry/Monitoring greift]

## 5. Kommentar-Standard

Siehe `docs/kommentar-standard.md`.

## 6. Test-Werkzeug

[FÜLLUNG — via `werkzeug-auswahl`-Skill entscheiden, nicht raten]

## 7. Verbotene Patterns

| Pattern | Warum verboten | Ausnahme |
|---|---|---|
| [FÜLLUNG] | | |

## 8. Definition of Done

Siehe `CLAUDE.md`. Projektspezifische Ergänzungen hier.
