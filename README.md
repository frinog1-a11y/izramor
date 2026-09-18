# Izramor — personal landing (Midnight Atelier)

Bilingual (EN default, RU via switch) one-page landing for Izramor: AI engineer and automation consultant.
Pure HTML + CSS + JS, no frameworks, no third-party JS. Only external resource: Google Fonts
(Playfair Display, Inter, JetBrains Mono).

## Live

- Site: https://frinog1-a11y.github.io/izramor/
- Repository: https://github.com/frinog1-a11y/izramor
- Portfolio repository: https://github.com/frinog1-a11y/portfolio
- Portfolio site: https://frinog1-a11y.github.io/portfolio/

## Files

| File | Purpose |
|---|---|
| `index.html` | 9 sections: Hero, About, What I do, Typical projects (pricing), Cases, Atlas, How I work, Stack, Contact |
| `style.css` | Midnight Atelier design system: tokens, cards, signature elements, responsive rules |
| `script.js` | Atlas force-directed graph, counters, scroll effects, cursor, language switch |
| `README.md` | this file |
| `.nojekyll` | disables Jekyll processing on GitHub Pages |
| `assets/` | case preview screenshots (shown on card hover) + `og:image` |

## Case files

The case and skill markdown no longer lives in this repository. It is published from
https://github.com/frinog1-a11y/portfolio, and every "Open case" link and every Atlas node points at the Blob view
there: EN files resolve to `.en.md`, RU files to `.ru.md`, following the active language. One copy means the two
sets can no longer drift apart.

## Design system

Dark ink background `#0e0d12`, wood `#1a1720`, cards `#1f1c28`, cream text `#f2eef8`,
amber accent `#d4a55a`, lavender `#8a7ab8` (creative), rose `#b86a8a` (skills).

Signature elements: blueprint grid under the hero, box cards with an amber handle, gold divider lines,
mono tags, growing underlines on headings, draft corners on sections, custom cursor, cursor glow.

## Atlas

Interactive map of work: 23 nodes (12 cases + 11 skills) and 42 edges (35 case ↔ skill, 7 case ↔ case).
Canvas 2D, devicePixelRatio-aware, force-directed layout, hover dimming, tooltips, click to open a case.

## Languages

EN is the default. The switch in the top-right corner toggles EN / RU, the choice is stored in
`localStorage` under the key `izramor-lang`. Markup pattern: `body.lang-en [lang="ru"] { display: none }`.

## Local run

```
cd C:\Landing
python -m http.server 8080
```

Then open http://localhost:8080 (a static server is needed so that relative links and fonts behave as on Pages).

## Screenshots

`npm run screenshots` (`node scripts/screenshot.js`) captures every preview into `assets/`: the
public sites over HTTP, and this machine's own work through `file://` — the Cline Kanban board on
localhost, the LoRA dataset, the print-layout spread, the curated soundtrack, the repository tree.

| Target | Source |
|---|---|
| `02-normcontrol-*.png` | the knowledge base (GitHub Pages) — case 01 |
| `03-lora-before.png`, `03-lora-after.png` | one subject of the LoRA dataset: the rejected frame in `assets\lora\rejected\batch1` and the regenerated one in `assets\lora\train` — case 03 |
| `04-music.png` | the four curated tracks of `…\Desktop\Echelon_Beyond_Music` — case 04 |
| `05-remote-kanban.png` | the board on `http://localhost:3484/echelonbeyond` (started by `C:\EchelonBeyond\start-kanban.cmd`; skipped when it is not running) — case 05 |
| `05-repo-structure.png` | `C:\EchelonBeyond` counted straight off disk — case 05 |
| `06-print-layout.png` | pages 8+9 of the margin pipeline output (`…\Desktop\Black Library_margins\…`) as one spread — case 06 |
| `07-mini-game*.png` | the demo hosted by this repository — case 07 |
| `08-lorien.png` | the Lorien crystal map, built from the case text — case 08 |
| `01-landing-*.png`, `01-og-hero.png` | this landing (`og:image`) |

Requirements: Node, `npm install`, and a browser. If `npx playwright install chromium` is blocked
(cdn.playwright.dev is not reachable from every network), the script drives an installed Chrome or
Edge — same engine. `06-print-layout.png` also needs Python with PyMuPDF: `scripts/pdf-spread.py`
puts two facing pages on one sheet, which is the only way mirrored inner/outer margins read as
intended; without Python the shot falls back to a single page of the source PDF.

`node scripts/screenshot.js <substring>` re-shoots only the targets whose file name matches.

A case card takes its preview from `data-preview` (one image) or from `data-preview-pair` plus
`data-preview-caps` / `data-preview-caps-ru` (two captioned frames — LoRA off/on, board/repo).
Cards with neither keep the "Preview coming soon" plate.

## Deploy

Pushing to the `main` branch of `frinog1-a11y/izramor` publishes the site through GitHub Pages
(branch `main`, root folder). `.nojekyll` keeps files served as-is.

---

# Лендинг Izramor (Midnight Atelier)

Одностраничник на двух языках: английский по умолчанию, русский — переключателем в правом верхнем углу.
Чистый HTML + CSS + JS, без фреймворков. Единственный внешний ресурс — Google Fonts.

Живой сайт: https://frinog1-a11y.github.io/izramor/ · Репозиторий: https://github.com/frinog1-a11y/izramor
Портфолио: https://github.com/frinog1-a11y/portfolio · https://frinog1-a11y.github.io/portfolio/

Дизайн: тёмная «ночная мастерская» — чернильный фон, тёплый янтарный акцент, карточки-ящики,
золотые линии-разделители, монопространственные теги, чертёжные уголки секций.

Atlas — интерактивный граф: 23 узла (12 кейсов и 11 навыков) и 42 связи; Canvas 2D, hover-подсветка,
тултипы, клик открывает кейс.

Языки: EN по умолчанию, выбор сохраняется в `localStorage` (`izramor-lang`).

Файлы кейсов и навыков (markdown) в этом репозитории больше не хранятся: они публикуются из
https://github.com/frinog1-a11y/portfolio, ссылки «Открыть кейс» и узлы Atlas ведут на Blob-просмотр там —
английские на `.en.md`, русские на `.ru.md`, по активному языку.
