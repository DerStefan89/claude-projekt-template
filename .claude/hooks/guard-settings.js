// Blockiert Schreibzugriff (Edit/Write) auf zwei geteilte Dateien:
// - .claude/settings.json: Team-Policy (Permission-Freigaben gehoeren nach
//   .claude/settings.local.json, nicht hierher).
// - state/freigabe-commit.md: der zweite Schluessel des Commit-Guards
//   (.claude/hooks/commit-guard.js) - darf nicht vom Modell erzeugt werden,
//   sonst ist die Freigabe kein echter zweiter Schluessel mehr.
// "ask" wird von der VS-Code-Extension ignoriert (Issue #13339 im
// anthropics/claude-code-Repo) - daher "deny" statt Rueckfrage.
const GUARDED_FILES = [
  {
    path: ".claude/settings.json",
    suffix: "/.claude/settings.json",
    reason:
      "Schreibzugriff auf geteilte settings.json blockiert. Absichtliche " +
      "Aenderung: Hook in .claude/settings.json (hooks.PreToolUse) temporaer " +
      "entfernen, Grund im Commit nennen.",
  },
  {
    path: "state/freigabe-commit.md",
    suffix: "/state/freigabe-commit.md",
    reason:
      "Schreibzugriff auf state/freigabe-commit.md blockiert. Diese Freigabe " +
      "kann nur der Mensch im eigenen Editor anlegen - sonst ist sie kein " +
      "echter zweiter Schluessel fuer den Commit-Guard.",
  },
];

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = JSON.parse(input).tool_input?.file_path || "";
  } catch {}

  const normalized = filePath.replace(/\\/g, "/");
  const guarded = GUARDED_FILES.find(
    (f) => normalized === f.path || normalized.endsWith(f.suffix)
  );

  if (guarded) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: guarded.reason,
        },
      })
    );
  }
  process.exit(0);
});
