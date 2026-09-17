# Tavern Tales — balancing a card roguelike

*(Russian: «Таверные Саги»)*

**Type:** Self-initiated / AI-assisted / Creative R&D
**Section:** creative
**Role:** Narrative designer and world author; setting system design and balance tasks
**Year:** 2026
**Status:** prototype (formulas and balance tables, concept document)

## Summary

A narrative card roguelike: the player tells stories in a tavern and the system judges the boasting. In spirit
it is a mix of Munchkin × Balatro × a drinking-stories simulator. The work was done by three participants: the
co-author ("Kaizera") owned the mechanics, the author owned narrative and the world, and the AI assistant Lorien
handled system design, balance and maths.

## Problem

In card roguelikes narrative and maths live apart: the text promises feats and the numbers test luck only. A
model was needed where a "told story" is a gameplay decision with a calculable risk: the player deliberately
chooses whether to exaggerate a feat and knows the price and the reward in advance. The extra difficulty was
balance: cards and drinks must not produce a single winning line, but must not turn the game into pure chance
either.

## Solution

1. Five card types of "Stories": Feats, Adventures, Failures, Exaggerations, Contrasts — rarity is set by
   weights (Rare = 2, Common = 5, Frequent = 8), so the price of a mistake depends on rarity.
2. Difficulty progression by the formula "8 + Level × 2": difficulty grows linearly and predictably, and the
   player sees the pace of escalation.
3. A bartender economy of three drinks: the Brave's Ale, the Wine of Lies, the Water of Truth — a consumable
   that changes probability rather than simply restoring a resource.
4. The "Boasting" mechanic: the player voluntarily triples the difficulty and receives triple the reward —
   conscious risk instead of mandatory grinding.
5. A second shared mechanic, "Shards of Faith" (echoing the D&D module): an accumulating currency for
   successful decisions.
6. A probability model: success chance (S + 6 − D) / 6, triumph chance (S + 6 − D − 5) / 6, plus a separate
   payback metric "Strength / Cost" — balance was verified by calculation, not by feel.
7. Excel balance tables: cards by type and rarity, drinks, difficulty thresholds, card payback — a single
   working document for edits.
8. A concept document: genre, game loop, economy, the escalation scheme, the role of narrative.
9. An economy scheme: how rewards, risks and consumables relate, so that no single strategy dominates.
10. Clear ownership inside the team: mechanics, world and system calculation are assigned to different
    participants, with explicit handover points.

## Metrics

| Metric | Value |
|---|---|
| Time spent | not documented (the project ran for about a year) |
| Content | 5 card types with weights (2/5/8), progression "8 + Level × 2", 3 economy drinks, 2 formulas (number of cards in the set not recorded) |
| Users | a team of 3 participants: the co-author on mechanics, the author (narrative and world), and the AI assistant Lorien (system design, balance, maths) |
| Live URL | none — the prototype exists as documents and tables |
| Team | Kaizera (mechanics), the author (narrative, world), Lorien (AI: system design and balance) |

## Skills demonstrated

- Game design: card types, rarity and the role of risk in the game loop.
- System design: difficulty progression and the link between reward and probability.
- Balancing: rarity and card cost against card power, avoiding a dominant strategy.
- Mathematical modelling: probability and payback formulas instead of tuning by feel.
- Game economy: three consumables that change probability rather than restore a resource.
- Narrative design: the tavern world where "stories" are game objects.
- Splitting responsibility in a hybrid team (people + AI) with explicit handover points.
- Documenting balance: tables and formulas as transferable artifacts.

## Tools

Excel (balance tables and calculations), the AI assistant Lorien (system design, balance, maths), LLM chat
models, Cline (writing documents to files), a concept document.

## Limitations

- There is no digital prototype: balance was verified by calculations and tables, not by play.
- The formulas have not been tested with real players, and there are no session statistics.
- The final card set is not assembled: there is a model by type and weight, not 50–100 ready cards.
- No visuals and no interface — only the system and its description.
- Project metrics were not collected (time, number of balance runs).

## Artifacts

- Excel balance tables (cards by type and rarity, drinks, difficulty thresholds). Private.
- Formulas: success chance (S + 6 − D) / 6, triumph chance (S + 6 − D − 5) / 6, payback "Strength / Cost".
- Concept document: genre, game loop, economy, progression. Private.
- Economy scheme (how rewards, risks and consumables relate). Private.

All artifacts are private, details on request.

## Related cases

- [01-lorien.en.md](01-lorien.en.md) — the AI assistant worked as system designer and balancer.
- [02-dnd-module.en.md](02-dnd-module.en.md) — the shared "Shards of Faith" mechanic.
- [04-prompt-engineering.en.md](04-prompt-engineering.en.md) — the methodology of tasking the assistant.
- [../dev/03-echelon-mini-game.en.md](../dev/03-echelon-mini-game.en.md) — game mechanics: layers, bosses, risk.
- [../dev/04-echelon-beyond.en.md](../dev/04-echelon-beyond.en.md) — combat system and progression in the project documentation.

## Next steps

- Build a playable prototype: an Excel demo or Tabletop Simulator.
- Run a series of sessions and collect statistics on the difficulty curve.
- Lock the final card set by type and rarity.
- Check that no dominant strategy exists and tune the bartender economy.

## Disclaimer

AI tools (Cline, DeepSeek, Lorien) were used as executors and co-authors under my direction and editorial control.

