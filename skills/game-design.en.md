# Game design

## What it is

Designing game systems: mechanics, economy, progression, balance and the risk–reward link, verified by
calculation rather than by feel.

## Where it is confirmed

- `cases/creative/03-tavern-tales.en.md` — a card roguelike: 5 card types with rarity weights (Rare = 2,
  Common = 5, Frequent = 8), the progression "8 + Level × 2", a bartender economy of three drinks, the
  "Boasting" mechanic (voluntary difficulty ×3 for ×3 reward), success chance (S + 6 − D) / 6, triumph chance
  (S + 6 − D − 5) / 6 and the payback metric "Strength / Cost", plus balance tables in Excel.
- `cases/creative/02-dnd-module.en.md` — the "Shards of Faith" mechanic (bonuses for kind deeds: a dice re-roll,
  +1d4), encounter balance for levels 1–5, and social scenes as a full path through the adventure.
- `cases/creative/06-dnd-adaptation.en.md` — rules hacking: 4 races, 4 classes, a bestiary for the world,
  5+ official D&D adventures analysed, one session actually run.
- `cases/dev/03-echelon-mini-game.en.md` — a working mini-game of 1,893 lines: layers with changing visibility,
  a boss after every layer with its own mechanic, shooting, collisions, a HUD, records and a final Canvas animation.
- `cases/dev/04-echelon-beyond.en.md` — project documentation on the combat system and progression: the file
  TASKS.md in the game project repository (isometric camera, flagship movement, the "Light of Krona" zone, a combat
  system of 4 actions) and volume VII "Combat and Enemies" in the guidance set.

## Level

**Confident.** Justified:

- Balance is calculated, not guessed: probability and payback formulas are ready, together with working tables.
- There is a playable result, not just a description: the mini-game Through the Ripple opens from a public link
  and contains a full game loop with bosses.
- Three different genres: a tabletop role-playing game, a card roguelike and an arcade mini-game — the approach
  transfers between them.
- Why not "advanced": the card roguelike prototype is not built, there are no playtests or session statistics, and
  the D&D module balance has never been tested at a table.

## What it proves

- `cases/creative/03-tavern-tales.en.md` — formulas, balance tables and the economy scheme (private).
- `cases/creative/02-dnd-module.en.md` — the "Shards of Faith" mechanic and the adventure structure.
- `cases/dev/03-echelon-mini-game.en.md` — the game: https://frinog1-a11y.github.io/normcontrol-kb/echelon
  (the file quartz/static/games/echelon.js, 1,893 lines, 60 KB).
- `cases/dev/04-echelon-beyond.en.md` — the file TASKS.md in the game project repository and volume VII of the guidance.
