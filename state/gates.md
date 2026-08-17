<!-- Ziel-Pfad im Repo: state/gates.md -->
# Objective Gates — [PROJEKTNAME]

Jedes objektive (nicht-menschliche) Gate, das im Projekt läuft, mit
Kalibrierung: mindestens ein bekannter Fall, der es auslöst (rot), und
einer, der es nicht auslöst (grün). Ohne Kalibrierung ist ein Gate ein
ungeprüftes Versprechen.

| Gate | Datei | Prüft | Rot-Fall (bekannt) | Grün-Fall (bekannt) |
|---|---|---|---|---|
| Doku-Gate | `scripts/check-docs.mjs` | tote Verweise, Versionsnummern außerhalb package.json, Frische-Widerspruch in Einzeldokumenten, Frische-Widerspruch zwischen Dokumentenpaaren, Hedging-Wörter ohne Evidenz-Marker in state/Report-Dateien | Testzeile `React v19, siehe \`keine/existierende/datei.md\`` (temporär in CLAUDE.md eingefügt) → 2 Befunde: toter Verweis + Versionsnummer | CLAUDE.md:79 `npm run check` → Exit 0 löst keinen Versionsnummer-Befund aus; README.md:34 verweist auf `settings.local.json`, das per .gitignore absichtlich fehlt → kein Befund |
| Regel-Gate | `scripts/check-rules.mjs` | projektspezifische AST-Regeln | (leer bis zur ersten Regel) | (leer bis zur ersten Regel) |
| CI | `.github/workflows/ci.yml` | `npm run check` auf frischer Maschine + Secret-Scan | [FÜLLUNG] | [FÜLLUNG] |
| Branch Protection | GitHub-Repo-Einstellung, kein Datei-Artefakt (siehe SETUP.md Punkt 1) | Required Status Check `check` vor Merge auf `main`, ohne Admin-Bypass | [FÜLLUNG] | [FÜLLUNG] |
| `guard-settings.js`-Hook | `.claude/hooks/guard-settings.js` | Edit/Write auf geteilte `.claude/settings.json` | [FÜLLUNG] | [FÜLLUNG] |
| Zwischenstand-Loop | `.claude/hooks/zwischenstand-pruefen.js` (PreCompact), `.claude/hooks/zwischenstand-laden.js` (SessionStart) | Frische des Zwischenstands vor manueller Compaction; Laden des Zwischenstands nach Sitzungsstart/`/clear` | Zwischenstandsdatei mit `Zuletzt aktualisiert:` älter als 60 Minuten (`2026-08-17T08:00` bei Lauf um `11:14`) → `decision: block` bei `trigger: manual` | Zwischenstandsdatei mit frischem Zeitstempel (`2026-08-17T11:15`) → kein Block bei `trigger: manual`; SessionStart mit `source: clear` liefert den Dateiinhalt als `additionalContext` |

## Kalibrierungs-Log

Neue Kalibrierungs-Nachweise hier ergänzen (Datum, Gate, Beobachtung),
nicht die Tabelle oben stillschweigend überschreiben.

- 2026-08-08, Doku-Gate: Bekannte Einschränkung der .gitignore-Auswertung
  in Prüfung 1 — sie matcht auch auf den reinen Basisnamen, nicht nur auf
  den vollen Pfad. Ein Pflichtdokument mit demselben Dateinamen wie ein
  .gitignore-Eintrag würde dadurch stumm bleiben, selbst wenn es an
  anderer Stelle im Repo existieren müsste. Aktuell nur vier generische
  Einträge ohne Pfad/Wildcard (`.env`, `.env.local`, `.DS_Store`,
  `Thumbs.db`), keiner davon ein plausibles Pflichtdokument — Risiko
  latent. Erneut bewerten, sobald .gitignore um weitere generische
  Dateinamen ergänzt wird.

- 2026-08-17, Zwischenstand-Loop: Rot- und Grün-Fall von Hand durchgespielt
  (Aufruf der Hooks direkt über stdin, kein echter Compaction-/Clear-Lauf).
  Rot: `state/zwischenstand/harness-fix-1-hooks-und-zwischenstand.md` mit
  `Zuletzt aktualisiert: 2026-08-17T08:00`, Lauf um `11:14` Uhr,
  `{"trigger":"manual"}` → `zwischenstand-pruefen.js` liefert
  `{"decision":"block", ...}`. Grün: dieselbe Datei mit
  `Zuletzt aktualisiert: 2026-08-17T11:15` → derselbe Aufruf liefert keine
  Ausgabe (kein Block), Exit 0. Zusätzlich `zwischenstand-laden.js` mit
  `{"source":"clear"}` aufgerufen: Ausgabe enthält den Dateiinhalt als
  `additionalContext` — bestätigt, dass der SessionStart-Matcher (V1.1,
  `clear` ergänzt) den Zwischenstand nach `/clear` lädt. Testdatei war
  nicht committet (per `.gitignore`, Ausnahme nur für `VORLAGE.md`) und
  wurde nach dem Test gelöscht.
