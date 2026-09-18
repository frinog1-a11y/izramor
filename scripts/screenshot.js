/* ==========================================================================
   Izramor landing — screenshot utility (Playwright)

   Captures preview screenshots of the live project sites and stores them in
   assets/. Used by the case-card hover previews and by the og:image tag.

   Usage:
     npm install
     npx playwright install chromium
     node scripts/screenshot.js

   Besides the public sites the script captures work that only exists on this
   machine: the Cline Kanban board on localhost, the LoRA dataset, the output of
   the print-layout pipeline, the curated soundtrack and the Echelon Beyond
   repository tree. Local targets are opened through file:// (spreads are built
   by scripts/pdf-spread.py, self-contained pages by scripts/preview-pages.js)
   instead of over HTTP.

   If the Playwright browser download is blocked (cdn.playwright.dev is not
   reachable from every network), the script falls back to an already installed
   Chrome or Edge. Chrome 153 drives the same engine as Playwright's bundled
   Chromium 153, so the rendering is identical.
   ========================================================================== */

const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');
const preview = require('./preview-pages');

const OUT = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

/* The landing and the knowledge base fade sections in on scroll (.reveal).
   Forcing the final state keeps screenshots deterministic — the capture must
   never catch a half-faded section. */
const REVEAL_FIX = [
  '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
  'html { scroll-behavior: auto !important; }',
].join('\n');

/* --------------------------------------------------------------------------
   Local sources — the same machine the projects run on. Only the Kanban board
   answers over HTTP; everything else is read from disk (file://) or rendered
   into a page on the fly.
   -------------------------------------------------------------------------- */

const LOCAL_PAGES = path.join(os.tmpdir(), 'izramor-preview-pages');
const PYTHON = process.env.PYTHON || 'python';
const DESKTOP = path.join(process.env.USERPROFILE || 'C:\\Users\\Izramor Unated', 'Desktop');

/* The four curated tracks of the Echelon Beyond score (ACE-Step, local GPU). */
const AUDIO_DIR = path.join(DESKTOP, 'Echelon_Beyond_Music');
const AUDIO = [
  { title: 'Mereya Mystery', group: 'Ambient / Mystery', rel: 'Ambient\\Mystery\\Mereya Mystery.mp3' },
  { title: 'Hymn 0.1v', group: 'Anthem / main theme', rel: 'Anthem\\Hymn 0.1v.mp3' },
  { title: 'Eshelon Beyond, We Carry On!', group: 'Shanties / morale', rel: 'Shanties\\Eshelon Beyond We carry on!.mp3' },
  { title: 'Mereya Calling', group: 'Shanties / departure', rel: 'Shanties\\Mereya Calling.mp3' },
].map(function (t) { t.path = path.join(AUDIO_DIR, t.rel); return t; });

const LOCAL = {
  /* Cline Kanban — started by C:\EchelonBeyond\start-kanban.cmd (port 3484) */
  kanban: 'http://localhost:3484/echelonbeyond',
  repo: 'C:\\EchelonBeyond',
  /* LoRA dataset: the rejected frame and the regenerated frame of one subject */
  loraBefore: 'C:\\EchelonBeyond\\assets\\lora\\rejected\\batch1\\b07_matron.png',
  loraAfter: 'C:\\EchelonBeyond\\assets\\lora\\train\\b07_matron.png',
  /* print-layout pipeline output (add_margins.py: mirrored inner/outer margins) */
  printPdf: path.join(DESKTOP, 'Black Library_margins', 'Ересь Хоруса', '35 - Око терры.pdf'),
  printPages: [8, 9],
  audioDir: AUDIO_DIR,
  audio: AUDIO,
};

/* A local server may simply not be running — that is not a failure of the shot. */
async function ping(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/* Self-contained preview pages are written next to the OS temp folder. */
function writeLocalPage(file, html) {
  if (!fs.existsSync(LOCAL_PAGES)) { fs.mkdirSync(LOCAL_PAGES, { recursive: true }); }
  const target = path.join(LOCAL_PAGES, file.replace(/\.png$/, '.html'));
  fs.writeFileSync(target, html, 'utf8');
  return target;
}

/* Two facing pages of a print PDF on one sheet — the only way mirrored margins
   read as intended. Built by scripts/pdf-spread.py (PyMuPDF, the same library
   the page-setting pipeline uses); returns null so the caller can fall back to
   the plain PDF when Python or PyMuPDF is missing. */
function buildSpread(src, pages, outFile) {
  if (!fs.existsSync(src)) {
    console.log('  source PDF not found: ' + src);
    return null;
  }
  const script = path.join(__dirname, 'pdf-spread.py');
  const res = spawnSync(PYTHON, [script, '--src', src, '--out', outFile, '--pages', pages.join(',')],
    { encoding: 'utf8' });
  if (res.error || res.status !== 0) {
    const why = res.error ? res.error.message : String(res.stderr || '').trim().split('\n').pop();
    console.log('  spread not built (' + why + ')');
    return null;
  }
  console.log('  ' + String(res.stdout).trim());
  return outFile;
}

/* The configured print sample can be renamed by a pipeline re-run — take the
   biggest PDF of the run in that case instead of failing the shot. */
function printSource() {
  if (fs.existsSync(LOCAL.printPdf)) { return LOCAL.printPdf; }
  let best = null;
  const walk = function (dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.pdf$/i.test(entry.name)) { continue; }
      const size = fs.statSync(full).size;
      if (!best || size > best.size) { best = { path: full, size: size }; }
    }
  };
  try { walk(path.join(DESKTOP, 'Black Library_margins')); } catch (err) { return LOCAL.printPdf; }
  if (best) {
    console.log('  configured print PDF is gone — using ' + best.path);
    return best.path;
  }
  return LOCAL.printPdf;
}

/* File counts and sizes of a repository tree — the numbers on the repo card. */
function countTree(dir) {
  const acc = { files: 0, bytes: 0, children: {}, names: [] };
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') { continue; }
    const full = path.join(dir, entry.name);
    try {
      if (entry.isDirectory()) {
        const child = countTree(full);
        acc.children[entry.name] = child;
        acc.files += child.files;
        acc.bytes += child.bytes;
      } else {
        acc.files += 1;
        acc.bytes += fs.statSync(full).size;
        acc.names.push(entry.name);
      }
    } catch (err) { /* unreadable entry — keep counting the rest */ }
  }
  return acc;
}

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

  /* ---- local sources: the machine that does the work -------------------- */

  // Case 05 — the Cline Kanban board that drives the repository (localhost)
  { url: LOCAL.kanban,
    file: '05-remote-kanban.png',
    width: 1440, height: 900, fullPage: false, needsLocal: true, wait: 8000,
    // a fresh browser profile meets the board's onboarding overlay — close it
    afterLoad: async function (page) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(800);
      const overlay = await page.locator('text=Get started').first().isVisible()
        .catch(function () { return false; });
      if (overlay) {
        await page.mouse.click(953, 200);
        await page.waitForTimeout(800);
      }
    } },

  // Case 05 — the repository behind the board, counted straight off disk
  { html: function () { return preview.repoPage(countTree(LOCAL.repo), LOCAL.repo); },
    file: '05-repo-structure.png',
    width: 1440, height: 900, fullPage: false },

  // Case 06 — print layout: two facing pages of the pipeline output, as a spread
  { resolve: printSource,
    file: '06-print-layout.png',
    width: 1440, height: 900, fullPage: false,
    pdfPages: LOCAL.printPages, hash: '#zoom=page-fit', closePdfSidebar: true, clipTop: 58 },

  // Case 03 — LoRA dataset: rejected frame vs the regenerated frame, same subject
  { path: LOCAL.loraBefore,
    file: '03-lora-before.png',
    width: 1024, height: 1024, fullPage: false, fitImage: true, maxWidth: 900, scale: 1 },

  { path: LOCAL.loraAfter,
    file: '03-lora-after.png',
    width: 1024, height: 1024, fullPage: false, fitImage: true, maxWidth: 900, scale: 1 },

  // Case 04 — the curated soundtrack, rendered as a playable page
  { html: function () { return preview.musicPage(LOCAL.audio, LOCAL.audioDir); },
    file: '04-music.png',
    width: 1440, height: 900, fullPage: false, wait: 3500 },

  // Case 08 — Lorien: core -> roles -> activation codes
  { html: function () { return preview.lorienPage(); },
    file: '08-lorien.png',
    width: 1440, height: 900, fullPage: false },
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
    // a local server that is not running is a skip, not a failure
    if (t.needsLocal && !(await ping(t.url))) {
      console.log('SKIPPED ' + t.file + ' — ' + t.url + ' is not answering');
      console.log('  start the board with C:\\EchelonBeyond\\start-kanban.cmd and run the shot again');
      report.push({ file: t.file, status: 'skipped: source offline', kb: 0 });
      continue;
    }

    const sourcePath = t.resolve ? t.resolve() : t.path;
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: t.scale || 2,
      isMobile: t.mobile || false,
      hasTouch: t.mobile || false,
    });
    const page = await context.newPage();
    const outPath = path.join(OUT, t.file);

    // what to open: a generated page, a local file or a remote URL
    let url;
    if (t.html) {
      url = pathToFileURL(writeLocalPage(t.file, t.html())).href;
    } else if (sourcePath) {
      // percent-encode non-ASCII paths (the knowledge base uses Cyrillic slugs)
      url = pathToFileURL(sourcePath).href;
    } else {
      url = new URL(t.url).href;
    }
    if (t.pdfPages) {
      const spread = buildSpread(sourcePath, t.pdfPages,
        path.join(LOCAL_PAGES, t.file.replace(/\.png$/, '.pdf')));
      if (spread) { url = pathToFileURL(spread).href; }
      else { console.log('  falling back to the source PDF itself'); }
    }
    if (t.hash) { url += t.hash; }

    console.log('Loading', url, t.scrollY ? '(scrollY ' + t.scrollY + ')' : '');
    try {
      const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      const status = response ? response.status() : 'no-response';

      // give late resources (fonts, canvases, audio metadata) a chance to settle
      try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) { /* keep going */ }
      try { await page.addStyleTag({ content: REVEAL_FIX }); } catch (e) { /* not an HTML document */ }

      // a picture opened straight from disk: keep its own ratio, only downsized
      if (t.fitImage) {
        const natural = await page.evaluate(function () {
          const img = document.querySelector('img');
          return img && img.naturalWidth ? { w: img.naturalWidth, h: img.naturalHeight } : null;
        });
        if (natural) {
          const w = Math.min(natural.w, t.maxWidth || 900);
          const h = Math.round(natural.h * (w / natural.w));
          await page.setViewportSize({ width: w, height: h });
          await page.evaluate(function () {
            const img = document.querySelector('img');
            document.documentElement.style.background = '#0e0d12';
            document.body.style.margin = '0';
            if (img) { img.style.display = 'block'; img.style.maxWidth = '100%'; img.style.maxHeight = '100vh'; }
          });
          console.log('  viewport ' + w + 'x' + h + ' (image ' + natural.w + 'x' + natural.h + ')');
        }
      }

      // the built-in PDF viewer opens with its thumbnail rail — close it
      if (t.closePdfSidebar) {
        await page.mouse.click(35, 26);
        await page.waitForTimeout(2000);
      }

      // page-specific housekeeping (an onboarding overlay, for instance)
      if (t.afterLoad) { await t.afterLoad(page); }

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

      // a PDF shot keeps its dark viewer background but loses the toolbar
      const shot = { path: outPath, fullPage: t.fullPage || false };
      if (t.clipTop) {
        shot.clip = { x: 0, y: t.clipTop, width: t.width, height: t.height - t.clipTop };
        shot.fullPage = false;
      }
      await page.screenshot(shot);

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
