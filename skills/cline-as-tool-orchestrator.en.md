# Cline as a tool orchestrator

## What it is

Teaching an AI agent to use a tool it does not "know out of the box": an image generator, a LoRA trainer, a music
generator, local LLM providers. Not "ask the agent to write code", but configuring the agent so that it starts an
external tool itself, reads that tool's metrics and returns the result into files.

## Where it is confirmed

- `cases/dev/05-cline-art-music.en.md` — the "Role of Cline in the pipeline" section: Fooocus (generation),
  kohya_ss (LoRA training), ACE-Step (music). The agent runs batches, collects quality-control metrics (palette,
  PNG metadata, hashes), versions prompts in git, rejects weak frames, installs the style preset idempotently and
  patches the generator driver.
- `cases/dev/07-echelon-remote-pipeline.en.md` — item 8 of the "Solution" section: Ollama and LM Studio. The agent
  starts the model server, checks availability, sends a test request and takes the status.
- `cases/dev/02-normcontrol-kb.en.md` — DeepSeek inside GitHub Actions: agent logic lives in the workflow and turns
  text from an issue into a knowledge base note.
- `cases/dev/04-echelon-beyond.en.md` — AGENTS.md: the result contract for an agent working in a repository
  (deliveries folder, mandatory SUMMARY.md, git rules).

## Level

**Advanced.** Justified:

- Five external tools with different input and output formats are wired to the agent: Fooocus, kohya_ss, ACE-Step,
  Ollama, LM Studio.
- The result is stable at scale: about 300 generated tracks, 141 candidate frames, two trained LoRAs (images and
  music).
- Not only launches are configured but feedback as well: the agent reads metrics (palette, sha1, sizes, GPU
  counters) and uses them to decide on rejection and repeat runs.
- Responsibility is split explicitly: the agent does the mechanical work, the human owns style and acceptance;
  this is stated in the case itself rather than implied.

## What it proves

- tools/fooocus — 106 script files (training, batches, quality control, prompts, calibration).
- deliveries/lora-fresco-merea/SUMMARY.md — numbers for four LoRA training runs and a quality verdict.
- docs/ART/LORA-INSTALL.md (219 lines) — a recipe the agent reproduces.
- AGENTS.md of the game project repository — the result contract the agent worked under.
