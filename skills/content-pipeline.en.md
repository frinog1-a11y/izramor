# Content pipeline: text → site → print

## What it is

Taking material all the way through: raw text → a structured base with links → a public site with search →
a print-ready set. With quality control at every step.

## Where it is confirmed

- `cases/dev/02-normcontrol-kb.en.md` — 128 Markdown files and a strict base structure: 24 error cards in
  7 categories, 46 standard summaries, 29 document types in 5 categories, templates, backlinks. An automated link
  audit: 29 of 29 documents and 46 of 46 standards are linked to errors. Publishing a static site with search, a
  link graph and themes.
- `cases/dev/06-txt-to-docx.en.md` — the reverse path: TXT → tables normalised into Markdown → HTML → PDF, then
  194 PDFs rebuilt into a print format with mirrored margins for the spine (inner 40 mm, outer 8 mm, top and
  bottom 5 mm).
- `cases/dev/04-echelon-beyond.en.md` — 18 volumes of world documentation (volume 0 and volumes I–XVIII), five of
  them text volumes with 4,961 lines of text; plus 5 art production documents and 6 technical ones.
- `cases/dev/03-echelon-mini-game.en.md` — turning an "article" into something interactive: a site page with a game
  living inside it, while the page itself is excluded from search and the graph.

## Level

**Confident.** Justified:

- Scale: 128 notes with metadata and links, 18 volumes of guidance, 194 PDFs — this is not a single text.
- A single card format and automated integrity checks (link resolvability, duplicate tags, metadata) — an approach
  that keeps a large base in order.
- The print branch reaches a physical result: ready-made sets, archives, margin and size checks, .bak safety copies
  and reversible renaming.
- Publishing is automated: push → build → site; new notes can be added from a phone through a single field.
- Why not "advanced": the pipeline was built for two personal projects, there is no reusable template for others,
  and no external user has gone through the "text → site" path on their own.

## What it proves

- The knowledge base README and HANDOFF.md, the link graph on the site, the /add-note page.
- The sets ClinePdf_margins (97 PDFs, 329 MB) and Black Library_margins (97 PDFs, 320 MB).
- Three manual folders in TXT/DOCX (10 txt, 13 docx, 13 corrected docx) and 18 volumes in the game project.
- 22 pipeline scripts and 14 checks in case 06.
