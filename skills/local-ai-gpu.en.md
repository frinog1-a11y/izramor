# Local AI on 8 GB of VRAM

## What it is

Running and training generative models on a home GPU with 8 GB: measuring the bottleneck from counters, separating
resources, working around toolchain limitations and getting a result in predictable time.

## Where it is confirmed

- `cases/dev/05-cline-art-music.en.md` — training an SDXL LoRA on 8 GB: four runs instead of one, step time
  88–119 → 80 → 70.7 → 5.9–6.5 s/step, training time 2.4 hours instead of 36–50. The diagnosis was made from
  counters: occupied memory, compute load and power draw.
- `cases/dev/05-cline-art-music.en.md` — measured conclusions: the image generator and training cannot coexist on
  8 GB (after freeing memory the step became 11 times faster and power draw rose from 78 to 161 W); full bf16 made
  things worse (+5.1 GB of weight copies); TF32 was enabled with a shim through PYTHONPATH (matmul 36.78 → 20.10 ms,
  a 1.8x speed-up).
- `cases/dev/05-cline-art-music.en.md` — the music branch: ACE-Step 1.5, three waves of batch generation
  (7, 86, 129 tracks), ~300 files and a separate music LoRA (12 adapters, 2.1 GB) — all local, no cloud APIs.
- `cases/dev/07-echelon-remote-pipeline.en.md` — local LLMs: Ollama and LM Studio, autostart, check and network
  access scripts; some scenarios were moved from paid APIs to local models.

## Level

**Advanced.** Justified:

- There is a proven 11x and 1.8x speed-up — the optimisation was measured, not guessed.
- Two different models were trained (an image style LoRA and a music LoRA), so this is not a one-off.
- About 300 music tracks and 141 interface frames were generated — a volume that requires a stable pipeline.
- Own rules of thumb for 8 GB are written down (which precision mode to use, what to close before training),
  including working around a missing flag in the trainer build.

## What it proves

- deliveries/lora-fresco-merea/SUMMARY.md — a table of four training runs with s/step, ETA and a verdict.
- docs/ART/LORA-INSTALL.md — a recipe with the reasoning behind each parameter for 8 GB.
- Music generation folders: 129 FLAC in the third wave, 126 mp3 exports, LoRA adapters.
- tools/fooocus — scripts for closing the generator to free memory, training progress, VRAM checks and calibration.
