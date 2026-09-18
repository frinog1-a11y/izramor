/* ==========================================================================
   Izramor landing — screenshot utility (Playwright)

   Captures preview screenshots of the live project sites and stores them in
   assets/. Used by the case-card hover previews and by the og:image tag.

   Usage:
     npm install
     npx playwright install chromium
     node scripts/screenshot.js

   If the Playwright browser download is blocked (cdn.playwright.dev is not
   reachable from every network), the script falls back to an already installed
   Chrome or Edge. Chrome 153 drives the same engine as Playwright's bundled
   Chromium 153, so the rendering is identical.
   ========================================================================== */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

/* The landing and the knowledge base fade sections in on scroll (.reveal).
   Forcing the final state keeps screenshots deterministic — the capture must
   never catch a half-faded section. */
const REVEAL_FIX = [
  '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
  'html { scroll-behavior: auto !important; }',
].join('\n');

const targets = [
  // Knowledge base — main page
  { url: 'https://frinog1-a11y.github.io/normcontrol-kb/',
    file: '02-normcontrol-main.png',
    width: 1440, height: 900, fullPage: false },

  // Knowledge base — one error note (the card the whole base is built from)
  { url: 'https://frinog1-a11y.github.io/normcontrol-kb/02_Ошибки/Чертёж_общие/Неверное_обозначение_шероховатости',
    file: '02-normcontrol-card.png',
    width: 1440, height: 900, fullPage: false },

  // Mini-game — the playable page hosted by the landing (this is where "Play →" goes)
  { url: 'https://frinog1-a11y.github.io/izramor/echelon/',
    file: '07-mini-game.png',
    width: 1440, height: 900, fullPage: false, click: '#btn-start', wait: 5000 },

  // Mini-game — the same demo embedded in the knowledge base
  { url: 'https://frinog1-a11y.github.io/normcontrol-kb/echelon',
    file: '07-mini-game-kb.png',
    width: 1440, height: 900, fullPage: false, click: '#btn-start', wait: 5000 },

  // Landing hero
  { url: 'https://frinog1-a11y.github.io/izramor/',
    file: '01-landing-hero.png',
    width: 1440, height: 900, fullPage: false },

  // Landing cases section
  { url: 'https://frinog1-a11y.github.io/izramor/',
    file: '01-landing-cases.png',
    width: 1440, height: 900, fullPage: false, scrollSelector: '#cases' },

  // Landing hero cut to the 1.91:1 ratio link previews expect
  { url: 'https://frinog1-a11y.github.io/izramor/',
    file: '01-og-hero.png',
    width: 1200, height: 630, fullPage: false },

  // Mobile view of landing
  { url: 'https://frinog1-a11y.github.io/izramor/',
    file: '01-landing-mobile.png',
    width: 375, height: 812, fullPage: false, mobile: true },
];

/* Optional CLI filter: "node scripts/screenshot.js mini-game" captures only the
   targets whose file name contains that string (handy for single re-shots). */
const filter = process.argv[2];
const queue = filter ? targets.filter(function (t) { return t.file.indexOf(filter) !== -1; }) : targets;

/* Playwright ships its own Chromium, but downloading it needs access to
   cdn.playwright.dev. When that is blocked we drive an installed browser
   instead — same engine, no download. */
async function launchBrowser() {
  try {
    const browser = await chromium.launch();
    console.log('Browser: bundled Playwright Chromium');
    return browser;
  } catch (err) {
    const reason = String(err.message || err).split('\n')[0];
    console.log('Bundled Chromium not available (' + reason + ')');
  }
  for (const channel of ['chrome', 'msedge']) {
    try {
      const browser = await chromium.launch({ channel: channel });
      console.log('Browser: installed ' + channel);
      return browser;
    } catch (err) {
      console.log('Could not launch ' + channel + ': ' + String(err.message || err).split('\n')[0]);
    }
  }
  throw new Error('No usable browser: install with "npx playwright install chromium" or install Chrome/Edge.');
}

(async () => {
  const browser = await launchBrowser();
  const report = [];

  if (!queue.length) {
    console.log('No targets match "' + filter + '".');
    await browser.close();
    return;
  }

  for (const t of queue) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 2,
      isMobile: t.mobile || false,
      hasTouch: t.mobile || false,
    });
    const page = await context.newPage();
    const outPath = path.join(OUT, t.file);
    // percent-encode non-ASCII paths (the knowledge base uses Cyrillic slugs)
    const url = new URL(t.url).href;

    console.log('Loading', url, t.scrollY ? '(scrollY ' + t.scrollY + ')' : '');
    try {
      const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      const status = response ? response.status() : 'no-response';

      // give late resources (fonts, canvases) a chance to settle
      try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) { /* keep going */ }

      await page.addStyleTag({ content: REVEAL_FIX });

      // the mini-game only starts drawing after its own start button is pressed
      if (t.click) {
        try {
          await page.click(t.click, { timeout: 10000 });
          console.log('  clicked ' + t.click);
        } catch (err) {
          console.log('  click skipped — ' + String(err.message || err).split('\n')[0]);
        }
      }

      if (t.wait) { await page.waitForTimeout(t.wait); }
      if (t.scrollSelector) {
        await page.evaluate(function (sel) {
          const el = document.querySelector(sel);
          if (el) { window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - 40); }
        }, t.scrollSelector);
      } else if (t.scrollY) {
        await page.evaluate(function (y) { window.scrollTo(0, y); }, t.scrollY);
      }
      await page.waitForTimeout(500);

      await page.screenshot({ path: outPath, fullPage: t.fullPage || false });

      const size = fs.statSync(outPath).size;
      console.log('Saved', outPath, '(' + Math.round(size / 1024) + ' KB, HTTP ' + status + ')');
      report.push({ file: t.file, status: status, kb: Math.round(size / 1024) });
    } catch (err) {
      console.log('FAILED', t.file, '-', err.message);
      report.push({ file: t.file, status: 'error: ' + err.message, kb: 0 });
    }

    await context.close();
  }

  await browser.close();
  console.log('All done.');
  console.log(JSON.stringify(report, null, 2));
})();
