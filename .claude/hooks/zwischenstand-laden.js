/**
 * Datei: .claude/hooks/zwischenstand-laden.js
 *
 * Zweck: SessionStart-Hook. Liest state/zwischenstand/<branch-slug>.md und gibt
 * den Inhalt als additionalContext aus, damit eine neue Sitzung den
 * Rückwärts-Handoff automatisch bekommt.
 *
 * Wichtig: Jeder Fehler (kein Git-Repo, keine Datei, Lesefehler) führt zu
 * stiller Rückkehr mit Exit 0 — ein Hook, der den Sitzungsstart scheitern
 * lässt, ist schlimmer als kein Hook.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const MAX_ZEICHEN = 9500;

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    let cwd = process.cwd();
    try {
      const eingabe = JSON.parse(input);
      if (eingabe.cwd) cwd = eingabe.cwd;
    } catch {}

    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      encoding: "utf8",
    }).trim();

    const slug = branch.replace(/\//g, "-");
    const dateiPfad = path.join(cwd, "state", "zwischenstand", `${slug}.md`);

    if (!fs.existsSync(dateiPfad)) {
      process.exit(0);
    }

    let inhalt = fs.readFileSync(dateiPfad, "utf8");

    if (inhalt.length > MAX_ZEICHEN) {
      inhalt =
        inhalt.slice(0, MAX_ZEICHEN) +
        `\n\n[GEKÜRZT — vollständige Datei: ${dateiPfad}]`;
    }

    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: inhalt,
        },
      })
    );
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
