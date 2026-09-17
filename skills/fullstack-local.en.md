# Local services: HTTPS, auth, WebRTC, Windows services

## What it is

Running a home service "as a product": its own TLS, password login, realtime communication between devices,
autostart and day-to-day operation. Not a localhost demo, but something that survives a reboot and is reachable
from a phone.

## Where it is confirmed

- `cases/dev/01-videokamera.en.md` — HTTPS on 8443 with a self-signed certificate (automatic generation,
  regeneration, choosing between two certificates), Basic Auth on pages, static files and the WebSocket with
  constant-time comparison, two-way WebRTC audio, autostart as a Windows service via NSSM with a restart 5 seconds
  after a crash, log rotation at 1 MB, and a PWA viewer with a service worker. 18 commits, +4,569 / −1,198 lines,
  40 files, 6 automated checks.
- `cases/dev/02-normcontrol-kb.en.md` — HTTPS hosting of a static site on GitHub Pages with CI deployment, and
  access to the content without installing anything, a public site with 53 commits of history.
- `cases/dev/03-echelon-mini-game.en.md` — client-side work with browser media APIs (Web Audio): a dedicated
  AudioContext that respects the user's sound setting.
- `cases/dev/07-echelon-remote-pipeline.en.md` — a local HTTP server for results, reachable from a phone and a
  laptop over the private network.

## Level

**Confident.** Justified:

- A working service rather than a prototype: HTTPS on 8443, Basic Auth, a Windows service with autostart and log
  rotation — all documented in the project README (307 lines).
- Realtime communication handles edge cases: a viewer connecting after the camera, the browser blocking audio,
  an honest status instead of a stuck button.
- Operations are in place: 18 diagnostics tools and a wrapper for tasks that need administrator rights.
- Why not "advanced": the solution covers one task for two users, there are no automated tests, authentication is
  limited to Basic Auth, and load and fault tolerance have never been tested.

## What it proves

- The camera README (307 lines) and tools/ (18 files, 6 of them checks).
- server.js (399 lines): TLS, Basic Auth, WebSocket signalling, a REST API for motion events.
- Windows service: install-service.ps1 (106 lines) plus the status commands described in the README.
- The site https://frinog1-a11y.github.io/normcontrol-kb/ with 53 commits of history and CI deployment.
