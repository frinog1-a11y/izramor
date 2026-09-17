# Izramor — personal landing (Midnight Atelier)

Bilingual (EN default, RU via switch) one-page landing for Izramor: AI engineer and automation consultant.
Pure HTML + CSS + JS, no frameworks, no third-party JS. Only external resource: Google Fonts
(Playfair Display, Inter, JetBrains Mono).

## Live

- Site: https://frinog1-a11y.github.io/izramor/
- Repository: https://github.com/frinog1-a11y/izramor

## Files

| File | Purpose |
|---|---|
| `index.html` | 9 sections: Hero, About, What I do, Typical projects (pricing), Cases, Atlas, How I work, Stack, Contact |
| `style.css` | Midnight Atelier design system: tokens, cards, signature elements, responsive rules |
| `script.js` | Atlas force-directed graph, counters, scroll effects, cursor, language switch |
| `README.md` | this file |
| `.nojekyll` | disables Jekyll processing on GitHub Pages |
| `assets/` | screenshots and previews (empty for now) |

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

## Deploy

Pushing to the `main` branch of `frinog1-a11y/izramor` publishes the site through GitHub Pages
(branch `main`, root folder). `.nojekyll` keeps files served as-is.

---

# Лендинг Izramor (Midnight Atelier)

Одностраничник на двух языках: английский по умолчанию, русский — переключателем в правом верхнем углу.
Чистый HTML + CSS + JS, без фреймворков. Единственный внешний ресурс — Google Fonts.

Живой сайт: https://frinog1-a11y.github.io/izramor/ · Репозиторий: https://github.com/frinog1-a11y/izramor

Дизайн: тёмная «ночная мастерская» — чернильный фон, тёплый янтарный акцент, карточки-ящики,
золотые линии-разделители, монопространственные теги, чертёжные уголки секций.

Atlas — интерактивный граф: 23 узла (12 кейсов и 11 навыков) и 42 связи; Canvas 2D, hover-подсветка,
тултипы, клик открывает кейс.

Языки: EN по умолчанию, выбор сохраняется в `localStorage` (`izramor-lang`).
