// Zählt Nachrichten pro Session und erinnert alle 30 an Kontext-Hygiene.
const fs = require("fs");
const os = require("os");
const path = require("path");

const INTERVALL = 30;

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  let sessionId = "unbekannt";
  try {
    sessionId = JSON.parse(input).session_id || "unbekannt";
  } catch {}

  const datei = path.join(os.tmpdir(), `cc-count-${sessionId}.txt`);
  let zaehler = 0;
  try {
    zaehler = parseInt(fs.readFileSync(datei, "utf8"), 10) || 0;
  } catch {}
  zaehler++;
  fs.writeFileSync(datei, String(zaehler));

  if (zaehler % INTERVALL === 0) {
    process.stdout.write(
      JSON.stringify({
        systemMessage:
          `Kontext-Hygiene: ${zaehler} Nachrichten in dieser Session. ` +
          `Pruefe mit /context, wie voll das Fenster ist. ` +
          `Bei Themenwechsel: /clear oder frischer Chat. ` +
          `Hat dich etwas aufgehalten? Eine Zeile nach state/reibung.md.`,
      })
    );
  }
  process.exit(0);
});
