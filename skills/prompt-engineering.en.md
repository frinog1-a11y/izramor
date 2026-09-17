# Prompt engineering

## What it is

Designing how an AI behaves through structured instructions: the assistant's role and boundaries, memory between
sessions, activation codes for modes, context transfer and prompt versioning.

## Where it is confirmed

- `cases/creative/01-lorien.en.md` — 6 crystal versions (1.0, 2.0, 3.0, "Reality", "Technical mentor",
  "Personality"), 4 assistant roles, activation codes, and testing in clean chats.
- `cases/creative/04-prompt-engineering.en.md` — 6 techniques of the methodology applied in 4 creative and
  2 technical projects.
- `cases/dev/02-normcontrol-kb.en.md` — a working AI pipeline: one field in an issue → DeepSeek → a note → a site
  build. Support for several providers by key prefix, scrub() for logs, and a max_tokens cap. A public result, not
  an experiment.
- `cases/dev/05-cline-art-music.en.md` — prompts and negatives as versioned files in git (18 iterations), and the
  diagnosis "a 2,618-character prompt did not fit into the 77-token CLIP window" plus the short prompt that fixed it.
- `cases/dev/04-echelon-beyond.en.md` — the file AGENTS.md in the game project repository: rules and a result
  contract for the agent.

## Level

**Advanced.** Justified by facts rather than self-assessment:

- This is a system, not one-off prompts: 6 documented crystal versions, 6 methodology techniques, activation codes
  and a versioning scheme.
- It has been applied in 6 projects, one of them a production technical pipeline that runs publicly (the knowledge
  base site is updated from a form on a page).
- Model behaviour is diagnosed with numbers: the CLIP window, checkpoint choice, LoRA weight, CFG — the author knows
  not only how to write a prompt but why it failed.
- Reproducibility: prompts, negatives and recipes are stored as files in the repository next to the assets.

## What it proves

- `cases/creative/01-lorien.en.md`, `cases/creative/04-prompt-engineering.en.md` — the crystal structure and
  activation codes (private artifacts, details on request).
- `cases/dev/02-normcontrol-kb.en.md` — .github/scripts/ai.mjs, .github/scripts/note-from-issue.mjs, the issue
  template and the live site https://frinog1-a11y.github.io/normcontrol-kb/
- `cases/dev/05-cline-art-music.en.md` — tools/fooocus (106 files, including dozens of prompt files).
- `cases/dev/04-echelon-beyond.en.md` — the files AGENTS.md and TASKS.md in the game project repository, and the
  task board that files cards automatically.
