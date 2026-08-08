/**
 * Datei: .claude/hooks/zwischenstand-pruefen.js
 *
 * Zweck: PreCompact-Hook. Prüft, ob der Zwischenstand des aktuellen Branch
 * frisch ist (Zeile "Zuletzt aktualisiert:" nicht älter als 60 Minuten). Bei
 * manueller Compaction mit veraltetem/fehlendem Stand wird blockiert, bei
 * automatischer Compaction nur gewarnt, nie blockiert.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SCHWELLE_MINUTEN = 60;

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const eingabe = JSON.parse(input);
    const trigger = eingabe.trigger;

    if (trigger !== "manual" && trigger !== "auto") {
      process.exit(0);
    }

    const cwd = eingabe.cwd || process.cwd();

    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      encoding: "utf8",
    }).trim();

    const slug = branch.replace(/\//g, "-");
    const dateiPfad = path.join(cwd, "state", "zwischenstand", `${slug}.md`);

    let veraltet = true;
    if (fs.existsSync(dateiPfad)) {
      const inhalt = fs.readFileSync(dateiPfad, "utf8");
      const treffer = inhalt.match(
        /^Zuletzt aktualisiert:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?)/m
      );
      if (treffer) {
        const zeitstempel = new Date(treffer[1]);
        if (!isNaN(zeitstempel.getTime())) {
          const minutenAlt = (Date.now() - zeitstempel.getTime()) / 60000;
          veraltet = minutenAlt > SCHWELLE_MINUTEN;
        }
      }
    }

    if (!veraltet) {
      process.exit(0);
    }

    if (trigger === "manual") {
      process.stdout.write(
        JSON.stringify({
          decision: "block",
          reason:
            `Zwischenstand veraltet oder fehlt: ${dateiPfad}. ` +
            `Vor der Compaction den Zwischenstand schreiben (Abschnitte laut ` +
            `state/zwischenstand/VORLAGE.md, Zeile "Zuletzt aktualisiert:" aktuell setzen).`,
        })
      );
      process.exit(0);
    }

    process.stdout.write(
      JSON.stringify({
        systemMessage: `Zwischenstand veraltet oder fehlt (${dateiPfad}) — automatische Compaction läuft trotzdem durch.`,
      })
    );
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
