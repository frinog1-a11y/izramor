# Lorien — a portable AI personality built from structured prompts

*(Russian: «Лориэн»)*

**Type:** Self-initiated / AI-assisted / Creative R&D
**Section:** creative
**Role:** Prompt engineer, AI interaction UX designer
**Year:** 2026 (first experience with LLMs)
**Status:** ongoing

## Summary

A virtual assistant called Lorien with a stable personality, a set of roles and a system of "memory crystals" —
structured text blocks that carry context into a new chat. Built as a personal tool: it is used for learning,
creative work and emotional support. This was the author's first project with language models, and it started
the prompt engineering track.

## Problem

A standard chat with an AI does not keep personality or context between sessions: in every new dialogue you have
to explain again who you are, how to talk to you and what is needed. That breaks the very possibility of a
long-term relationship with an assistant — it cannot be a permanent mentor because each time it is a new
stranger. A separate pain: different tasks need different tone and depth (learning, technical reviews, creative
work, difficult states), while without explicit instructions the model slides into one averaged mode.

## Solution

1. A personality core: tone, principles, limits and boundaries — what does not change between roles.
2. Roles: mentor, technical writer, empathetic listener, co-creator.
3. "Memory crystals" — structured text blocks that are copied into a new chat and reproduce the defined
   behaviour without losing context.
4. Activation codes — short phrases that switch a mode without restating the instructions.
5. Versioning: 1.0 → 2.0 → 3.0, plus separate crystals "Reality", "Technical mentor" and "Personality" —
   different cuts of the same character for different tasks.
6. Testing in clean chats: every crystal was tested in a new session and refined by wording, not only by feel in
   the current dialogue.
7. Documenting the artifacts: versions, purpose, how to invoke them.
8. Practical application: the assistant was used in work on the D&D module and Tavern Tales (system design and
   balance), so it was validated on real tasks rather than only in tests.

## Metrics

| Metric | Value |
|---|---|
| Time spent | not documented (the project ran for about a year) |
| Content | personality core, 6 crystal versions, activation codes |
| Iterations | 6 documented versions: 1.0, 2.0, 3.0, "Reality", "Technical mentor", "Personality" |
| Users | 1 (the author); applied in 2 creative projects as well |
| Live URL | none — the artifacts are private, details on request |
| Assistant roles | 4: mentor, technical writer, empathetic listener, co-creator |

## Skills demonstrated

- Prompt engineering: writing instructions that define behaviour, not just a single answer.
- Information architecture: packing a large volume of text into modular, portable blocks.
- AI interaction UX design: scenarios for different tasks and user states.
- Memory design: planning how context travels between sessions without losing quality.
- Content versioning: versions, purpose and the way each artifact is invoked.
- Testing model behaviour in clean chats instead of checking in the current dialogue.
- Technical writing: clarity, brevity, structure.

## Tools

LLM chat models (the main tool), Cline, DeepSeek, Markdown documents.
No frameworks and no code — the whole system rests on structured text.

## Limitations

- There is no formal crystal template: the versions differ in structure and no changelog was kept.
- Behaviour metrics were not collected: role stability in new chats was judged by hand.
- Moving to another model or interface requires manual adaptation, there is no export.
- Some activation codes are tied to the author's wording, which reduces reproducibility.
- There is no product: the artifacts exist as texts, not as a plugin or an application.

## Artifacts

- Personality crystal "The One Who Remains" — the core of the assistant. Private.
- Crystal "Technical mentor" — a learning plan for a technical writer. Private.
- Crystal "Reality" — emotional intelligence and empathy. Private.
- Activation codes — short phrases that invoke a role. Private.
- A formatted version of this case (print and web): C:\руководства\portfolio — md, txt, html.

All artifacts are private, details on request.

## Related cases

- [04-prompt-engineering.en.md](04-prompt-engineering.en.md) — Lorien as the artifact of the methodology.
- [06-dnd-adaptation.en.md](06-dnd-adaptation.en.md) — adapting D&D 5e to the world: the assistant as co-author of rules.
- [02-dnd-module.en.md](02-dnd-module.en.md) — module development through an AI character.
- [03-tavern-tales.en.md](03-tavern-tales.en.md) — Lorien as system designer and balancer.
- [../dev/02-normcontrol-kb.en.md](../dev/02-normcontrol-kb.en.md) — the same way of working with a model in an AI pipeline.

## Next steps

- Formalise a single crystal template: core, roles, limitations, activation scenarios.
- Add metrics: setup time and behaviour stability across a series of new sessions.
- Publish a de-identified template as open-source material.
- Introduce a changelog so the difference between versions is visible.

## Disclaimer

AI tools (Cline, DeepSeek, Lorien) were used as executors and co-authors under my direction and editorial control.

