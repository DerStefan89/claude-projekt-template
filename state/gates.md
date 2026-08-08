<!-- Ziel-Pfad im Repo: state/gates.md -->
# Objective Gates — [PROJEKTNAME]

Jedes objektive (nicht-menschliche) Gate, das im Projekt läuft, mit
Kalibrierung: mindestens ein bekannter Fall, der es auslöst (rot), und
einer, der es nicht auslöst (grün). Ohne Kalibrierung ist ein Gate ein
ungeprüftes Versprechen.

| Gate | Datei | Prüft | Rot-Fall (bekannt) | Grün-Fall (bekannt) |
|---|---|---|---|---|
| Doku-Gate | `scripts/check-docs.mjs` | tote Verweise, Versionsnummern außerhalb package.json, Frische-Widerspruch in Einzeldokumenten, Frische-Widerspruch zwischen Dokumentenpaaren, Hedging-Wörter ohne Evidenz-Marker in state/Report-Dateien | [FÜLLUNG] | [FÜLLUNG] |
| Regel-Gate | `scripts/check-rules.mjs` | projektspezifische AST-Regeln | (leer bis zur ersten Regel) | (leer bis zur ersten Regel) |
| CI | `.github/workflows/ci.yml` | `npm run check` auf frischer Maschine + Secret-Scan | [FÜLLUNG] | [FÜLLUNG] |
| Branch Protection | GitHub-Repo-Einstellung, kein Datei-Artefakt (siehe SETUP.md Punkt 1) | Required Status Check `check` vor Merge auf `main`, ohne Admin-Bypass | [FÜLLUNG] | [FÜLLUNG] |
| `guard-settings.js`-Hook | `.claude/hooks/guard-settings.js` | Edit/Write auf geteilte `.claude/settings.json` | [FÜLLUNG] | [FÜLLUNG] |

## Kalibrierungs-Log

Neue Kalibrierungs-Nachweise hier ergänzen (Datum, Gate, Beobachtung),
nicht die Tabelle oben stillschweigend überschreiben.

[FÜLLUNG]
