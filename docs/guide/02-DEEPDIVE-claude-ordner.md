# Deep Dive 2 — Der `.claude/`-Ordner: Agents, Skills, Hooks, MCPs

Dieser Ordner ist die Werkzeugkiste. Vier Unterordner, vier völlig
verschiedene Dinge — die meistverwechselten Begriffe im ganzen Harness.

```
.claude/
├── settings.json     ← Berechtigungen + Automatik-Verdrahtung (geteilt)
├── agents/           ← Prüfrollen: KIs, die deine Arbeit kontrollieren
├── skills/           ← Arbeitsanleitungen: KIs, die dir Arbeit abnehmen
├── commands/         ← Kurzbefehle, die du selbst tippst (/lessons)
└── hooks/            ← Automatik: läuft von selbst bei bestimmten Ereignissen
```

**Die Merkhilfe:**

| | Wer startet es? | Was tut es? |
|---|---|---|
| **Agent** | die KI (weil die Aufgabe passt) | prüft, meldet Befunde, ändert nichts |
| **Skill** | die KI (weil die Aufgabe passt) | erklärt ein Verfahren, arbeitet mit |
| **Command** | **du** (`/name` eintippen) | löst eine feste Handlung aus |
| **Hook** | **niemand** — Ereignis löst aus | läuft automatisch, immer |
| **MCP** | die KI (wenn sie Daten braucht) | verbindet zu einem externen Dienst |

---

## Agents (Prüfrollen)

**Was das ist:** Eine eigene KI-Instanz mit eigenem Kontextfenster, eigener
Anweisung und — entscheidend — **eingeschränkten Rechten**.

Alltagsvergleich: der TÜV-Prüfer. Er darf schauen, messen und Mängel
protokollieren. Er darf dein Auto nicht reparieren. Genau diese Trennung
macht seinen Bericht glaubwürdig.

**Was im Template liegt (drei Stück, alle mit `tools: Read, Grep, Glob` —
also nur Lesen, Suchen, Dateien finden):**

| Agent | Wann | Was er sucht |
|---|---|---|
| `architecture-advisor` | **vor** dem Bauen, wenn ein Plan Nebenwirkungen hat | unbelegte Annahmen, unnötige Komplexität, fehlende Fehlerpfade |
| `code-reviewer` | **nach** dem Bauen | Wartbarkeit, Robustheit, Abweichung von ARCHITECTURE.md |
| `qa` | bevor etwas „fertig" heißt | Randfälle, fehlende Akzeptanztests, Nutzersicht |

Ein vierter, `design-guardian`, liegt **absichtlich nicht** in
`.claude/agents/`, sondern als Vorlage in
`docs/examples/design-guardian.example.md`. Grund: Er prüft Design-Treue
gegen Referenzbilder. Bei einem Projekt ohne Oberfläche (Automatisierung,
Datenverarbeitung) prüft er nichts und verwirrt nur. Bei einem
UI-Projekt kopierst du ihn hinüber — Anleitung in `SETUP.md` Punkt 2.

**Der wichtigste Punkt:** Agents haben **frischen Kontext**. Sie sehen
nicht dein bisheriges Gespräch. Das ist kein Nachteil, sondern der Zweck:
Sie sind nicht durch die Argumentationskette beeinflusst, mit der du dich
selbst überzeugt hast.

**Für Nicht-Software-Projekte:** Die Rollen sind übertragbar. Bei einer
KI-Videoproduktion prüft der „Advisor" das Storyboard vor der Produktion,
der „Reviewer" den fertigen Schnitt gegen das Briefing, die „QA"-Rolle
fragt, ob das Video ohne Ton verständlich ist und was bei einem
Zuschauer passiert, der den Kontext nicht kennt. Die Datei-Struktur bleibt
identisch, nur die Prüfkriterien werden ausgetauscht.

---

## Skills (Arbeitsanleitungen)

**Was das ist:** Eine Anleitung für ein wiederkehrendes Verfahren, die die
KI **nur dann lädt, wenn sie gebraucht wird**. Jeder Skill ist ein Ordner
mit einer `SKILL.md` darin.

Alltagsvergleich: das Kochbuch im Regal. Es liegt nicht permanent
aufgeschlagen auf der Arbeitsfläche (das wäre CLAUDE.md), sondern wird
gezogen, wenn genau dieses Gericht ansteht.

Der Unterschied zu Agents: Ein Agent **kontrolliert** dich. Ein Skill
**hilft** dir. Ein Agent hat keine Schreibrechte, ein Skill schon.

**Die sieben Skills im Template:**

| Skill | Wofür |
|---|---|
| `spec-schreiben` | Aus einem vagen Wunsch eine prüfbare Beschreibung machen — *bevor* gebaut wird |
| `advisor-pass` | Das Verfahren: Plan v1 als Datei → Advisor prüft → Plan v2 als **neue** Datei (v1 bleibt erhalten) |
| `handoff-vertrag` | Eine Aufgabe so aufschreiben, dass eine andere Sitzung sie ohne Rückfragen erledigen kann |
| `werkzeug-auswahl` | Bevor ein neues Werkzeug installiert wird: Bedarf klären, Herkunft prüfen |
| `repo-audit` | Ist-Stand-Scan: Was behauptet die Doku, was steht wirklich da? |
| `git-flow` | Der Ablauf Branch → Commit → Push → Pull Request, mit Freigabe-Halt an der richtigen Stelle |
| `ponytail` | Fremd-Skill (MIT-Lizenz, von github.com/DietrichGebert/ponytail): erkennt überkomplizierte Lösungen und fragt nach der einfachen |

**Warum `ponytail` fremd ist und das dokumentiert wird:** Übernommener
Code oder übernommene Anleitungen bekommen im Kopf der Datei einen
Herkunftsvermerk mit Quelle, Version und Datum — plus die Regel: Änderungen
gehen zuerst an die Originalquelle, nicht in die eigene Kopie. Sonst hast
du nach einem halben Jahr eine Version, die weder deine noch die fremde ist.

---

## Hooks (Automatik)

**Was das ist:** Ein kleines Programm, das bei einem bestimmten Ereignis
**von selbst** startet — ohne dass jemand es aufruft.

Alltagsvergleich: der Rauchmelder. Niemand drückt ihn. Er reagiert auf ein
Ereignis, und zwar auch dann, wenn alle schlafen.

**Die fünf Verdrahtungen in `.claude/settings.json`:**

| Ereignis | Was passiert | Warum |
|---|---|---|
| `PreToolUse` bei Edit/Write | `guard-settings.js` prüft, ob die geteilte `.claude/settings.json` geändert werden soll — und **blockiert** das | Berechtigungen sind Team-Policy. Persönliche Freigaben gehören in `settings.local.json`, die nie committet wird |
| `PostToolUse` bei Edit/Write | Linter läuft automatisch | Fehler auffallen lassen, solange der Kontext noch frisch ist — nicht erst beim Commit |
| `UserPromptSubmit` | `session-reminder.js` erinnert alle 30 Nachrichten an Kontext-Hygiene | Nach 30 Nachrichten hat man vergessen, wie voll der Kontext ist |
| `SessionStart` | `zwischenstand-laden.js` liest `state/zwischenstand/<branch>.md` und gibt ihn der neuen Sitzung mit | Das Gegenmittel gegen „die KI vergisst alles" |
| `PreCompact` | `zwischenstand-pruefen.js` blockiert eine **manuelle** Zusammenfassung, wenn der Zwischenstand fehlt oder älter als 60 Minuten ist | Verdichten ohne gesicherten Stand = Arbeit verlieren |

**Zwei Feinheiten, die zeigen, wie sorgfältig Hooks gebaut sein müssen:**

- `zwischenstand-laden.js` beendet sich bei **jedem** Fehler still mit
  Erfolgscode. Begründung steht im Dateikopf: Ein Hook, der den
  Sitzungsstart scheitern lässt, ist schlimmer als gar kein Hook.
- `zwischenstand-pruefen.js` blockiert nur bei **manueller** Verdichtung.
  Bei automatischer warnt er nur — weil du dort ohnehin nicht eingreifen
  könntest und eine Blockade dich nur festfahren würde.

**Compaction / Verdichtung:** Wenn das Kontextfenster voll ist, fasst
Claude Code das bisherige Gespräch zusammen und arbeitet mit der
Zusammenfassung weiter. Dabei gehen Details verloren — deshalb die
Absicherung durch den Zwischenstand.

---

## Commands (Kurzbefehle)

**Was das ist:** Ein Textbaustein, den du mit `/name` aufrufst. Im
Template liegt einer: `/lessons`.

Alltagsvergleich: der Kurzwahltaste am Telefon. Spart Tippen, mehr nicht —
aber bei einem Ablauf, den du wöchentlich brauchst, ist das viel wert.

---

## MCPs (Anbindung an externe Dienste)

**Was das ist:** MCP steht für *Model Context Protocol* — eine
standardisierte Steckverbindung, über die eine KI mit einem externen Dienst
sprechen kann: Google Drive, Slack, eine Datenbank, ein Projekttool.

Alltagsvergleich: der USB-Anschluss. Nicht das Gerät selbst, sondern die
genormte Buchse, in die verschiedene Geräte passen.

**Im Template ist absichtlich kein einziger MCP eingerichtet.** Das ist
kein Versäumnis, sondern die Anwendung derselben Regel wie bei jedem
anderen Werkzeug: Erst den Bedarf klären, dann die Herkunft prüfen, dann
installieren — der Skill `werkzeug-auswahl` führt dich durch genau diesen
Ablauf, und das Ergebnis (auch ein „brauchen wir nicht") kommt nach
`state/tooling.md`.

**Warum das bei MCPs besonders wichtig ist:** Ein MCP bekommt Zugriff auf
echte Daten und echte Konten. Ein schlecht geprüfter MCP ist kein
Stilproblem, sondern ein Sicherheitsproblem. Prüf vor jeder Installation:
Wer hat ihn geschrieben, welche Rechte verlangt er, brauchst du wirklich
Schreib- oder reicht Lesezugriff.

**Kostenhinweis:** Jeder aktive MCP legt seine Werkzeugbeschreibungen ins
Kontextfenster — in jeder Sitzung, ob genutzt oder nicht. Zehn
angeschlossene Dienste können mehrere Tausend Tokens pro Sitzung kosten,
bevor du das erste Wort geschrieben hast. Mehr dazu in `07-TOKEN-SPAREN.md`.

---

## settings.json vs. settings.local.json

| Datei | Inhalt | Committet? |
|---|---|---|
| `.claude/settings.json` | Team-Policy: Hook-Verdrahtung, Grundberechtigungen | **Ja** — alle im Projekt teilen sie |
| `.claude/settings.local.json` | Deine persönlichen Freigaben | **Nein** — steht in `.gitignore` |

Der `guard-settings.js`-Hook blockiert Schreibzugriff auf die erste Datei.
Nicht aus Misstrauen, sondern weil eine Berechtigung, die im
Vorbeigehen erteilt wurde, niemand reviewt. Wenn du wirklich die
Team-Policy ändern willst: Hook-Eintrag kurz entfernen, Änderung machen,
Grund im Commit nennen, Hook wieder einsetzen. Der Umweg ist der Zweck.

**Grenze von `guard-settings.js`:** Der Hook matcht nur `Edit` und `Write`.
Ein Schreibvorgang per Bash (z. B. `echo ... > .claude/settings.json`) läuft
an ihm vorbei. Diese Lücke ist bekannt und bleibt in diesem Stand offen —
sie wird zusammen mit dem Commit-Guard geschlossen, weil beide denselben
`Bash`-Matcher brauchen. Bis dahin gilt unverändert: `.claude/settings.json`
ist Team-Policy und wird vom Menschen geändert, nicht vom Modell.

**Sicherheitshinweis aus der Praxis:** In der Quell-Codebasis fanden sich
in `settings.local.json` Freigaben wie `Bash(git commit *)` und
`Bash(git push *)` — vermutlich einmal im Eifer erteilt und nie
zurückgenommen. Das hebelt die wichtigste Regel des Projekts aus („keine
Commits ohne Freigabe"), ohne dass es irgendwo auffällt. Schau da
gelegentlich rein.
