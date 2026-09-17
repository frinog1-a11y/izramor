# Pipeline "phone → laptop → home PC"

## Summary

Infrastructure around the game project: the home PC is the source of truth and the factory (repository, AI
agent, generation, training), the laptop is the work desk, the phone is the remote control. Task results appear
automatically on a results page and are pushed to devices, tasks are queued on a Kanban board, and the PC can be
woken over the network and reached through screen streaming.

## Problem

The project is developed across two computers and a phone: the laptop is convenient for writing and reviewing but
is often switched off; the home PC holds the GPU, the repository and the AI agent. Files got lost between the
machines, the task board was reachable from one place only, and "the result is ready" meant "do not forget to
copy it over".

## Solution

1. The rule "the home PC is the source of truth": anything that must survive the laptop being switched off runs
   at home; the laptop is a working copy and a viewing device.
2. A delivery contract: every task must leave a folder deliveries/<task>/ with a SUMMARY.md (what was done, with
   what, a verdict in numbers, what remains).
3. A local results server: the deliveries folder is automatically visible on a page reachable from the phone and
   the laptop over the private network.
4. File push to devices through Taildrop (no admin rights needed on the receiving side); an offline device
   returns TIMEOUT, and that is not treated as a task failure.
5. The reverse direction: a scheduled task on the laptop pulls results from the home PC by itself.
6. A Kanban task board started with one command: columns "Queue / In progress / Done", reachable from the phone
   and the laptop, accessible only inside the private network.
7. Documented access: guides for connection, desktop streaming, file transfer and Wake-on-LAN.
8. Local LLMs as an alternative to the cloud: own model providers, a local model server, autostart scripts,
   availability checks and status capture, and a separate script for network access to it. This part is handed to
   the agent: Cline starts the model server, checks that it responds, sends a test request and takes the status,
   so the human does not have to keep the commands of three different tools in mind (Ollama, LM Studio, network
   access).
9. A diagnostics arsenal (32 scripts): environment, ports, processes, windows, IP, encodings and line endings,
   tree search across the project, log inspection.
10. PC management and setup: SSH, Wake-on-LAN, automatic logon, screen streaming — 11 scripts in tools/setup.

## Metrics

| Metric | Value |
|---|---|
| Time spent | 10–13 September 2026 by commit dates; hours not documented |
| Cost (API) | $0 (local models — Ollama and LM Studio; no external paid APIs were used) |
| Commits | included in the 57 commits of case 04 (agent and Kanban checkpoint commits: 51) |
| Files changed | included in the 218 unique files of case 04 |
| Lines of code | pipeline tools and documents: 9 delivery files, 11 setup files, 32 diagnostics files, 16 Kanban files |
| Tools built | 68 files (delivery, setup, diagnostics, Kanban) plus 6 documents in docs/TECH and 4 documents in the docs root |
| Tests and automated checks | environment and state checks (port, reachability, model status), a test broadcast with a REACH.md report |
| Users | 1 (the author, plus a laptop and a phone as devices) |
| Live URL | none: the author's private network only |

## Skills demonstrated

- Designing a distributed working process across several devices.
- Automating artefact delivery: a results server, push to devices, reverse synchronisation.
- Using a private VPN network as the only access channel (board without a passcode, but not on the internet).
- Waking and managing a PC: Wake-on-LAN, automatic logon, SSH, remote screen streaming.
- Local LLMs: deployment, autostart, availability checks, network access.
- Result-contract discipline: every task gets a report with numbers and remaining work.
- Windows diagnostics: scripts for ports, processes, windows and environment variables.
- Documenting infrastructure so another person or agent can repeat it.

## Stack

Windows 10, PowerShell 5.1, Python 3.10, a private VPN network (Tailscale) and Taildrop, a local HTTP server for
results, Cline Kanban, Ollama and LM Studio for local models, Wake-on-LAN, SSH, desktop streaming, and a Godot
MCP server for engine control.

## Limitations

- An SMB share from the home PC is unavailable (account restriction), so file exchange had to be built on
  Taildrop and an HTTP page.
- OneDrive did not work as a transfer channel: the process does not run on the home PC.
- If a device is offline, delivery does not happen; re-sending is manual once the device is back.
- The task board is reachable only inside the private network, with passcode login switched off on purpose.
- Part of the documentation contains the author's specific addresses and device names — publishing would require
  de-identification.

## Artifacts

- Documentation (private repository): docs/REMOTE-PIPELINE.md, docs/TECH/ACCESS.md, docs/TECH/STREAMING.md,
  docs/TECH/TRANSFER-TO-PC.md, docs/TECH/WAKE-ON-LAN.md, docs/TECH/KANBAN_LEGEND.md, docs/LOCAL_LLM.md,
  docs/AI_PROVIDERS.md.
- Tools: tools/delivery (9), tools/setup (11), tools/diag (32), tools/kanban (16).
- Task reports: deliveries/*/SUMMARY.md, including test-broadcast/REACH.md (a delivery test).
- No screenshots yet.

## Next steps

- De-identify the infrastructure documentation for a possible public release.
- Retry file delivery automatically once a device is back on the network.
- Keep a log of who downloaded which result and when.
- Describe the whole process as a reusable template for other home projects.

