/**
 * Datei: scripts/_mode.ts
 *
 * Zweck: Gemeinsame Modus-Logik für Scripts mit schreibendem Zugriff
 * (Datenbank, externe API, Dateisystem außerhalb des Repos).
 * SICHER PER DEFAULT: Ohne --execute wird NICHTS geschrieben (Dry-Run).
 *
 * Wichtig:
 * Neue Scripts mit Schreibzugriff verwenden dieses Modul statt einer eigenen
 * isDryRun/execute-Logik — eine gemeinsame Quelle statt einer Kopie pro Script.
 * Eine einzige Funktion statt zwei: Sie liest den Modus UND gibt den Banner aus,
 * damit kein Banner entstehen kann, der nicht zum tatsächlichen Modus passt.
 */

export function startScript(): boolean {
  const execute = process.argv.includes('--execute')

  console.log('═══════════════════════════════════════════════════')
  console.log(execute ? '  MODUS: SCHREIBEN (--execute)' : '  MODUS: DRY-RUN (kein Schreibzugriff)')
  console.log('═══════════════════════════════════════════════════\n')

  return execute
}
