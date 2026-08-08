<!--
[FÜLLUNG — GANZE DATEI] Im Master-Briefing (claude-playbook/00-MASTER-
BRIEFING.md §7) ist ARCHITECTURE.md ausdrücklich als Füllung gelistet, nicht
als Skelett. Diese Datei ist ein leeres Gerüst mit den Abschnitten, die sich
in toolkompass bewährt haben — der Inhalt jedes Abschnitts ist stackgebunden
und entsteht neu.
-->

# ARCHITECTURE.md — [PROJEKTNAME]

Pflichtlektüre vor jedem Commit. Verbindliche Code-Konventionen.

## 1. Ordnerstruktur

[FÜLLUNG]

## 2. Datenzugriff

[FÜLLUNG — z. B. ORM-Konventionen, Transaktionsgrenzen, wer darf schreiben]

## 3. Auth

[FÜLLUNG — Schichten benennen, falls mehrschichtig (Beispiel toolkompass:
Defense-in-Depth über drei Schichten — Middleware/Proxy, Layout-Check,
Server-Action-Check). Ein Pflichtdokument, das nur eine von drei Schichten
kennt, kann versehentlich unterlaufen werden.]

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
