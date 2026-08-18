/**
 * Datei: scripts/check-docs.mjs
 *
 * Zweck: Prüft die Projektdokumentation auf Drift — Verweise, die ins Leere zeigen,
 * und Fakten, die an mehr als einer Stelle stehen.
 *
 * Herkunft: destilliert aus einem Produktivprojekt über mehrere Praxiszyklen.
 * Alle fünf Prüfungen sind Mechanik (Skelett) — die einzige Stelle mit
 * Stack-Bezug ist die Versions-Namensliste in Prüfung 2, unten als
 * Platzhalter markiert.
 *
 * Aufruf: node scripts/check-docs.mjs   (Teil von npm run check)
 * Exit 0 = sauber, Exit 1 = Befund gefunden
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const befunde = []

console.log('\n=== Doku-Check ===\n')

// ─── Prüfung 1: Zeigt jeder Pfad-Verweis auf etwas Existierendes? ───────────
//
// Geprüft werden nur ANWEISUNGSDOKUMENTE — was dort steht, wird befolgt.
// docs/STATUS.md ist bewusst nicht dabei: Eine Planungsdatei spricht per
// Definition über Dateien, die noch nicht oder nicht mehr existieren.
//
// Ausnahmen: Eine Zeile mit "check-docs-ignore:" wird übersprungen. Die
// Begründung steht dann im selben Kommentar — wie bei eslint-disable.

const agentDir = '.claude/agents'
const skillsDir = '.claude/skills'
const commandsDir = '.claude/commands'

function sammleSkillDateien(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((eintrag) => eintrag.isDirectory())
    .map((eintrag) => `${dir}/${eintrag.name}/SKILL.md`)
    .filter((pfad) => existsSync(pfad))
}

const anweisungsDateien = [
  'CLAUDE.md',
  'ARCHITECTURE.md',
  'README.md',
  'START-KLEIN.md',
  ...(existsSync(agentDir)
    ? readdirSync(agentDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => `${agentDir}/${f}`)
    : []),
  ...sammleSkillDateien(skillsDir),
  ...(existsSync(commandsDir)
    ? readdirSync(commandsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => `${commandsDir}/${f}`)
    : []),
]

const ausgeschlosseneVerzeichnisse = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'out',
])

function sammleDateinamen(dir, sammlung = new Set()) {
  for (const eintrag of readdirSync(dir, { withFileTypes: true })) {
    if (ausgeschlosseneVerzeichnisse.has(eintrag.name)) continue
    const pfad = join(dir, eintrag.name)
    if (eintrag.isDirectory()) {
      sammleDateinamen(pfad, sammlung)
    } else {
      sammlung.add(eintrag.name)
    }
  }
  return sammlung
}

const alleDateinamenImRepo = sammleDateinamen('.')

// Absichtlich abwesende Dateien (z. B. via .gitignore) sind kein toter
// Verweis — z. B. `.claude/settings.local.json`, die per SETUP.md Punkt 7
// nie committet werden soll. Ein Verweis darauf gilt nur dann als Befund,
// wenn die Datei weder existiert noch in .gitignore gelistet ist.
const gitignoreZeilen = existsSync('.gitignore')
  ? readFileSync('.gitignore', 'utf-8')
      .split('\n')
      .map((z) => z.trim())
      .filter((z) => z && !z.startsWith('#') && !z.startsWith('!'))
  : []

function istInGitignoreGelistet(pfad) {
  const basisname = pfad.split('/').pop()
  return gitignoreZeilen.some((zeile) => {
    const bereinigt = zeile.replace(/^\/+|\/+$/g, '')
    return bereinigt === pfad || bereinigt.split('/').pop() === basisname
  })
}

for (const datei of anweisungsDateien) {
  if (!existsSync(datei)) continue
  const zeilen = readFileSync(datei, 'utf-8').split('\n')

  zeilen.forEach((zeile, i) => {
    if (zeile.includes('check-docs-ignore:')) return

    for (const roh of new Set(
      zeile.match(/`[a-zA-Z0-9_\-./[\]]+\.(md|ts|tsx|js|mjs|json)`/g) ?? []
    )) {
      const pfad = roh.replaceAll('`', '')
      if (istInGitignoreGelistet(pfad)) continue

      if (pfad.includes('/')) {
        if (!existsSync(pfad)) {
          befunde.push(`${datei}:${i + 1}: Verweis auf \`${pfad}\` — Datei existiert nicht`)
        }
      } else if (!alleDateinamenImRepo.has(pfad)) {
        befunde.push(
          `${datei}:${i + 1}: Verweis auf \`${pfad}\` — Datei existiert nirgends im Repo`
        )
      }
    }
  })
}

// ─── Prüfung 2: Stehen Versionsnummern nur an der Paketdatei? ───────────────
//
// Eine Version an zwei Stellen ist an einer Stelle schon falsch — man weiß
// nur noch nicht, an welcher.
//
// [FÜLLUNG] Die Namensliste unten ist ein Platzhalter (Beispiel aus einem
// Next.js/Prisma-Projekt). Auf den eigenen Stack anpassen — z. B. für Expo:
// "Expo|React Native|EAS", für Solidity: "Solidity|Foundry|OpenZeppelin".

const versionsMuster = [
  /\bv?\d+\.\d+\.\d+\b/g,
  // Zahl muss ein `v`-Präfix ODER mindestens einen Punkt haben — sonst
  // greift das Muster an jeder Zahl nach einem großgeschriebenen Wort,
  // z. B. "Exit 0" in der Befehlsübersicht (kein Versionsverweis).
  /\b([A-Z][a-zA-Z.]*(?:\s[A-Z][a-zA-Z.]*)?)\s+(?:v\d[\d.]*|\d+\.\d[\d.]*)/g, // [FÜLLUNG]: Platzhalter, ersetzt konkrete Techniknamen
]

const istDatum = (treffer) => /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(treffer)

for (const datei of ['CLAUDE.md', 'ARCHITECTURE.md']) {
  if (!existsSync(datei)) continue
  const zeilen = readFileSync(datei, 'utf-8').split('\n')

  zeilen.forEach((zeile, i) => {
    if (zeile.includes('check-docs-ignore:')) return

    for (const muster of versionsMuster) {
      for (const treffer of new Set(zeile.match(muster) ?? [])) {
        if (istDatum(treffer)) continue
        befunde.push(
          `${datei}:${i + 1}: Versionsnummer "${treffer}" — Versionen gehören nur in die Paketdatei`
        )
      }
    }
  })
}

// ─── Prüfung 3: Widerspricht ein Datum im Text dem "Stand dieser Fassung:"-Marker? ──
//
// Geltungsbereich: rekursiv docs/harness/ und state/, nur .md-Dateien.
// Anker ist die VOLLE Phrase "Stand dieser Fassung:", nicht das Wort "Stand"
// allein — sonst Fehlalarme bei "Stand `<commit-hash>`" o. Ä.
//
// Datumsformate: TT.MM.JJJJ und JJJJ-MM-TT, strikte Ziffernlängen, damit
// Versionsnummern, Zeilenbereiche oder Commit-Hashes nicht als Datum gelesen
// werden.

const standMarker = 'Stand dieser Fassung:'
const standDatumsMuster = /\b\d{2}\.\d{2}\.\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g
const standMarkerZeile = /^\s*[>\-*]?\s*Stand dieser Fassung:\s*(\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})/

function sammleMarkdownDateien(dir, sammlung = []) {
  if (!existsSync(dir)) return sammlung
  for (const eintrag of readdirSync(dir, { withFileTypes: true })) {
    if (ausgeschlosseneVerzeichnisse.has(eintrag.name)) continue
    const pfad = join(dir, eintrag.name)
    if (eintrag.isDirectory()) {
      sammleMarkdownDateien(pfad, sammlung)
    } else if (pfad.endsWith('.md')) {
      sammlung.push(pfad)
    }
  }
  return sammlung
}

function parseDatum(treffer) {
  const de = treffer.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (de) return new Date(Number(de[3]), Number(de[2]) - 1, Number(de[1]))
  const [, jahr, monat, tag] = treffer.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return new Date(Number(jahr), Number(monat) - 1, Number(tag))
}

const geprüfteMarkdownDateien = [
  ...sammleMarkdownDateien('docs/harness'),
  ...sammleMarkdownDateien('state'),
]

for (const datei of geprüfteMarkdownDateien) {
  const zeilen = readFileSync(datei, 'utf-8').split('\n')

  const markerZeilen = []
  zeilen.forEach((zeile, i) => {
    if (standMarkerZeile.test(zeile)) markerZeilen.push(i)
  })

  if (markerZeilen.length === 0) continue

  if (markerZeilen.length > 1) {
    befunde.push(
      `${datei}:${markerZeilen[0] + 1}: mehrdeutiger Stand-Marker — "${standMarker}" erscheint mehrfach in dieser Datei`
    )
    continue
  }

  const [markerZeile] = markerZeilen
  const standTreffer = zeilen[markerZeile].match(standMarkerZeile)[1]
  const stand = parseDatum(standTreffer)

  zeilen.forEach((zeile, i) => {
    if (i === markerZeile) return
    if (zeile.includes('check-docs-ignore:')) return

    for (const treffer of new Set(zeile.match(standDatumsMuster) ?? [])) {
      if (parseDatum(treffer) > stand) {
        befunde.push(
          `${datei}:${i + 1}: Datum ${treffer} ist jünger als "Stand dieser Fassung: ${standTreffer}" (Zeile ${markerZeile + 1})`
        )
      }
    }
  })
}

// ─── Prüfung 4: Zieht ein Dokument-Paar den Marker der Zieldatei nach? ──────
//
// Erkennt Auslassung ZWISCHEN zwei Dateien — Prüfung 3 vergleicht nur
// INNERHALB einer Datei. [FÜLLUNG] Leer im Template. Sobald
// docs/harness/HARNESS-CHANGELOG.md und docs/harness/HARNESS-LEARNING-STATE.md
// beide echten Inhalt haben, das Paar eintragen (siehe SETUP.md Punkt 5).

const dokumentPaare = [
  // { quelle: 'docs/harness/HARNESS-CHANGELOG.md', ziel: 'docs/harness/HARNESS-LEARNING-STATE.md' },
]

for (const { quelle, ziel } of dokumentPaare) {
  if (!existsSync(quelle) || !existsSync(ziel)) continue
  const quellZeilen = readFileSync(quelle, 'utf-8').split('\n')

  let quellMaximum = null
  let quellMaximumTreffer = null
  quellZeilen.forEach((zeile) => {
    if (zeile.includes('check-docs-ignore:')) return
    for (const treffer of new Set(zeile.match(standDatumsMuster) ?? [])) {
      const datum = parseDatum(treffer)
      if (quellMaximum === null || datum > quellMaximum) {
        quellMaximum = datum
        quellMaximumTreffer = treffer
      }
    }
  })

  if (quellMaximum === null) continue

  const zielZeilen = readFileSync(ziel, 'utf-8').split('\n')
  const zielMarkerZeile = zielZeilen.findIndex((zeile) => standMarkerZeile.test(zeile))
  if (zielMarkerZeile === -1) continue

  const zielTreffer = zielZeilen[zielMarkerZeile].match(standMarkerZeile)[1]
  const zielDatum = parseDatum(zielTreffer)

  if (quellMaximum > zielDatum) {
    befunde.push(
      `${quelle}: jüngstes Datum ${quellMaximumTreffer} ist neuer als "Stand dieser Fassung: ${zielTreffer}" in ${ziel}:${zielMarkerZeile + 1} — Ziel-Datei nachziehen oder Marker aktualisieren`
    )
  }
}

// ─── Prüfung 5: Hedging-Wort ohne Evidenz-Marker im selben Absatz? ──────────
//
// Berichtsdateien unter state/ markieren unsichere Aussagen mit [Fakt],
// [Schlussfolgerung], [Annahme] oder [offene Unsicherheit] — ein
// Hedging-Wort wie "vermutlich" ohne einen dieser Marker im selben Absatz
// ist eine getarnte, nicht als solche gekennzeichnete Vermutung.
//
// Vergleich ist ABSATZWEISE (durch Leerzeile getrennter Block), nicht
// zeilenweise — ein Marker und das zugehörige Hedging-Wort können durch
// einen Markdown-Zeilenumbruch desselben Absatzes getrennt sein.
//
// Geltungsbereich ist NICHT rekursiv: nur direkte Kinder von state/, deren
// Name auf .md endet und "advisor-findings-" oder "review" enthält.

const hedgingWortMuster = /\b(vermutlich|wahrscheinlich|offenbar|scheinbar|anscheinend)\b/i
const evidenzMarkerMuster = /\[(Fakt|Schlussfolgerung|Annahme|offene Unsicherheit)\b/

const hedgingKandidaten = existsSync('state')
  ? readdirSync('state', { withFileTypes: true })
      .filter(
        (eintrag) =>
          eintrag.isFile() &&
          eintrag.name.endsWith('.md') &&
          (eintrag.name.includes('advisor-findings-') || eintrag.name.includes('review'))
      )
      .map((eintrag) => join('state', eintrag.name))
  : []

for (const datei of hedgingKandidaten) {
  const inhalt = readFileSync(datei, 'utf-8')
  const absätze = inhalt.split(/\n\s*\n/)

  for (const absatz of absätze) {
    if (!hedgingWortMuster.test(absatz)) continue
    if (evidenzMarkerMuster.test(absatz)) continue
    if (absatz.includes('check-docs-ignore:')) continue

    const auszug = absatz.trim().slice(0, 80)
    befunde.push(
      `${datei}: "${auszug}" — Hedging-Wort ohne Evidenz-Marker im selben Absatz — Marker ergänzen oder Formulierung schärfen`
    )
  }
}

// ─── Ergebnis ───────────────────────────────────────────────────────────────
if (befunde.length === 0) {
  console.log('✓ Keine Befunde.\n')
  process.exit(0)
}

console.log(`✗ ${befunde.length} Befund(e):\n`)
for (const b of befunde) console.log(`  - ${b}`)
console.log('')
process.exit(1)
