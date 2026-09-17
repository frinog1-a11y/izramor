# AI agent orchestration

## What it is

Turning an AI agent into a production unit: giving it rules, a task board, a result contract and a delivery
channel, so that work proceeds autonomously while the result stays visible and verifiable. Not "ask for code",
but building a process around the agent.

## Where it is confirmed

- `cases/dev/04-echelon-beyond.en.md` — AGENTS.md with the result contract (every task leaves a folder in
  deliveries/ with a SUMMARY.md), git rules, no clutter, delivery regulations. 51 of the 57 commits in the
  repository were made by agents and by board mechanics (separate authors in history: Kanban checkpoints and
  agents), so the agent actually worked in the project rather than once.
- `cases/dev/04-echelon-beyond.en.md` — TASKS.md as a human-readable board and the link to the real Kanban board
  (start-kanban.cmd, column legend in docs/TECH/KANBAN_LEGEND.md).
- `cases/dev/02-normcontrol-kb.en.md` — HANDOFF.md (handing context over to a new chat), the "work autonomously,
  save tokens" rules, the "issue → note" AI pipeline in CI, support for several model providers, log sanitising
  and an answer size cap.
- `cases/dev/07-echelon-remote-pipeline.en.md` — delivery of results to devices and the results page: a task
  result appears on the phone and the laptop without manual steps.

## Level

**Advanced.** Justified by metrics rather than claims:

- 51 agent commits out of 57 in one project — the agent worked as a performer, not as a toy.
- 232 tool and documentation files in the project — the agent has what to work with and where to look.
- A separate quality contract (a mandatory SUMMARY.md with a verdict in numbers) was fulfilled in 3 of 3
  completed task folders in deliveries.
- A separate result contract for AI in another project (HANDOFF.md plus push flow rules) and a working
  automatic pipeline that fills the base from an issue.

## What it proves

- AGENTS.md, TASKS.md, start-kanban.cmd, docs/TECH/KANBAN_LEGEND.md (case 04).
- deliveries/lora-fresco-merea/SUMMARY.md and two more SUMMARY.md files (case 04).
- HANDOFF.md and .github/scripts/ai.mjs, .github/scripts/note-from-issue.mjs (case 02).
- Commit history with different agent authors (git shortlog in cases 02 and 04).
