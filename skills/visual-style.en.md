# Consistent visual style through LoRA and prompts

## What it is

Getting a recognisable authorial style out of a generative model: building a dataset, training your own LoRA,
keeping prompts as versioned artifacts and selecting results by metrics rather than by mood.

## Where it is confirmed

- `cases/dev/05-cline-art-music.en.md` — an SDXL LoRA ("Frescoes of Mereya") trained from scratch: a dataset of
  50 frames with captions, rank 32 / alpha 16, U-Net only, 1,500 steps, AdamW8bit, fp16 and a fixed seed. Weak
  frames are rejected into a separate folder with reasons and then regenerated.
- `cases/dev/05-cline-art-music.en.md` — 18 prompt iterations for the main menu (v4…v18) with negatives, sweeps of
  20 frames and separate prompts for scene elements; 141 candidates (203 MB) in assets/art/ui/menu. Selection tools:
  palette comparison, PNG metadata, contact sheets.
- `cases/dev/05-cline-art-music.en.md` — a style preset installed into the generator with an idempotent script, and an
  A/B test "with LoRA vs without" using one seed and a file hash.
- `cases/dev/04-echelon-beyond.en.md` — art production rules: folder structure for backgrounds, sprites, interface,
  frescoes and references; frame acceptance rules; reports with palette numbers.
- `cases/dev/05-cline-art-music.en.md` — a style reference library: six groups (Roman frescoes, Byzantine mosaics,
  Gothic stained glass, Art Nouveau, medieval maps and manuscripts, isometric games), a download script and contact
  sheets.

## Level

**Confident.** Justified:

- An own trained model rather than ready-made ones: a LoRA file, a 219-line recipe and a report with numbers from
  four training runs.
- Result discipline: a frame verdict comes from palette metrics and hashes, and the report includes a training speed
  table (11x after freeing VRAM, 1.8x from the TF32 shim).
- Prompts and negatives live in git as files (dozens of revisions) — the style is reproducible rather than accidental.
- There is a feedback loop: weak frames are not discarded silently but moved to a rejected folder with reasons and
  regenerated with a changed prompt.
- Why not "advanced": the final menu frame was never chosen, some reference collections are empty, and taste stays
  with the human — there is a process but no acceptance system.

## What it proves

- docs/ART/LORA-INSTALL.md (219 lines), docs/ART/LORA-DATASET.md (269), docs/ART/MENU-ART.md (786).
- deliveries/lora-fresco-merea/SUMMARY.md — numbers for four training runs and a verdict.
- tools/fooocus — 106 files: training, batches, calibration, prompts, quality control.
- assets/lora (50 frames + 50 captions), assets/art/ui/menu (141 candidates), rejected folders.
