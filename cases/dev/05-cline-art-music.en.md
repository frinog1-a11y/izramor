# Orchestrating Cline for art and music

## Summary

Producing visuals and sound for a game project with local generative models driven by an AI agent: a style LoRA
trained from scratch, 18 prompt iterations for the main menu, quality-control tools based on numbers (palette,
metadata, contact sheets), and music material prepared for a local music generator. All of it on a single 8 GB
home GPU.

## Problem

Generative visuals are easy to obtain but hard to make recognisable: frames drift apart in style, the same
prompt yields either photorealism or a cartoon, and "by eye" it is impossible to tell why an iteration got
worse. On top of that comes a hardware limit: 8 GB of VRAM cannot hold model training and generation at the
same time. A process was needed where decisions are made from metrics rather than taste, and where the tools
are reproducible.

## Solution

1. A style dataset was built: 50 frames with captions, weak frames rejected into a separate folder with
   reasons, then regenerated with an explicit subject in the prompt.
2. A style LoRA ("Frescoes of Mereya") was trained on portable kohya_ss: rank 32 / alpha 16, U-Net only, 1,500
   steps, AdamW8bit, fp16, on a 6.94 GB SDXL checkpoint.
3. Training speed was pulled out of a dead end by measurement: four runs instead of one — from 88–119 s/step
   down to 5.9–6.5 s/step (2.4 hours instead of 36–50), because the blocker was not an error but VRAM held by
   the image generator.
4. TF32 was enabled despite a missing flag in that kohya_ss build — through a custom sitecustomize.py shim on
   PYTHONPATH (matmul benchmark: 36.78 ms → 20.10 ms, a 1.8x speed-up).
5. The LoRA was installed into Fooocus and wired into generation (slots 1–5); an A/B test "with LoRA vs
   without" used one seed, with the verdict based on sha1 and palette metrics rather than on impressions.
6. A custom Fooocus style preset ("Echelon Fresco") with idempotent scripted installation.
7. Prompts and negatives are versioned as files in git: 18 iterations (v4…v18), sweeps of 20 frames each, and
   separate prompts for scene elements (ship, kraken, sun).
8. The "prompt does not fit into CLIP" diagnosis: a 2,618-character prompt did not fit into 77 tokens, the plot
   fell into the tail, and the wrong checkpoint was silently in use. The fix: a short prompt, CFG 6.5, quality
   mode, and banning extra objects in the negative prompt.
9. Quality control by numbers: palette comparison of frames, PNG metadata checks, automatic contact sheets for
   human selection, and a rejection script.
10. Music direction: a local ACE-Step 1.5 generator and three waves of batch generation — 7, 86 and 129 tracks
    (FLAC), mp3 exports (84 and 126 files), a separate music LoRA, plus a project library with 11 categories
    (ambient, layers, bosses, endings, shanties, anthem), 39 text briefs and 4 selected mp3s.

## Role of Cline in the pipeline

The pipeline is built so that routine operations are done by the agent while decisions stay with the human.
Concrete tasks the agent performed:

1. Running generation batches in Fooocus: preparing frames from a prompt list, waiting for the queue, collecting
   results into the right folder and reporting what came out.
2. Collecting quality-control metrics: palette comparison of frames, reading PNG metadata, verifying versions by
   file hashes — that is, preparing the numbers on which decisions are then based.
3. Versioning prompts and negatives: saving recipes as files in git so every style iteration stays reproducible.
4. Rejecting weak frames: moving failed runs into a separate folder with reasons and regenerating with a changed
   prompt.
5. Training LoRA: dataset staging, launching the kohya_ss trainer, keeping the training log and diagnosing the
   bottleneck from GPU counters (memory and power).
6. Wiring results into the generator: idempotent installation of the custom style preset and a driver patch so
   the LoRA lands in the generation slots.
7. Music branch: running ACE-Step batch generation wave by wave, exporting to mp3 and accounting for tracks by
   library category.

What stayed with the human: style decisions, acceptance thresholds from metrics, the final choice of the main
menu frame and taste — metrics cut out obvious junk but do not replace ear and eye.

What the agent could not do: look at frames and listen to music — it has no browser, no sound and no vision.
Workaround: the agent produced numbers and contact sheets, and the human chose from them.

## Metrics

| Metric | Value |
|---|---|
| Time spent | 10–13 September 2026 by commit dates; hours not documented |
| Cost (API) | $0 — everything local, no external APIs used |
| Commits | counted in case 04 (commit areas: LoRA, Fresco, Menu) |
| Files changed | 106 files in tools/fooocus plus documents in docs/ART, and 61 local edits in the music generator fork |
| Lines of code | generation and QC tools — thousands of lines of Python and PowerShell (not counted individually) |
| Tools built | 106 files in tools/fooocus (generation, batches, QC, training, recipes) plus 5 documents in docs/ART |
| Tests and automated checks | LoRA A/B test, palette comparison, PNG metadata checks, contact sheets, smoke runs |
| Users | 1 (the author) |
| Live URL | none; the result is a trained LoRA, ~300 generated tracks (≈3.4 GB of mp3 exports) and 141 menu candidates (203 MB) |

## Skills demonstrated

- Training an SDXL LoRA from scratch: dataset, captions, hyperparameters, rejection, retraining based on facts.
- Optimising for 8 GB of VRAM: measuring GPU counters, finding the bottleneck, justifying decisions.
- Working around tool limitations: enabling TF32 through a PYTHONPATH shim.
- Versioning prompts and recipes as engineering artefacts (18 iterations with history).
- Automatic evaluation of generative content: palette metrics, sha1, contact sheets.
- Driving an image generator through its API and patching its driver idempotently.
- Building reference datasets: style collections, a download script, documentation.
- Preparing music production: categorisation, briefs, a local music generator.

## Stack

Fooocus (SDXL) with its API and a custom style preset, kohya_ss-portable for LoRA training, ComfyUI and Wan 2.2
for the video direction, ACE-Step 1.5 for music, Python 3.11 and QC scripts, PowerShell, an RTX 3060 Ti with
8 GB, LM Studio for local LLMs.

## Limitations

- 8 GB of VRAM: training and generation cannot coexist, so they had to be fully separated in time.
- The main menu frame was never finally chosen — 18 iterations produced candidates, no final decision.
- Music: only 4 mp3s made it into the project library, while ~300 tracks were generated — listening selection
  and mixing are still ahead.
- Batch exports come as dozens of FLAC/MP3 files (tens of gigabytes on disk) — the library needs cleanup and
  cataloguing.
- Reference collections are only partly filled: two groups were downloaded, four remain empty.
- The video direction (ComfyUI + Wan 2.2) is deployed, but no result was recorded in the reports.
- Human review is mandatory: palette metrics filter obvious junk but not taste.

## Artifacts

- Training and installation recipe: docs/ART/LORA-INSTALL.md (219 lines) in the private repository.
- Reports: deliveries/lora-fresco-merea/SUMMARY.md (numbers for four training runs), docs/ART/LORA-DATASET.md
  (269 lines), docs/ART/MENU-ART.md (786 lines), ZYBB1-BACKGROUND.md.
- Menu candidates: assets/art/ui/menu — 141 files, 203 MB (not committed to git).
- Tools: tools/fooocus — 106 files (training, batches, QC, prompts, calibration).
- Music: Echelon_Beyond_Music — 11 categories, 44 files (39 briefs + 4 selected mp3s); ACE-Step generation —
  7 + 86 + 129 FLAC (≈4.6 GB), 84 + 126 mp3 exports (≈1.7 GB), a music LoRA (12 adapters, 2.1 GB) and 717
  working output files from the generator.
- No screenshots or video yet.

## Next steps

- Lock the final menu frame and an explainable style recipe for repeat generations.
- Complete the reference collection and extend the dataset for LoRA version 2.
- Produce music for bosses and endings from the prepared briefs.
- Document the video pipeline (ComfyUI + Wan 2.2) with examples.
- Capture a gallery of the best frames for the portfolio.

