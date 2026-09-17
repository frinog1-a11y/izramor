# Windows automation and CI

## What it is

Removing manual work: PowerShell and Python scripts for batch operations, scheduled tasks, Windows services,
CI pipelines and self-checking tests instead of manual control.

## Where it is confirmed

- `cases/dev/01-videokamera.en.md` — 18 tools in tools/ (certificate, port, ntfy, firewall and syntax
  diagnostics), log rotation and a daily cleanup task in Task Scheduler, a service installation script, and a
  UAC-elevation wrapper for an agent without admin rights.
- `cases/dev/06-txt-to-docx.en.md` — 22 batch processing scripts: 194 PDFs rebuilt with mirrored margins, a
  "found / processed / errors" report, automatic dependency installation, 14 result check scripts, reversible
  renaming.
- `cases/dev/07-echelon-remote-pipeline.en.md` — 68 automation files: pushing results to devices, waking the PC
  over the network, automatic logon, autostart of local models, 32 environment diagnostics scripts.
- `cases/dev/02-normcontrol-kb.en.md` — CI on GitHub Actions: build, deploy, a separate job "from issue to note
  with AI", and a script audit of links and metadata.
- `cases/dev/04-echelon-beyond.en.md` — the "every task leaves a result" contract plus board mechanics started by
  a single cmd file.

## Level

**Confident.** Justified:

- Volume: 18 + 22 + 68 scripts across three different projects, each for a specific operation.
- Batch scale: 194 PDFs and ~300 audio files processed by scripts rather than by hand.
- Self-checks exist: 14 scripts checking margins and sizes, 6 diagnostics in the camera service, and a link audit
  in the knowledge base.
- Operational maturity: services, Task Scheduler, log rotation, privilege wrappers.
- Why not "advanced": the scripts live in specific folders with absolute paths, there is no shared library of
  reusable modules, and CI exists for one project only.

## What it proves

- Camera project: tools/ (18 files), install-service.ps1 (106 lines), log cleanup tasks.
- Print layout: 22 Python scripts (≈2,240 lines), sets of 97 and 97 PDFs, zip archives.
- Pipeline: tools/delivery (9), tools/setup (11), tools/diag (32), tools/kanban (16).
- Knowledge base: .github/workflows/deploy.yml, .github/scripts (3 files), tsc and prettier checks.
