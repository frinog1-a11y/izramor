# Through the Ripple — mini-game (easter egg /echelon)

*(Russian: «Сквозь Зыбь»)*

## Summary

A hidden page on the knowledge base site (an easter egg): a mini-game about sailing through the layers of the
Rift, with combat, bosses, lore notes and a final Canvas animation. Written entirely in vanilla JavaScript
(1,893 lines) and embedded into Quartz without a single audio file — all sound is synthesised in code. It opens
by a direct URL, a secret particle in the background, or by typing a code.

## Problem

The drawing checker's site is a serious tool, but the author wanted a way to show his circle what his technical
side can do: game mechanics, procedural sound and animation in the browser — without breaking anything in the
working section. The goal: a game experience living inside a static GitHub Pages site, not interfering with
navigation and needing no server side.

## Solution

1. Game logic lives in a static file, quartz/static/games/echelon.js (1,893 lines); the note only includes the
   script tag, because Quartz rejects inline scripts inside Markdown.
2. Hidden entry: the page is excluded from search, the graph, sitemap and RSS and marked noindex; it opens by a
   direct link, a secret particle in the astral background, or by typing the code E-C-H-E-L-O-N.
3. Game loop: Rift layers with growing darkness, shooting, collisions, a HUD and records.
4. Bosses: a fight after every layer, each boss with its own mechanic; the final boss moves around the arena.
5. Sound synthesis via the Web Audio API: tones, noise, chords, hits, victory and defeat — a dedicated
   AudioContext that respects the site-wide sound toggle.
6. Ambient layer "Breathing Mereya": drone, wind, crystals and pulsars, changing with the layer and with the
   combat state.
7. Lore notes: opened over the game with a pause, closed to continue.
8. Final cutscene: a Canvas animation (portal, fireworks) with buttons afterwards.
9. Visibility as a mechanic: on dark layers objects gain brightness and outlines, stars fade.
10. Testing without a browser: a build plus functional tests on document/Canvas/AudioContext stubs.

## Metrics

| Metric | Value |
|---|---|
| Time spent | not documented |
| Cost (API) | $0 — no separate spend: the game was built inside the knowledge base project (paid DeepSeek API there, see dev/02) |
| Commits | ≈ 12 of the 53 in the knowledge base repository |
| Files changed | 3 main (game logic, wrapper note, styles and builder) |
| Lines of code | 1,893 lines of game JavaScript (60.3 KB) plus game styles in custom.scss |
| Tools built | 5 test stubs in %TEMP% (document/Canvas/AudioContext) |
| Tests and automated checks | functional tests on stubs plus a Quartz build validating the generated HTML/CSS/JS |
| Users | not documented (a hidden page for a few people) |
| Live URL | https://frinog1-a11y.github.io/normcontrol-kb/echelon |

## Skills demonstrated

- Canvas game without libraries: game loop, collisions, state, HUD, records.
- Procedural sound with the Web Audio API: synthesis instead of files, respecting user settings.
- Dynamic layers and ambient music driven by game state.
- Direction: bosses with unique mechanics, lore interludes, a final animation.
- Embedding heavy JavaScript into a static site generator and working around its constraints.
- Hidden functionality: excluding a page from search, graph, sitemap and indexing; secret triggers.
- Testing UI logic in an environment without a browser (DOM and audio stubs).
- Iterative polishing after feedback: a series of "fix/improve" commits after the first playthrough.

## Stack

Vanilla JavaScript (ES2015+), Canvas 2D, Web Audio API, Quartz 4, SCSS, GitHub Pages.
No game engines and no audio libraries — by design.

## Limitations

- The first version of the game ("The Astronomer", with progression, constellations and a sandbox) was cut and
  replaced by Through the Ripple — only commits remain of it.
- There is no way to check visuals on the machine (no browser): balance and looks are reviewed by the owner on a
  phone.
- The game lives inside a single 1,893-line file — further growth will require splitting it into modules.
- Mobile controls are not documented in detail.

## Artifacts

- Game: https://frinog1-a11y.github.io/normcontrol-kb/echelon
- Code: quartz/static/games/echelon.js (60.3 KB) in the normcontrol-kb repository.
- Wrapper: content/echelon.md, styles in quartz/styles/custom.scss, hiding in quartz/util/hidden.ts.
- Commits: hiding and the access code, adding bosses/sounds/finale, replacing the first game, fixes for the
  cursor trail and background clicks.

## Next steps

- Split the game file into modules (sound, bosses, rendering, state).
- Tune the balance based on player feedback.
- Add mobile controls and hints.
- Record a short gameplay video for the portfolio.
