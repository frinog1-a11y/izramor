"""Two-page spread builder for the print-layout case preview.

Puts pages N and N+1 of a PDF side by side on one landscape page, so the spread
can be opened in a browser (file://) and screenshotted as a single image. Mirrored
inner/outer margins — the whole point of the print-layout pipeline — only read as
intended when the two pages of a spread are seen next to each other.

Usage:
    python scripts/pdf-spread.py --src "<book.pdf>" --out "<spread.pdf>" --pages 8,9

Requires PyMuPDF (the print-layout pipeline itself is built on it).
"""

import argparse
import os
import sys

try:
    import fitz  # PyMuPDF
except ImportError:  # pragma: no cover - the caller falls back to a plain page
    print('PyMuPDF is not installed (pip install pymupdf)', file=sys.stderr)
    sys.exit(4)


def main():
    ap = argparse.ArgumentParser(description='Render two PDF pages side by side.')
    ap.add_argument('--src', required=True, help='source PDF')
    ap.add_argument('--out', required=True, help='spread PDF to write')
    ap.add_argument('--pages', default='8,9', help='two 1-based page numbers, e.g. 8,9')
    ap.add_argument('--gutter', type=float, default=0.8, help='gutter line width in pt (0 = none)')
    args = ap.parse_args()

    try:
        nums = [int(x) for x in args.pages.split(',')]
    except ValueError:
        print('--pages expects two numbers, e.g. 8,9', file=sys.stderr)
        return 2
    if len(nums) != 2:
        print('--pages expects exactly two page numbers', file=sys.stderr)
        return 2

    first, second = nums[0] - 1, nums[1] - 1
    src = fitz.open(args.src)
    if second >= src.page_count or first < 0:
        print('page %d is outside the document (%d pages)' % (nums[1], src.page_count), file=sys.stderr)
        return 3

    r1, r2 = src[first].rect, src[second].rect
    width = r1.width + r2.width
    height = max(r1.height, r2.height)

    out = fitz.open()
    page = out.new_page(width=width, height=height)
    page.draw_rect(fitz.Rect(0, 0, width, height), color=(1, 1, 1), fill=(1, 1, 1), width=0)
    page.show_pdf_page(fitz.Rect(0, 0, r1.width, r1.height), src, first)
    page.show_pdf_page(fitz.Rect(r1.width, 0, width, r2.height), src, second)
    if args.gutter > 0:
        page.draw_line(fitz.Point(r1.width, 0), fitz.Point(r1.width, height),
                       color=(0.72, 0.72, 0.72), width=args.gutter)

    out.save(args.out, garbage=4, deflate=True)
    out.close()
    src.close()

    print('spread %s: pages %d+%d of %s -> %.0fx%.0f pt' % (
        args.out, nums[0], nums[1], os.path.basename(args.src), width, height))
    return 0


if __name__ == '__main__':
    sys.exit(main())
