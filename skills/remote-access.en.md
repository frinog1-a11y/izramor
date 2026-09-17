# Remote access and home infrastructure

## What it is

Connecting several home devices into one working loop: a private network instead of publishing to the internet,
access from a phone, artefact transfer, waking the PC and streaming its screen.

## Where it is confirmed

- `cases/dev/01-videokamera.en.md` — access to the camera from outside the home over a private VPN network, a README
  section on VPN limitations, documented procedures for changing the address and regenerating the certificate, plus
  firewall and port checks.
- `cases/dev/07-echelon-remote-pipeline.en.md` — the full loop: 6 infrastructure documents (access, desktop
  streaming, file transfer, Wake-on-LAN, task board), 9 delivery files, 11 PC setup files (SSH, automatic logon,
  streaming) and 32 environment and network diagnostics files.
- `cases/dev/04-echelon-beyond.en.md` — the rule "the home PC is the source of truth": anything that must survive
  the laptop being switched off runs at home; the laptop is a working copy.
- `cases/dev/02-normcontrol-kb.en.md` — the opposite case: a public service with no home infrastructure at all
  (GitHub Pages hosting), a deliberate choice for a locked-down work PC.

## Level

**Confident.** Justified:

- The loop works and is documented: 68 automation files and 6 infrastructure documents, including what does not work
  (an unavailable network share, no cloud channel).
- The limitations of the private network are found and described: an offline device does not receive a file and
  re-sending is manual; the board is reachable only inside the network — a deliberate trade-off.
- Practice is confirmed by two projects: a home service (the camera) and a home factory (the game project).
- Why not "advanced": there is no public result of this work and no fault tolerance documentation (redundancy,
  monitoring).

## What it proves

- The camera README: sections on outside access, VPN limitations, certificates and diagnostics.
- docs/TECH/ACCESS.md, docs/TECH/STREAMING.md, docs/TECH/TRANSFER-TO-PC.md, docs/TECH/WAKE-ON-LAN.md,
  docs/TECH/KANBAN_LEGEND.md (case 04).
- tools/delivery (9 files), tools/setup (11), tools/diag (32), tools/kanban (16).
- deliveries/test-broadcast/REACH.md — a report of a test push to devices.
