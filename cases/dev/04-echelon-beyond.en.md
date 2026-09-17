# Echelon Beyond — world, 18 volumes of documentation and game assets

## Summary

A tactical roguelite about sailing an astral ocean: an original world, 18 volumes of guidance (from world
history to script and MVP), a style LoRA and a production toolchain. Made by the author as a personal game
project; today it is thorough documentation and a production pipeline, while the Godot code has not started yet.

## Problem

A game idea of this scale lives only until the first draft: world, peoples, combat system, music, visual style
and script stop matching each other, and visuals from generative models come out inconsistent and
unrecognisable. A way was needed to keep an invented world coherent and to run a production process that does
not fall apart by iteration ten.

## Solution

1. An 18-volume world guide (volume 0 and volumes I–XVIII) in docs/GUIDE: introduction, world history, peoples,
   combat and enemies, techno-magic, music, visuals, characters, script, quests, MVP.
2. The repository as a production system: AGENTS.md defines the result contract (every task leaves a folder in
   deliveries/ with a SUMMARY.md and files), git rules and prohibitions.
3. Project structure fixed in docs/STRUCTURE.md: src/ (Godot), assets/ (art, audio, animation, references, LoRA
   datasets), docs/ (GUIDE, ART, TECH), tools/, deliveries/, _archive/.
4. A Kanban board on top of Cline: task cards, columns "Queue / In progress / Done", started from
   start-kanban.cmd, reachable from a phone and a laptop, with a separate legend in docs/TECH.
5. Work split between the author and AI agents: 37 commits of my own, plus 51 agent commits (Kanban checkpoints
   and agents working under the AGENTS.md contract).
6. The game style fixed through the "Frescoes of Mereya" LoRA (see case 05); prompts and negatives are stored in
   the repository as versioned files.
7. Art pipeline: 141 main-menu candidates (203 MB) in assets/art/ui/menu, selection through contact sheets, PNG
   metadata, palette metrics and acceptance rules.
8. Training dataset: 50 frames plus 50 captions in assets/lora/{train,captions}, rejection with reasons
   (assets/lora/rejected) and separate calibration runs.
9. Result delivery: deliveries/ plus a local results page and file push to devices (see case 07).
10. Production documentation in docs/ART (MENU-ART 786 lines, LORA-DATASET 269, LORA-INSTALL 219,
    ZYBB1-BACKGROUND 185, REFS-NOTES 50) and docs/TECH (access, streaming, transfer to PC, Wake-on-LAN).

## Metrics

| Metric | Value |
|---|---|
| Time spent | 10–13 September 2026 by commit dates; hours not documented |
| Cost (API) | $0 (local generation on my own GPU) |
| Commits | 57 (37 by the author, 20 by agents and Kanban checkpoints) |
| Files changed | 218 unique |
| Lines of code and documents | +17,007 / −438 (author commits) |
| Tools built | 232 script and documentation files in tools/ (106 generation, 32 diagnostics, 33 at the root, 16 Kanban, 11 PC setup, 9 delivery, 6 documentation utilities) |
| Tests and automated checks | not documented as tests; instead QC checks (palette, metadata, sizes) and environment state checks |
| Users | 1 (the author; the project is private) |
| Live URL | none (private project; documentation and assets are local) |

## Skills demonstrated

- Designing an invented world: 18 volumes of documentation that stay consistent with each other.
- Production discipline: a result contract, a SUMMARY.md per task, archiving instead of silent deletion.
- Organising a large repository: strict file placement rules and no clutter in git.
- Managing AI agents: rules in AGENTS.md, a task board, separate commit authors.
- Versioning the creative process: prompts, recipes and QC reports live in git next to the assets.
- Python and PowerShell tooling (232 files) for specific production operations.
- Asset management: 141 menu variants, a LoRA dataset, reference collections, contact sheets.
- Documenting infrastructure: access, streaming, transfer to a PC, Wake-on-LAN.

## Stack

Godot 4.6.3 (engine chosen and installed; src/ is still empty), Markdown documentation, Python 3.10/3.11 and
PowerShell 5.1 for tools, Fooocus plus its API for generation, kohya_ss for LoRA training, Cline Kanban for
tasks, a private VPN network and Taildrop for delivery to devices.

## Limitations

- Game code has not started: src/ contains only placeholders, there is no playable prototype.
- The 18 guide volumes exist as .docx/.txt files — no single assembled output (one PDF or a site) yet.
- Heavy asset piles (141 menu frames, the dataset) are deliberately kept out of git and live separately.
- There are no automated tests: quality control rests on QC scripts and the author's eyes.
- The main menu was never finally chosen: 18 prompt iterations produced candidates, but the reports contain no
  final frame.
- Part of the documentation describes the author's specific environment (devices, network) — publishing it would
  require de-identification.

## Artifacts

- Private local repository C:\EchelonBeyond (origin is a local git remote, not GitHub).
- Documentation: docs/STRUCTURE.md, AGENTS.md, TASKS.md, docs/GUIDE (18 volumes), docs/ART (5 documents),
  docs/TECH (6 documents), docs/LOCAL_LLM.md, docs/AI_PROVIDERS.md, docs/REMOTE-PIPELINE.md.
- Task results: deliveries/lora-fresco-merea/SUMMARY.md, deliveries/zybb1-background/SUMMARY.md,
  deliveries/test-broadcast/SUMMARY.md.
- tools/ — 232 script and documentation files.
- No screenshots or video yet.

## Next steps

- Finish choosing the main menu frame and lock the final art style.
- Assemble the 18 volumes into one readable document (PDF or site).
- Start the Godot code: isometric camera, flagship movement, first zone, combat system.
- Add a minimum of automated tests for the tools and the structure rules.
- De-identify the documentation so the repository can be made public.

