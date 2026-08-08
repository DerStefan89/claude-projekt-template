// Blockiert Schreibzugriff auf die geteilte, committete .claude/settings.json
// (Permission-Freigaben gehoeren nach .claude/settings.local.json, nicht
// hierher). "ask" wird von der VS-Code-Extension ignoriert (Issue #13339
// im anthropics/claude-code-Repo) - daher "deny" statt Rueckfrage.
const GUARDED_SUFFIX = "/.claude/settings.json";

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = JSON.parse(input).tool_input?.file_path || "";
  } catch {}

  const normalized = filePath.replace(/\\/g, "/");
  const isGuarded =
    normalized === ".claude/settings.json" ||
    normalized.endsWith(GUARDED_SUFFIX);

  if (isGuarded) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "Schreibzugriff auf geteilte settings.json blockiert. Absichtliche " +
            "Aenderung: Hook in .claude/settings.json (hooks.PreToolUse) temporaer " +
            "entfernen, Grund im Commit nennen.",
        },
      })
    );
  }
  process.exit(0);
});
