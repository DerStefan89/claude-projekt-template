/**
 * Datei: scripts/check-contract.mjs
 *
 * Zweck: Vertrags-Gate. Prüft jeden Handoff-Vertrag in state/tasks/ auf
 * Vollständigkeit nach dem Format aus .claude/skills/handoff-vertrag/SKILL.md:
 * die Präambel SCHRITT 0 plus die sieben Pflichtsektionen. `FOLGT` ist ein
 * eigener, bedingter achter Punkt und wird hier nicht geprüft.
 *
 * Acht Marker für sieben Sektionen, weil SCOPE und NICHT je einen eigenen
 * Marker brauchen: `## TASK:`, `GOAL:`, `CONTEXT:`, `SCOPE:`, `NICHT:`,
 * `BUDGET:`, `OUTPUT:`, `ESCALATE:`.
 *
 * Aufruf: node scripts/check-contract.mjs   (Teil von npm run check:template)
 * Exit 0 = sauber, Exit 1 = Befund gefunden
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const befunde = []

console.log('\n=== Vertrags-Check ===\n')

const tasksDir = 'state/tasks'

if (!existsSync(tasksDir)) {
  console.log('ⓘ kein Vertragsverzeichnis, nichts zu prüfen\n')
  process.exit(0)
}

const vertragsDateien = readdirSync(tasksDir, { withFileTypes: true })
  .filter((eintrag) => eintrag.isFile() && eintrag.name.endsWith('.md'))
  .map((eintrag) => join(tasksDir, eintrag.name))

if (vertragsDateien.length === 0) {
  console.log('ⓘ 0 Verträge geprüft\n')
  process.exit(0)
}

const pflichtMarker = [
  '## TASK:',
  'GOAL:',
  'CONTEXT:',
  'SCOPE:',
  'NICHT:',
  'BUDGET:',
  'OUTPUT:',
  'ESCALATE:',
]

for (const datei of vertragsDateien) {
  const inhalt = readFileSync(datei, 'utf-8')

  if (!inhalt.trimStart().startsWith('SCHRITT 0')) {
    befunde.push(`${datei}: SCHRITT 0 (Präambel) fehlt oder steht nicht am Anfang`)
  }

  for (const marker of pflichtMarker) {
    if (!inhalt.includes(marker)) {
      befunde.push(`${datei}: Marker "${marker}" fehlt`)
    }
  }
}

// ─── Ergebnis ───────────────────────────────────────────────────────────────
if (befunde.length === 0) {
  console.log(`✓ ${vertragsDateien.length} Vertrag/Verträge geprüft, keine Befunde.\n`)
  process.exit(0)
}

console.log(`✗ ${befunde.length} Befund(e):\n`)
for (const b of befunde) console.log(`  - ${b}`)
console.log('')
process.exit(1)
