/* ==========================================================================
   Izramor landing — generated preview pages

   Some case cards show work that never leaves this machine: the curated
   soundtrack, the repository map and the Lorien crystal structure. There is no
   public page to point a camera at, so screenshot.js renders a small page from
   local data (the real tracks, the real folder sizes, the structure documented
   in the case text), opens it through file:// and captures it.

   Not a website: these pages exist only to be photographed.
   ========================================================================== */

const fs = require('fs');
const { pathToFileURL } = require('url');

const ATELIER = `
  :root {
    color-scheme: dark;
    --ink: #0e0d12;
    --wood: #1a1720;
    --card: #1f1c28;
    --border: #2a2635;
    --cream: #f2eef8;
    --muted: #a8a0b8;
    --amber: #d4a55a;
    --lavender: #8a7ab8;
    --rose: #b86a8a;
  }
  * { box-sizing: border-box; }
  html { background: var(--ink); }
  body {
    margin: 0;
    padding: 46px 56px;
    color: var(--cream);
    font: 16px/1.55 Inter, 'Segoe UI', system-ui, sans-serif;
    background-color: var(--ink);
    background-image:
      linear-gradient(rgba(212,165,90,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,165,90,0.035) 1px, transparent 1px);
    background-size: 24px 24px;
    -webkit-font-smoothing: antialiased;
  }
  .mono { font-family: 'JetBrains Mono', Consolas, ui-monospace, monospace; }
  .kicker {
    color: var(--amber);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin: 0 0 12px;
  }
  h1 { font: 600 31px/1.2 Georgia, 'Playfair Display', serif; margin: 0 0 10px; }
  .sub { color: var(--muted); font-size: 14px; margin: 0 0 28px; max-width: 62ch; }
  .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 26px; align-items: start; }
  .panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 22px;
  }
  .panel .kicker { margin-bottom: 14px; }
  ul { list-style: none; margin: 0; padding: 0; }
`;

const MUSIC = ATELIER + `
  .track { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .track:last-child { border-bottom: 0; padding-bottom: 4px; }
  .idx { color: var(--amber); font-size: 13px; padding-top: 2px; }
  .meta { flex: 1; min-width: 0; }
  .name { font-size: 16px; font-weight: 600; }
  .grp { color: var(--muted); font-size: 12px; margin-bottom: 6px; }
  audio { width: 100%; height: 34px; display: block; }
  .tree li {
    display: flex; justify-content: space-between; gap: 10px;
    padding: 6px 0; border-bottom: 1px dashed var(--border); font-size: 13px;
  }
  .tree li:last-child { border-bottom: 0; }
  .tree .n { color: var(--muted); }
  .note { color: var(--muted); font-size: 12px; margin: 16px 0 0; }
`;

const REPO = ATELIER + `
  .tree .d { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; padding-top: 12px; }
  .tree .d:first-child { padding-top: 0; }
  .tree .d > span:first-child { color: var(--cream); font-weight: 600; }
  .tree .n { color: var(--muted); }
  .tree .sd { color: var(--muted); font-size: 12.5px; padding: 3px 0 0 16px; }
  .facts li { position: relative; padding: 0 0 12px 18px; font-size: 14px; }
  .facts li::before { content: '\\25B8'; position: absolute; left: 0; color: var(--amber); }
  .facts span { color: var(--muted); }
`;

const LORIEN = ATELIER + `
  .core {
    background: linear-gradient(180deg, rgba(138,122,184,0.16), rgba(31,28,40,0.9));
    border: 1px solid var(--lavender);
    border-radius: 12px;
    padding: 20px 24px;
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
  }
  .core .kicker { margin-bottom: 8px; }
  .cname { font: 600 24px/1.25 Georgia, 'Playfair Display', serif; }
  .cgloss { color: var(--muted); font-size: 13px; margin-top: 6px; }
  .stem { width: 1px; height: 26px; margin: 0 auto; background: var(--border); }
  .roles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .role {
    background: var(--card);
    border: 1px solid var(--border);
    border-top: 2px solid var(--amber);
    border-radius: 10px;
    padding: 14px 12px 12px;
    text-align: center;
  }
  .role .rn { font-size: 15px; font-weight: 600; }
  .role .re { color: var(--muted); font-size: 12px; margin: 2px 0 10px; }
  .role .rc { color: var(--amber); font-size: 11px; letter-spacing: 0.06em; }
  .versions {
    margin: 26px 0 0;
    padding-top: 18px;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 13px;
    text-align: center;
  }
  .versions b { color: var(--cream); font-weight: 600; }
`;

function page(title, css, body) {
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>' +
    title + '</title>\n<style>' + css + '</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';
}

function mb(bytes) {
  const m = bytes / 1048576;
  return (m >= 10 ? m.toFixed(0) : m.toFixed(1)) + ' MB';
}

/* Case 04 — the four curated tracks, with working audio players. */
function musicPage(tracks, root) {
  const rows = tracks.map(function (t, i) {
    const size = fs.existsSync(t.path) ? mb(fs.statSync(t.path).size) : 'missing';
    return '    <div class="track">\n' +
      '      <span class="idx mono">' + String(i + 1).padStart(2, '0') + '</span>\n' +
      '      <div class="meta">\n' +
      '        <div class="name">' + t.title + '</div>\n' +
      '        <div class="grp mono">' + t.group + ' &middot; ' + size + '</div>\n' +
      '        <audio controls preload="metadata" src="' + pathToFileURL(t.path).href + '"></audio>\n' +
      '      </div>\n' +
      '    </div>';
  }).join('\n');

  const groups = [
    ['Ambient', 'Calm &middot; Mystery &middot; Tension'],
    ['Anthem', 'main theme'],
    ['Bosses', '5 bosses'],
    ['Unique_Bosses', 'Ark Guardian'],
    ['Minibosses', 'encounters'],
    ['Shanties', '7 moods'],
    ['Layers', '5 depth levels'],
    ['Epilogues', '5 layers'],
    ['Endings', '5 endings'],
    ['Menu', 'title screen'],
  ].map(function (g) {
    return '        <li><span>' + g[0] + '/</span><span class="n mono">' + g[1] + '</span></li>';
  }).join('\n');

  const body = [
    '<p class="kicker mono">ACE-Step · local generation · RTX 3060 Ti</p>',
    '<h1>Echelon Beyond — original soundtrack</h1>',
    '<p class="sub">Four curated tracks out of 379 local renders. Prompts, batch runs and curation were orchestrated through Cline; every track was generated and mastered on this machine.</p>',
    '<div class="cols">',
    '  <div class="panel">',
    rows,
    '  </div>',
    '  <div class="panel">',
    '    <p class="kicker mono">library structure</p>',
    '    <ul class="tree mono">',
    groups,
    '    </ul>',
    '    <p class="note">' + root + ' — 10 groups, each with its own description file.</p>',
    '  </div>',
    '</div>',
  ].join('\n');

  return page('Echelon Beyond — soundtrack', MUSIC, body);
}

/* Case 05 — the repository the Kanban board drives, counted straight off disk. */
function repoPage(stats, root) {
  const subdirs = function (dir) {
    const node = stats.children[dir];
    return node ? Object.keys(node.children).sort().join(', ') : '';
  };

  let tree = '';
  for (const name of Object.keys(stats.children).sort()) {
    const s = stats.children[name];
    let sub = '';
    if (name === 'assets') {
      sub = 'art/{' + subdirs('art') + '} · audio/{' + subdirs('audio') + '} · lora/{' + subdirs('lora') + '} · references/{' + subdirs('references') + '}';
    } else if (name === 'tools') {
      sub = '{' + subdirs('tools') + '}';
    } else if (name === 'docs') {
      sub = '{' + subdirs('docs') + '} · 18-volume world guide';
    }
    tree += '      <div class="d mono"><span>' + name + '/</span><span class="n">' +
      s.files + ' files &middot; ' + mb(s.bytes) + '</span></div>\n';
    if (sub) { tree += '      <div class="sd mono">' + sub + '</div>\n'; }
  }

  const rootFiles = (stats.names || []).slice().sort();
  if (rootFiles.length) {
    tree += '      <div class="d mono"><span>root files</span><span class="n">' +
      rootFiles.join(' &middot; ') + '</span></div>\n';
  }

  const body = [
    '<p class="kicker mono">repository map · ' + root + ' · branch master</p>',
    '<h1>echelonbeyond/ — tactical roguelite about sailing the astral ocean</h1>',
    '<p class="sub">Godot 4 project, an 18-volume world guide, and the local AI pipelines that feed it: Fooocus for art, ACE-Step for music, kohya_ss for LoRA training. Every task is driven by a Cline Kanban board whose state lives outside the repository.</p>',
    '<div class="cols">',
    '  <div class="panel tree">',
    tree.trimEnd(),
    '  </div>',
    '  <div class="panel">',
    '    <p class="kicker mono">what lives here</p>',
    '    <ul class="facts">',
    '      <li>50-frame &laquo;Mereya Frescoes&raquo; LoRA dataset <span>&middot; 50 captions, 10 rejected frames kept together with the reason in rejected/batch1/_why.txt</span></li>',
    '      <li>141 main-menu candidates <span>&middot; 203 MB of sweeps, the final pick stays manual</span></li>',
    '      <li>Result contract <span>&middot; every task leaves deliveries/&lt;task&gt;/SUMMARY.md with the numbers, not with adjectives</span></li>',
    '      <li>Board state outside the repo <span>&middot; %USERPROFILE%\\.cline\\kanban\\workspaces\\echelonbeyond\\board.json</span></li>',
    '      <li>Delivery to phone and laptop <span>&middot; Taildrop plus a results page on port 8099</span></li>',
    '    </ul>',
    '  </div>',
    '</div>',
  ].join('\n');

  return page('echelonbeyond — repository map', REPO, body);
}

/* Case 08 — Lorien: the crystal structure as documented in the case text. */
function lorienPage() {
  const roles = [
    ['Наставник', 'Mentor'],
    ['Технический писатель', 'Technical writer'],
    ['Эмпатичный собеседник', 'Empathetic companion'],
    ['Со-творец', 'Co-creator'],
  ].map(function (r) {
    return '    <div class="role">\n' +
      '      <div class="rn">' + r[0] + '</div>\n' +
      '      <div class="re">' + r[1] + '</div>\n' +
      '      <div class="rc mono">код активации</div>\n' +
      '    </div>';
  }).join('\n');

  const body = [
    '<p class="kicker mono">prompt engineering · memory design · 6 versions</p>',
    '<h1>Lorien — a portable AI personality</h1>',
    '<p class="sub">Memory crystals: structured text blocks copied into a new chat. The assistant keeps its voice, its roles and its rules between sessions instead of being introduced again.</p>',
    '<div class="map">',
    '  <div class="core">',
    '    <p class="kicker mono">crystal of personality · core</p>',
    '    <div class="cname">&laquo;Тот, кто остаётся&raquo;</div>',
    '    <div class="cgloss">tone &middot; principles &middot; limits — the part that does not change with the task</div>',
    '  </div>',
    '  <div class="stem"></div>',
    '  <div class="roles">',
    roles,
    '  </div>',
    '  <p class="versions mono"><b>6 crystals:</b> 1.0 &middot; 2.0 &middot; 3.0 &middot; &laquo;Реальность&raquo; &middot; &laquo;Технический наставник&raquo; &middot; &laquo;Личность&raquo; — each role is called by a short activation phrase</p>',
    '</div>',
  ].join('\n');

  return page('Lorien — crystal structure', LORIEN, body);
}

module.exports = { musicPage: musicPage, repoPage: repoPage, lorienPage: lorienPage };


