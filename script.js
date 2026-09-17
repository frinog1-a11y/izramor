/* ==========================================================================
   Izramor — Midnight Atelier
   No frameworks, no third-party libraries.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fitCanvas(canvas, cssWidth, cssHeight) {
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  /* ------------------------------------------------------------------------
     1. Language switch (EN default, stored in localStorage)
     ---------------------------------------------------------------------- */

  var LANG_KEY = 'izramor-lang';
  var langButtons = $$('.ls-btn');

  function setLang(lang) {
    var value = (lang === 'ru') ? 'ru' : 'en';
    document.body.classList.toggle('lang-en', value === 'en');
    document.body.classList.toggle('lang-ru', value === 'ru');
    document.documentElement.setAttribute('lang', value);
    langButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === value);
    });
    try { localStorage.setItem(LANG_KEY, value); } catch (e) { /* storage disabled */ }
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: value } }));
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
  });

  var storedLang = 'en';
  try { storedLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { storedLang = 'en'; }
  setLang(storedLang);

  /* ------------------------------------------------------------------------
     2. Scroll progress bar
     ---------------------------------------------------------------------- */

  var progress = $('#scroll-progress');

  function updateProgress() {
    if (!progress) { return; }
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }

  var progressTicking = false;
  window.addEventListener('scroll', function () {
    if (progressTicking) { return; }
    progressTicking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      progressTicking = false;
    });
  }, { passive: true });
  updateProgress();

  /* ------------------------------------------------------------------------
     3. Reveal on scroll + section underline
     ---------------------------------------------------------------------- */

  var revealItems = $$('.reveal');
  var sections = $$('.sec');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); }
      });
    }, { threshold: 0.1 });

    sections.forEach(function (el) { sectionObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    sections.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ------------------------------------------------------------------------
     4. Hero counters
     ---------------------------------------------------------------------- */

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }

    var duration = 1200;
    var start = null;

    function step(ts) {
      if (start === null) { start = ts; }
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) { window.requestAnimationFrame(step); }
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$('.stat-num');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute('data-count') || '0') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ------------------------------------------------------------------------
     5. Side navigation active state
     ---------------------------------------------------------------------- */

  var navLinks = $$('#side-nav a');
  var navByTarget = {};
  navLinks.forEach(function (a) { navByTarget[a.getAttribute('data-target')] = a; });

  if ('IntersectionObserver' in window && navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        if (navByTarget[id]) { navByTarget[id].classList.add('is-active'); }
      });
    }, { threshold: 0.35 });

    ['hero', 'about', 'atlas', 'services', 'pricing', 'cases', 'process', 'contact'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) { navObserver.observe(sec); }
    });
  }

  /* ------------------------------------------------------------------------
     6. Dust motes in the hero light
     ---------------------------------------------------------------------- */

  var dustCanvas = $('#dust-canvas');
  var dustCtx = null;
  var dust = [];
  var dustW = 0;
  var dustH = 0;

  function dustCount() {
    return (window.innerWidth < 768) ? 20 : 36;
  }

  function makeMote(reset) {
    return {
      x: Math.random() * dustW,
      y: reset ? dustH + Math.random() * 40 : Math.random() * dustH,
      r: 0.5 + Math.random() * 1.2,
      vy: 0.08 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.12,
      a: 0.15 + Math.random() * 0.15
    };
  }

  function sizeDust() {
    if (!dustCanvas) { return; }
    var rect = dustCanvas.getBoundingClientRect();
    dustW = rect.width;
    dustH = rect.height;
    dustCtx = fitCanvas(dustCanvas, dustW, dustH);
    var n = dustCount();
    dust = [];
    for (var i = 0; i < n; i++) { dust.push(makeMote(false)); }
  }

  function drawDust() {
    if (!dustCtx) { return; }
    dustCtx.clearRect(0, 0, dustW, dustH);
    dustCtx.fillStyle = 'rgba(212,165,90,1)';
    for (var i = 0; i < dust.length; i++) {
      var m = dust[i];
      dustCtx.globalAlpha = m.a;
      dustCtx.beginPath();
      dustCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      dustCtx.fill();
    }
    dustCtx.globalAlpha = 1;
  }

  function stepDust() {
    for (var i = 0; i < dust.length; i++) {
      var m = dust[i];
      m.y -= m.vy;
      m.x += m.vx;
      if (m.y < -10) {
        var fresh = makeMote(true);
        m.x = fresh.x; m.y = fresh.y; m.r = fresh.r; m.vy = fresh.vy; m.vx = fresh.vx; m.a = fresh.a;
      }
    }
    drawDust();
  }

  var dustRaf = 0;
  var dustRunning = false;

  function dustLoop() {
    stepDust();
    dustRaf = window.requestAnimationFrame(dustLoop);
  }

  function dustStart() {
    if (!dustCanvas || dustRunning || reduceMotion) { return; }
    dustRunning = true;
    dustLoop();
  }

  function dustStop() {
    dustRunning = false;
    if (dustRaf) { window.cancelAnimationFrame(dustRaf); dustRaf = 0; }
  }

  if (dustCanvas && !reduceMotion) {
    sizeDust();
    dustStart();
    window.addEventListener('resize', function () { sizeDust(); drawDust(); });
  }

  /* ------------------------------------------------------------------------
     7. Custom cursor (desktop only)
     ---------------------------------------------------------------------- */

  if (finePointer) {
    var ring = $('#cursor-ring');
    var pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var ringSize = 8;
    var entered = false;

    document.body.classList.add('cursor-hidden');

    function placeRing() {
      if (!ring) { return; }
      ring.style.transform = 'translate(' + (pointer.x - ringSize / 2) + 'px,' + (pointer.y - ringSize / 2) + 'px)';
    }

    function setRingHover(on) {
      if (!ring) { return; }
      ring.classList.toggle('is-hover', on);
      ringSize = on ? 32 : 8;
      placeRing();
    }

    window.addEventListener('mousemove', function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!entered) {
        entered = true;
        if (ring) { ring.style.opacity = '1'; }
      }
      placeRing();
    }, { passive: true });

    var interactive = 'a, button, .card, .tag, .price-row, .contact-val';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(interactive)) { setRingHover(true); }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(interactive)) { setRingHover(false); }
    });
  }

  /* ------------------------------------------------------------------------
     8. Case preview following the cursor (desktop only)
     ---------------------------------------------------------------------- */

  function currentLang() {
    return document.body.classList.contains('lang-ru') ? 'ru' : 'en';
  }

  function visibleText(el) {
    if (!el) { return ''; }
    var node = el.querySelector('[lang="' + currentLang() + '"]');
    var raw = node ? node.textContent : el.textContent;
    return raw.replace(/\s+/g, ' ').trim();
  }

  var preview = $('#case-preview');
  var caseCards = $$('.case-card');

  if (preview && caseCards.length && finePointer) {
    var previewPos = { x: 0, y: 0 };
    var previewVisible = false;
    var previewCard = null;

    function fillPreview(card) {
      var title = visibleText(card.querySelector('h3'));
      var line = visibleText(card.querySelector('p'));
      var tags = $$('.tag', card).map(function (t) { return t.textContent.trim(); }).join(' · ');
      $('.cp-title', preview).textContent = title;
      $('.cp-line', preview).textContent = line.length > 160 ? line.slice(0, 157) + '…' : line;
      $('.cp-tags', preview).textContent = tags;
    }

    function placePreview(x, y) {
      var w = preview.offsetWidth || 300;
      var h = preview.offsetHeight || 260;
      var left = x + 24;
      var top = y + 18;
      if (left + w > window.innerWidth - 12) { left = x - w - 24; }
      if (top + h > window.innerHeight - 12) { top = window.innerHeight - h - 12; }
      if (top < 12) { top = 12; }
      preview.style.transform = 'translate(' + left + 'px,' + top + 'px)';
    }

    window.addEventListener('mousemove', function (e) {
      previewPos.x = e.clientX;
      previewPos.y = e.clientY;
      if (previewVisible) { placePreview(previewPos.x, previewPos.y); }
    }, { passive: true });

    caseCards.forEach(function (card) {
      card.addEventListener('mouseenter', function (e) {
        previewCard = card;
        fillPreview(card);
        preview.classList.add('is-on');
        previewVisible = true;
        placePreview(e.clientX, e.clientY);
      });
      card.addEventListener('mouseleave', function () {
        preview.classList.remove('is-on');
        previewVisible = false;
        previewCard = null;
      });
    });

    document.addEventListener('langchange', function () {
      if (previewCard) { fillPreview(previewCard); }
    });
  }

  /* ------------------------------------------------------------------------
     9. Atlas — map of work (canvas force-directed graph)
     ---------------------------------------------------------------------- */

  var ATLAS_NODES = [
    // dev cases — amber
    { id: 'dev01', label: 'Baby Monitor', group: 'dev', href: 'cases/dev/01-videokamera.en.md' },
    { id: 'dev02', label: 'Between the Lines', group: 'dev', href: 'cases/dev/02-normcontrol-kb.en.md' },
    { id: 'dev03', label: 'Through the Ripple', group: 'dev', href: 'cases/dev/03-echelon-mini-game.en.md' },
    { id: 'dev04', label: 'Echelon Beyond', group: 'dev', href: 'cases/dev/04-echelon-beyond.en.md' },
    { id: 'dev05', label: 'Art & Music Pipeline', group: 'dev', href: 'cases/dev/05-cline-art-music.en.md' },
    { id: 'dev06', label: 'Print Layout', group: 'dev', href: 'cases/dev/06-txt-to-docx.en.md' },
    { id: 'dev07', label: 'Remote Pipeline', group: 'dev', href: 'cases/dev/07-echelon-remote-pipeline.en.md' },
    // creative cases — lavender
    { id: 'cr01', label: 'Lorien', group: 'creative', href: 'cases/creative/01-lorien.en.md' },
    { id: 'cr02', label: 'Curse of Discord', group: 'creative', href: 'cases/creative/02-dnd-module.en.md' },
    { id: 'cr03', label: 'Tavern Tales', group: 'creative', href: 'cases/creative/03-tavern-tales.en.md' },
    { id: 'cr04', label: 'Prompt Engineering', group: 'creative', href: 'cases/creative/04-prompt-engineering.en.md' },
    { id: 'cr06', label: 'D&D Adaptation', group: 'creative', href: 'cases/creative/06-dnd-adaptation.en.md' },
    // skills — rose
    { id: 'sk-ai', label: 'AI Orchestration', group: 'skill', href: 'skills/ai-orchestration.en.md' },
    { id: 'sk-cline', label: 'Cline Tool Orchestrator', group: 'skill', href: 'skills/cline-as-tool-orchestrator.en.md' },
    { id: 'sk-auto', label: 'Automation', group: 'skill', href: 'skills/automation.en.md' },
    { id: 'sk-full', label: 'Fullstack Local', group: 'skill', href: 'skills/fullstack-local.en.md' },
    { id: 'sk-content', label: 'Content Pipeline', group: 'skill', href: 'skills/content-pipeline.en.md' },
    { id: 'sk-visual', label: 'Visual Style', group: 'skill', href: 'skills/visual-style.en.md' },
    { id: 'sk-gpu', label: 'Local AI GPU', group: 'skill', href: 'skills/local-ai-gpu.en.md' },
    { id: 'sk-remote', label: 'Remote Access', group: 'skill', href: 'skills/remote-access.en.md' },
    { id: 'sk-prompt', label: 'Prompt Engineering', group: 'skill', href: 'skills/prompt-engineering.en.md' },
    { id: 'sk-narr', label: 'Narrative Design', group: 'skill', href: 'skills/narrative-design.en.md' },
    { id: 'sk-game', label: 'Game Design', group: 'skill', href: 'skills/game-design.en.md' }
  ];

  var ATLAS_EDGES = [
    ['dev01', 'sk-full'], ['dev01', 'sk-auto'], ['dev01', 'sk-remote'],
    ['dev02', 'sk-content'], ['dev02', 'sk-prompt'], ['dev02', 'sk-auto'],
    ['dev03', 'sk-game'], ['dev03', 'sk-narr'],
    ['dev04', 'sk-ai'], ['dev04', 'sk-game'], ['dev04', 'sk-narr'], ['dev04', 'sk-remote'],
    ['dev05', 'sk-visual'], ['dev05', 'sk-gpu'], ['dev05', 'sk-cline'],
    ['dev06', 'sk-auto'], ['dev06', 'sk-content'],
    ['dev07', 'sk-remote'], ['dev07', 'sk-auto'], ['dev07', 'sk-ai'], ['dev07', 'sk-gpu'],
    ['cr01', 'sk-prompt'], ['cr01', 'sk-narr'], ['cr01', 'sk-ai'],
    ['cr02', 'sk-narr'], ['cr02', 'sk-game'], ['cr02', 'sk-prompt'],
    ['cr03', 'sk-game'], ['cr03', 'sk-narr'],
    ['cr04', 'sk-prompt'], ['cr04', 'sk-narr'], ['cr04', 'sk-ai'],
    ['cr06', 'sk-game'], ['cr06', 'sk-narr'], ['cr06', 'sk-prompt'],
    ['dev03', 'cr02'], ['dev03', 'cr03'],
    ['dev04', 'cr01'], ['dev04', 'cr06'],
    ['cr01', 'cr04'], ['cr02', 'cr03'], ['cr02', 'cr06']
  ];

  var NODE_COLORS = { dev: '#d4a55a', creative: '#8a7ab8', skill: '#b86a8a' };

  var atlasCanvas = $('#atlas-canvas');
  var atlasTooltip = $('#atlas-tooltip');
  var atlasHolder = atlasCanvas ? atlasCanvas.parentNode : null;

  if (atlasCanvas) {
    var atlasCtx = null;
    var atlasW = 0;
    var atlasH = 0;
    var atlasNodes = [];
    var atlasNodeById = {};
    var atlasEdges = [];
    var atlasRaf = 0;
    var atlasRunning = false;
    var atlasHover = null;
    var atlasTime = 0;

    ATLAS_NODES.forEach(function (n, i) {
      var node = {
        id: n.id, label: n.label, group: n.group, href: n.href,
        x: (i % 2 === 0) ? 0.35 : 0.65, y: 0.2 + (i / ATLAS_NODES.length) * 0.7,
        vx: 0, vy: 0, degree: 0, phase: Math.random() * Math.PI * 2, radius: 4
      };
      atlasNodes.push(node);
      atlasNodeById[node.id] = node;
    });

    ATLAS_EDGES.forEach(function (pair) {
      var a = atlasNodeById[pair[0]];
      var b = atlasNodeById[pair[1]];
      if (!a || !b) { return; }
      a.degree++; b.degree++;
      atlasEdges.push({ a: a, b: b, kind: pair[0].slice(0, 2) === pair[1].slice(0, 2) ? 'case' : 'skill' });
    });

    atlasEdges.forEach(function (e) {
      if (e.a.group === 'skill' && e.b.group === 'skill') { e.kind = 'skill'; }
      else if (e.a.group === 'skill' || e.b.group === 'skill') { e.kind = 'skill'; }
      else { e.kind = 'case'; }
    });

    atlasNodes.forEach(function (n) { n.radius = 4 + Math.min(4, n.degree * 0.9); });

    var atlasAdj = {};
    atlasNodes.forEach(function (n) { atlasAdj[n.id] = {}; });
    atlasEdges.forEach(function (e) { atlasAdj[e.a.id][e.b.id] = true; atlasAdj[e.b.id][e.a.id] = true; });

    function atlasSize() {
      var rect = atlasCanvas.getBoundingClientRect();
      atlasW = rect.width;
      atlasH = rect.height;
      atlasCtx = fitCanvas(atlasCanvas, atlasW, atlasH);
    }

    function atlasSeed() {
      var cx = atlasW / 2;
      var cy = atlasH / 2;
      var ring = Math.min(atlasW, atlasH) * 0.28;
      atlasNodes.forEach(function (n, i) {
        var ang = (i / atlasNodes.length) * Math.PI * 2;
        n.x = cx + Math.cos(ang) * ring * (0.7 + Math.random() * 0.5);
        n.y = cy + Math.sin(ang) * ring * (0.7 + Math.random() * 0.5);
        n.vx = 0;
        n.vy = 0;
      });
    }

    function atlasStep(alpha) {
      var i, j;
      for (i = 0; i < atlasNodes.length; i++) {
        var a = atlasNodes[i];
        for (j = i + 1; j < atlasNodes.length; j++) {
          var b = atlasNodes[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 1) { d2 = 1; }
          var d = Math.sqrt(d2);
          var force = (2600 / d2) * alpha;
          var fx = (dx / d) * force;
          var fy = (dy / d) * force;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }

      var restLength = Math.max(68, Math.min(126, Math.min(atlasW, atlasH) / 5));
      atlasEdges.forEach(function (e) {
        var dx = e.b.x - e.a.x;
        var dy = e.b.y - e.a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var diff = (d - restLength) * 0.02 * alpha;
        var fx = (dx / d) * diff;
        var fy = (dy / d) * diff;
        e.a.vx += fx; e.a.vy += fy;
        e.b.vx -= fx; e.b.vy -= fy;
      });

      var cx = atlasW / 2;
      var cy = atlasH / 2;
      var pad = 34;
      atlasNodes.forEach(function (n) {
        n.vx += (cx - n.x) * 0.0016 * alpha;
        n.vy += (cy - n.y) * 0.0016 * alpha;
        n.vx *= 0.9;
        n.vy *= 0.9;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < pad) { n.x = pad; n.vx *= -0.4; }
        if (n.x > atlasW - pad) { n.x = atlasW - pad; n.vx *= -0.4; }
        if (n.y < pad) { n.y = pad; n.vy *= -0.4; }
        if (n.y > atlasH - pad) { n.y = atlasH - pad; n.vy *= -0.4; }
      });
    }

    function atlasCenterGraph() {
      if (!atlasNodes.length) { return; }
      var minX = Infinity;
      var minY = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;
      atlasNodes.forEach(function (n) {
        if (n.x < minX) { minX = n.x; }
        if (n.x > maxX) { maxX = n.x; }
        if (n.y < minY) { minY = n.y; }
        if (n.y > maxY) { maxY = n.y; }
      });
      var dx = atlasW / 2 - (minX + maxX) / 2;
      var dy = atlasH / 2 - (minY + maxY) / 2;
      atlasNodes.forEach(function (n) { n.x += dx; n.y += dy; });
    }

    function atlasLayout() {
      for (var i = 0; i < 200; i++) { atlasStep(1); }
      atlasCenterGraph();
    }

    function isNeighbour(a, b) {
      return !!(atlasAdj[a.id] && atlasAdj[a.id][b.id]);
    }

    function atlasDraw() {
      if (!atlasCtx) { return; }
      atlasCtx.clearRect(0, 0, atlasW, atlasH);

      atlasEdges.forEach(function (e) {
        var dim = atlasHover && atlasHover !== e.a && atlasHover !== e.b;
        var base = (e.kind === 'skill') ? 0.15 : 0.07;
        atlasCtx.strokeStyle = 'rgba(242,238,248,' + (dim ? 0.03 : base) + ')';
        atlasCtx.lineWidth = 1;
        atlasCtx.beginPath();
        atlasCtx.moveTo(e.a.x, e.a.y);
        atlasCtx.lineTo(e.b.x, e.b.y);
        atlasCtx.stroke();
      });

      atlasNodes.forEach(function (n) {
        var dim = atlasHover && atlasHover !== n && !isNeighbour(atlasHover, n);
        var pulse = reduceMotion ? 0 : 0.05 * Math.sin(atlasTime * 0.0016 + n.phase);
        var r = n.radius * (1 + pulse);
        atlasCtx.globalAlpha = dim ? 0.2 : 1;
        atlasCtx.fillStyle = NODE_COLORS[n.group] || '#f2eef8';
        atlasCtx.beginPath();
        atlasCtx.arc(n.x, n.y, r, 0, Math.PI * 2);
        atlasCtx.fill();

        if (atlasHover === n) {
          atlasCtx.globalAlpha = 1;
          atlasCtx.strokeStyle = 'rgba(242,238,248,0.55)';
          atlasCtx.lineWidth = 1;
          atlasCtx.beginPath();
          atlasCtx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
          atlasCtx.stroke();
        }
        atlasCtx.globalAlpha = 1;
      });
    }

    function atlasNodeAt(x, y) {
      var best = null;
      var bestD = 15 * 15;
      atlasNodes.forEach(function (n) {
        var dx = n.x - x;
        var dy = n.y - y;
        var d2 = dx * dx + dy * dy;
        if (d2 < bestD) { bestD = d2; best = n; }
      });
      return best;
    }

    function atlasTooltipShow(node, x, y) {
      if (!atlasTooltip) { return; }
      atlasTooltip.innerHTML = '';
      var name = document.createElement('span');
      name.textContent = node.label;
      var group = document.createElement('span');
      group.className = 'tt-group';
      group.textContent = node.group;
      atlasTooltip.appendChild(name);
      atlasTooltip.appendChild(group);
      atlasTooltip.classList.add('is-on');
      var tw = atlasTooltip.offsetWidth;
      var th = atlasTooltip.offsetHeight;
      var offX = atlasCanvas.offsetLeft;
      var offY = atlasCanvas.offsetTop;
      var left = x + 14 + offX;
      var top = y + 14 + offY;
      if (x + 14 + tw > atlasW - 8) { left = x - tw - 14 + offX; }
      if (y + 14 + th > atlasH - 8) { top = y - th - 14 + offY; }
      if (left < offX + 8) { left = offX + 8; }
      if (top < offY + 8) { top = offY + 8; }
      atlasTooltip.style.left = left + 'px';
      atlasTooltip.style.top = top + 'px';
    }

    function atlasTooltipHide() {
      if (atlasTooltip) { atlasTooltip.classList.remove('is-on'); }
    }

    function atlasLocal(e) {
      var rect = atlasCanvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function atlasOpen(node) {
      if (!node || !node.href) { return; }
      var lang = currentLang();
      window.location.href = node.href.replace(/\.(en|ru)\.md$/, '.' + lang + '.md');
    }

    var touchNode = null;

    atlasCanvas.addEventListener('mousemove', function (e) {
      var p = atlasLocal(e);
      var node = atlasNodeAt(p.x, p.y);
      if (node !== atlasHover) {
        atlasHover = node;
        atlasCanvas.classList.toggle('is-pointing', !!node);
        if (node) { atlasTooltipShow(node, p.x, p.y); } else { atlasTooltipHide(); }
      } else if (node) {
        atlasTooltipShow(node, p.x, p.y);
      }
    });

    atlasCanvas.addEventListener('mouseleave', function () {
      atlasHover = null;
      atlasCanvas.classList.remove('is-pointing');
      atlasTooltipHide();
    });

    atlasCanvas.addEventListener('click', function (e) {
      var p = atlasLocal(e);
      var node = atlasNodeAt(p.x, p.y);
      if (node) { atlasOpen(node); }
    });

    atlasCanvas.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (!t) { return; }
      var rect = atlasCanvas.getBoundingClientRect();
      var p = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      var node = atlasNodeAt(p.x, p.y);
      if (!node) { atlasHover = null; atlasTooltipHide(); return; }
      if (touchNode === node) { atlasOpen(node); return; }
      touchNode = node;
      atlasHover = node;
      atlasTooltipShow(node, p.x, p.y);
    }, { passive: true });

    var atlasResizeTimer = 0;
    window.addEventListener('resize', function () {
      if (atlasResizeTimer) { window.clearTimeout(atlasResizeTimer); }
      atlasResizeTimer = window.setTimeout(function () {
        atlasSize();
        atlasSeed();
        atlasLayout();
        atlasDraw();
      }, 180);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        atlasStop();
        dustStop();
      } else {
        atlasStart();
        dustStart();
      }
    });

    function atlasLoop(ts) {
      atlasTime = ts || 0;
      atlasStep(reduceMotion ? 0.35 : 0.02);
      atlasDraw();
      atlasRaf = window.requestAnimationFrame(atlasLoop);
    }

    function atlasStart() {
      if (atlasRunning || reduceMotion || !atlasCtx) { return; }
      atlasRunning = true;
      atlasRaf = window.requestAnimationFrame(atlasLoop);
    }

    function atlasStop() {
      atlasRunning = false;
      if (atlasRaf) { window.cancelAnimationFrame(atlasRaf); atlasRaf = 0; }
    }

    atlasSize();
    atlasSeed();
    atlasLayout();
    atlasDraw();

    if (reduceMotion) {
      atlasDraw();
    } else {
      atlasStart();
    }
  }






})();
