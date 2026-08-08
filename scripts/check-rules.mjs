/**
 * Datei: scripts/check-rules.mjs
 *
 * Zweck: Architektur-Regel-Gate. Leerer Harness — Mechanik ohne Regeln.
 * Die Mechanik (eigene AST-Regeln über die TypeScript Compiler API) trägt
 * für jeden TypeScript-Stack unverändert (Next.js, Expo, reines Node).
 * Für Solidity oder andere Sprachen: andere Compiler-API, gleiches Prinzip.
 *
 * [FÜLLUNG] Die eigentlichen Regeln kommen aus echten Wiederholungen im
 * eigenen Code. Beförderungsregel: Taucht derselbe Fehler dreimal auf, wird
 * er zur Regel — vorher nicht.
 *
 * Muster für eine echte Regel (Beispiel aus einem Datenbank-Projekt):
 * "jedes Objekt-Literal mit `take` ohne `skip` im selben Literal ist ein
 * Befund" — per ts.forEachChild über den AST jeder .ts/.tsx-Datei.
 *
 * Aufruf: node scripts/check-rules.mjs   (Teil von npm run check)
 * Exit 0 = sauber, Exit 1 = Befund gefunden
 */

// Kein statischer Import von 'typescript' hier — das Paket wird erst mit
// der ersten echten Regel als devDependency gebraucht. Der leere Harness
// muss ohne diese Abhängigkeit laufen, siehe dynamischer Import unten.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const befunde = []

console.log('\n=== Regel-Check ===\n')

const ausgeschlosseneVerzeichnisse = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  '.next',
  '.git',
])

function sammleTsDateien(dir, sammlung = []) {
  for (const eintrag of readdirSync(dir, { withFileTypes: true })) {
    if (ausgeschlosseneVerzeichnisse.has(eintrag.name)) continue
    const pfad = join(dir, eintrag.name)
    if (eintrag.isDirectory()) {
      sammleTsDateien(pfad, sammlung)
    } else if (pfad.endsWith('.ts') || pfad.endsWith('.tsx')) {
      sammlung.push(pfad)
    }
  }
  return sammlung
}

// ─── [FÜLLUNG] Hier eigene Regeln registrieren ──────────────────────────────
//
// Jede Regel ist eine Funktion (sourceFile, dateiPfad) => void, die bei
// einem Fund `befunde.push(...)` aufruft. Traversal-Vorlage:
//
// function meineRegel(sourceFile, dateiPfad) {
//   function besuche(node) {
//     // z. B.: if (ts.isCallExpression(node) && ...) { befunde.push(...) }
//     ts.forEachChild(node, besuche)
//   }
//   besuche(sourceFile)
// }
//
// const regeln = [meineRegel]
const regeln = []

if (regeln.length > 0) {
  const { default: ts } = await import('typescript')
  const dateien = sammleTsDateien('.')
  for (const dateiPfad of dateien) {
    const inhalt = readFileSync(dateiPfad, 'utf-8')
    const sourceFile = ts.createSourceFile(
      dateiPfad,
      inhalt,
      ts.ScriptTarget.Latest,
      true
    )
    for (const regel of regeln) {
      regel(sourceFile, dateiPfad)
    }
  }
}

// ─── Ergebnis ───────────────────────────────────────────────────────────────
if (regeln.length === 0) {
  console.log('ⓘ Keine Regeln registriert — leerer Harness (siehe SETUP.md Punkt 4).\n')
  process.exit(0)
}

if (befunde.length === 0) {
  console.log('✓ Keine Befunde.\n')
  process.exit(0)
}

console.log(`✗ ${befunde.length} Befund(e):\n`)
for (const b of befunde) console.log(`  - ${b}`)
console.log('')
process.exit(1)
