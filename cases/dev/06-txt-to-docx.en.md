# Print layout for books and manuals: text and PDF → a print-ready set

## Summary

A set of 22 Python scripts that turns raw text manuals and downloaded PDF books into sets ready for
double-sided printing: text first becomes a PDF (with tables normalised), then every page is rebuilt on A4 with
mirrored margins for the spine. It has been run over 194 PDFs and ten text manuals; the results are stored as
ready-made sets.

## Problem

The manuals were written as plain .txt files — tables made of pipe characters, columns falling apart — and could
not be printed as they were. The downloaded books in the series had pages of different sizes and identical
margins on both sides, so when bound into a block the text ran into the spine and got cut off. Editing a hundred
files by hand makes no sense: batch processing with result checks was required.

## Solution

1. make_guides_pdf.py (494 lines): walks every .txt in the manuals folder, normalises tables into Markdown,
   assembles HTML and converts it to PDF; it installs missing libraries through pip by itself and suppresses
   characters the console cannot print.
2. generate_pdfs.py (738 lines) plus fix_docs.py (196 lines): a pipeline over .docx volumes — analysis, targeted
   structural fixes, PDF generation, with .bak copies of the sources kept.
3. Three analysis utilities (analyze.py 44, analyze2.py 28, analyze3.py 82 lines) to inspect the structure and
   metrics of the volumes before processing.
4. add_margins.py (81) and add_margins_black_library.py (75): PDF rebuilding via PyMuPDF — every page is placed
   on a white A4 sheet with mirrored margins (inner 40 mm for the spine, outer 8 mm, top and bottom 5 mm); odd
   and even pages are mirrored automatically, content is scaled proportionally and centred.
5. Two independent runs over two series (97 files each) with their own margin configurations.
6. Result packaging: a zip archive of the set is produced right after processing.
7. rename_books.py (105) and revert_rename.py (77): bringing series file names to one format and rolling it
   back — the rename operation is made reversible.
8. 14 separate check scripts: page and file sizes, margins, page rotation, insertion scale, volume content,
   folder integrity, and the rename result.
9. A run over text manuals: TXT → tables → HTML → PDF into a separate output folder.
10. Data safety: sources are never overwritten, results go into separate folders, plus .bak copies and archives.

## Metrics

| Metric | Value |
|---|---|
| Time spent | not documented |
| Cost (API) | $0 — local scripts only |
| Commits | none: this is a working folder of scripts, git was not used |
| Files changed | 22 Python scripts |
| Lines of code | ≈ 2,240 lines of Python |
| Tools built | 22 (4 pipelines, 4 analysis utilities, 14 check scripts) |
| Tests and automated checks | 14 check scripts (sizes, margins, rotation, scale, content) |
| Users | 1 (the author) |
| Live URL | none |

Processed: 194 PDFs (265 MB in → 649 MB out with margins), 10 text manuals, 13 .docx volumes with corrected copies.

## Skills demonstrated

- Programmatic PDF work (PyMuPDF): page-by-page rebuilding, page insertion, exact point-based geometry.
- Print production rules: mirrored margins, spine, bleed allowance, proportional scaling on insertion.
- Batch processing of hundreds of files: tree walking, error handling, a final "found / processed / errors" report.
- Safe operations: separate output folders, clean re-creation, .bak copies, reversible renaming.
- Document pipeline: TXT → Markdown tables → HTML → PDF with automatic dependency installation.
- Self-checking the result with scripts instead of reviewing 97 files by hand.
- Dealing with Windows console encodings (cp1251, BOM, CRLF).

## Stack

Python 3.11 and 3.14, PyMuPDF (fitz), zipfile/shutil, pip and an external converter called from the script,
custom check scripts, a .bat wrapper on Windows 10.

## Limitations

- The scripts live directly in the working folder and contain absolute paths — moving them to another PC
  requires edits.
- No git and no README: versions are not tracked, history rests on .bak copies.
- No separate "TXT → DOCX" step was found: the pipeline does TXT → PDF and DOCX → PDF. If the author meant
  another script, it is not on this PC (see the open questions in the README).
- Margins are added by placing a page onto a new sheet; the text is not reflowed, so the output is not a "live"
  PDF.
- Effort and timelines are not documented.

## Artifacts

- 22 scripts in the author's working folder: make_guides_pdf.py, generate_pdfs.py, fix_docs.py, add_margins.py,
  add_margins_black_library.py, rename_books.py, revert_rename.py and the checks.
- Sets with margins: 97 PDFs / 329 MB and 97 PDFs / 320 MB, plus zip archives of about 250 MB each.
- Sources: two series of 97 PDFs each (265 MB each), 10 manuals in HTML/PDF, three manual folders in TXT/DOCX
  (10 txt, 13 docx).
- No screenshots yet.

## Next steps

- Move the scripts into a git repository with a README and a before/after example.
- Replace absolute paths with command-line arguments.
- Add a contact sheet (page previews) for quick margin checking.
- Automate page numbers and a table of contents for the printed set.
