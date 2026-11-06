/* bruno trevisan · portfolio
   The hero and the five formats in section 01 are drawn by the same function: scene(w, h).
   Same rules, any size. One decision on top. */
(() => {
  'use strict';
  window.__bt = true;

  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const r2 = v => Math.round(v * 100) / 100;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ------------------------------------------------------------------
     the system. section 01 prints this exact object. */
  const RULES = {
    grid: '1 bar every sqrt(area)/6',
    horizon: '66% of height',
    margin: '8% of short side',
    column: 'starts after a bar',
    title: 'outfit 300, sqrt(area)*.12',
    comment: 'plex mono, starts with //',
    avatar: 'first letter only',
    color: ['#050505', '#fff'],
  };
  const DECISION = { bar: 'last', tilt: 8 };

  function layout(W, H) {
    const area = Math.sqrt(W * H);
    const s = area / 6;                               // grid
    const n = Math.max(3, Math.floor(W / s));
    const off = (W - (n - 1) * s) / 2;
    const xs = Array.from({ length: n }, (_, i) => off + i * s);
    return { W, H, area, s, n, xs, hz: H * 0.66, m: Math.min(W, H) * 0.08 }; // horizon, margin
  }

  // column: which bar the text starts after
  function columnBar(L, kind) {
    const { xs, W, H } = L;
    let min = 0;
    if (kind === 'hero') min = W < 700 ? 0 : W * 0.18;
    else if (W / H >= 1.8) min = W * 0.28;
    const i = xs.findIndex(x => x >= min);
    return i < 0 ? 0 : i;
  }

  // the light is never perfectly straight: a soft, vector wobble ("rústico organizado")
  function wobble(x, hz, w, s, seed) {
    const A = s * 0.0045;
    const f1 = (Math.PI * 2) / (s * 2.6), f2 = (Math.PI * 2) / (s * 0.9);
    const p1 = (seed * 12.9898) % 6.283, p2 = (seed * 78.233) % 6.283;
    const step = Math.max(6, hz / 60);
    const L = [], R = [];
    for (let y = 0; y <= hz + 0.01; y += step) {
      const o = A * (0.65 * Math.sin(y * f1 + p1) + 0.35 * Math.sin(y * f2 + p2));
      const ww = w * (0.85 + 0.3 * (0.5 + 0.5 * Math.sin(y * f2 * 0.7 + p1)));
      L.push(`${r2(x + o - ww / 2)} ${r2(y)}`);
      R.push(`${r2(x + o + ww / 2)} ${r2(y)}`);
    }
    return 'M' + L.join('L') + 'L' + R.reverse().join('L') + 'Z';
  }

  let uid = 0;
  function scene(W, H) {
    const L = layout(W, H);
    const { s, xs, hz } = L;
    const id = 'sc' + (++uid);
    const gw = r2(s * 0.046), cw = r2(s * 0.023);
    const last = xs.length - 1;
    let up = '', down = '';
    xs.forEach((x, i) => {
      const cls = i === last ? ' bar--last' : '';
      up += `<g class="bar${cls}" data-i="${i}" style="--i:${i}"><g class="up">` +
        `<rect x="${r2(x - gw / 2)}" y="0" width="${gw}" height="${r2(hz)}" fill="url(#${id}b)" filter="url(#${id}g)" opacity=".55"/>` +
        `<path d="${wobble(x, hz, cw, s, i * 7.31 + W * 0.013)}" fill="url(#${id}b)"/>` +
        `</g></g>`;
      down += `<g class="rbar${cls}" data-i="${i}" style="--i:${i}"><g class="down">` +
        `<rect x="${r2(x - cw / 2)}" y="${r2(hz)}" width="${cw}" height="${r2(H - hz)}" fill="url(#${id}f)" filter="url(#${id}s)"/>` +
        `</g></g>`;
    });
    const sx = W / 1584, sy = Math.min(H / 396, sx * 3);
    const markup =
      '<defs>' +
      `<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050505"/><stop offset="1" stop-color="#141414"/></linearGradient>` +
      `<linearGradient id="${id}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1b1b"/><stop offset=".5" stop-color="#0a0a0a"/><stop offset="1" stop-color="#040404"/></linearGradient>` +
      `<linearGradient id="${id}b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${r2(hz)}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset=".7" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".7"/></linearGradient>` +
      `<linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="${r2(hz)}" x2="0" y2="${H}"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<radialGradient id="${id}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
      `<filter id="${id}g" x="-500%" y="-5%" width="1100%" height="110%"><feGaussianBlur stdDeviation="${r2(s * 0.053)}"/></filter>` +
      `<filter id="${id}s" x="-500%" y="0" width="1100%" height="100%"><feGaussianBlur stdDeviation="${r2(s * 0.011)}"/></filter>` +
      `<filter id="${id}mb" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${r2(s * 0.1)}"/></filter>` +
      `<filter id="${id}w" x="-2%" y="-60%" width="104%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter>` +
      `<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><rect class="clear" x="0" y="0" width="0" height="0" rx="${r2(s * 0.2)}" fill="#000" filter="url(#${id}mb)"/></mask>` +
      '</defs>' +
      `<rect width="${W}" height="${r2(hz)}" fill="url(#${id}sky)"/>` +
      `<rect y="${r2(hz)}" width="${W}" height="${r2(H - hz)}" fill="url(#${id}fl)"/>` +
      `<ellipse cx="${W / 2}" cy="${r2(hz)}" rx="${r2(W * 0.48)}" ry="${r2(H * 0.18)}" fill="url(#${id}h)"/>` +
      `<g mask="url(#${id}m)">${up}</g>` +
      `<g>${down}</g>` +
      `<g fill="none" stroke="#fff" stroke-linecap="round" filter="url(#${id}w)" transform="translate(0 ${r2(hz)}) scale(${r2(sx)} ${r2(sy)}) translate(0 -262)">` +
      '<path d="M0 268 C 220 236, 420 254, 640 266 S 1020 240, 1250 260 S 1500 248, 1584 264" stroke-opacity=".14" stroke-width="1.6" vector-effect="non-scaling-stroke"/>' +
      '<path d="M0 284 C 260 264, 520 278, 760 270 S 1160 258, 1584 276" stroke-opacity=".09" stroke-width="1.6" vector-effect="non-scaling-stroke"/>' +
      '</g>' +
      `<rect y="${r2(hz)}" width="${W}" height="${r2(Math.max(1, H * 0.0025))}" fill="#fff" fill-opacity=".14"/>`;
    return { L, markup };
  }

  function setClear(svg, x, y, w, h) {
    const c = svg.querySelector('.clear');
    if (!c) return;
    c.setAttribute('x', r2(x));
    c.setAttribute('y', r2(y));
    c.setAttribute('width', r2(Math.max(0, w)));
    c.setAttribute('height', r2(Math.max(0, h)));
  }

  /* the decision, as motion: a damped spring on the last bar */
  const active = new Set();
  let raf = 0, tPrev = 0;
  function tick(now) {
    const dt = Math.min(0.033, (now - tPrev) / 1000);
    tPrev = now;
    for (const l of active) if (!l.step(dt)) { l.a = l.t; l.v = 0; l.apply(); active.delete(l); }
    raf = active.size ? requestAnimationFrame(tick) : 0;
  }
  class Lean {
    constructor(svg, L) {
      const i = L.n - 1;
      this.up = svg.querySelector(`.bar[data-i="${i}"] .up`);
      this.down = svg.querySelector(`.rbar[data-i="${i}"] .down`);
      this.x = r2(L.xs[i]);
      this.hz = r2(L.hz);
      this.a = 0; this.v = 0; this.t = 0;
    }
    to(t, instant) {
      this.t = t;
      if (instant || RM) { this.a = t; this.v = 0; this.apply(); active.delete(this); return; }
      active.add(this);
      if (!raf) { tPrev = performance.now(); raf = requestAnimationFrame(tick); }
    }
    step(dt) {
      this.v += (170 * (this.t - this.a) - 14 * this.v) * dt;
      this.a += this.v * dt;
      this.apply();
      return Math.abs(this.t - this.a) > 0.01 || Math.abs(this.v) > 0.01;
    }
    apply() {
      const a = this.a.toFixed(3);
      if (this.up) this.up.setAttribute('transform', `rotate(${a} ${this.x} ${this.hz})`);
      if (this.down) this.down.setAttribute('transform', `rotate(${-a} ${this.x} ${this.hz})`);
    }
  }

  /* text metrics */
  const ctx = document.createElement('canvas').getContext('2d');
  function sansEm(t) { // width in em of Outfit 300 with -0.02em tracking
    ctx.font = '300 100px Outfit, sans-serif';
    return ctx.measureText(t).width / 100 - 0.02 * t.length;
  }
  const MONO = 0.6; // Plex Mono advance, in em

  /* ------------------------------------------------------------------
     00 · hero */
  const hero = $('.hero');
  const heroSvg = $('.scene', hero);
  const typed = $('.typed', hero);
  let heroL = null, heroLean = null, heroTarget = 0, heroSize = { W: 0, H: 0 }, introDone = false, heroVisible = true;

  function buildHero(force) {
    const b = hero.getBoundingClientRect();
    const W = Math.round(b.width), H = Math.round(b.height);
    if (!force && W === heroSize.W && Math.abs(H - heroSize.H) < 90) return;
    heroSize = { W, H };
    const sc = scene(W, H);
    heroL = sc.L;
    heroSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    heroSvg.innerHTML = sc.markup;

    const { xs, s, hz } = heroL;
    const tx = xs[columnBar(heroL, 'hero')] + s * 0.14;
    const lastX = xs[xs.length - 1];
    const wide = W >= 700;
    const longest = wide ? sansEm('personality is a decision.') : Math.max(sansEm('personality is'), sansEm('a decision.'));
    const ts = clamp((lastX - tx - s * 0.5) / longest, 34, 132); // the phrase never covers the decision
    hero.style.setProperty('--tx', r2(tx) + 'px');
    hero.style.setProperty('--hz', r2(hz) + 'px');
    hero.style.setProperty('--ts', r2(ts) + 'px');
    hero.style.setProperty('--bx', r2(lastX) + 'px');

    // clear the bars behind the phrase, the same mask the formats use
    const c = $('.h-comment', hero).getBoundingClientRect();
    const m = $('.h-main', hero).getBoundingClientRect();
    const cs = parseFloat(getComputedStyle($('.h-comment', hero)).fontSize);
    const w = Math.max(longest * ts, MONO * cs * 27 + ts * 0.1);
    const pad = s * 0.12;
    setClear(heroSvg, m.left - b.left - pad, c.top - b.top - pad, w + pad * 2, m.bottom - c.top + pad * 2);

    heroLean = new Lean(heroSvg, heroL);
    heroLean.to(heroTarget, true);
  }

  function typeComment(done) {
    const text = typed.dataset.text;
    typed.textContent = '';
    root.classList.add('typing');
    let i = 0;
    const step = () => {
      i += 1;
      typed.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, 24 + Math.random() * 26);
      else setTimeout(done, 260);
    };
    setTimeout(step, 80);
  }

  function intro() {
    if (RM) {
      typed.textContent = typed.dataset.text;
      root.classList.add('lit', 'shown', 'ready');
      heroTarget = DECISION.tilt;
      heroLean.to(heroTarget, true);
      introDone = true;
      return;
    }
    typed.textContent = '';
    root.classList.add('lit');                       // the system switches on, bar by bar
    setTimeout(() => typeComment(() => {
      root.classList.remove('typing');
      root.classList.add('shown');                   // personality is a decision.
      setTimeout(() => {                             // and then it is made
        heroTarget = DECISION.tilt;
        heroLean.to(heroTarget);
        setTimeout(() => { introDone = true; }, 700);
      }, 650);
      setTimeout(() => root.classList.add('ready'), 1600);
    }), 900);
  }

  if (HOVER) {
    hero.addEventListener('pointermove', e => {
      if (!introDone || !heroLean) return;
      const b = hero.getBoundingClientRect();
      const dx = (e.clientX - b.left - heroLean.x) / b.width;
      heroLean.to(DECISION.tilt + clamp(dx * 20, -6, 4)); // it pays attention
    });
    hero.addEventListener('pointerleave', () => { if (introDone) heroLean.to(DECISION.tilt); });
  }

  function flickLoop() {
    if (RM) return;
    setTimeout(() => {
      if (introDone && heroVisible && document.visibilityState === 'visible' && heroL) {
        const i = Math.floor(Math.random() * (heroL.n - 1));
        const els = $$(`[data-i="${i}"]`, heroSvg);
        els.forEach(el => el.classList.add('flick'));
        setTimeout(() => els.forEach(el => el.classList.remove('flick')), 650);
      }
      flickLoop();
    }, 4200 + Math.random() * 5200);
  }

  /* ------------------------------------------------------------------
     01 · the system, live */
  const FORMATS = [
    { key: 'story', label: 'story 1080×1920', W: 1080, H: 1920 },
    { key: 'feed', label: 'feed 1080×1350', W: 1080, H: 1350 },
    { key: 'ad', label: 'ad 1200×628', W: 1200, H: 628 },
    { key: 'avatar', label: 'avatar 400×400', W: 400, H: 400 },
    { key: 'banner', label: 'banner 1584×396', W: 1584, H: 396 },
  ];
  const sheet = $('#sheet');
  const inBrand = $('#in-brand');
  const inLine = $('#in-line');
  const stats = $('#stats');
  const sw = $('#decision');
  let decided = false, touched = false;

  function figure(f) {
    const sc = scene(f.W, f.H);
    const el = document.createElement('figure');
    el.className = 'fmt fmt--' + f.key;
    el.innerHTML =
      `<svg viewBox="0 0 ${f.W} ${f.H}" role="img" aria-label="${f.key} format, ${f.W} by ${f.H}">${sc.markup}` +
      '<g class="type">' +
      '<text class="tc" font-family="Plex Mono, monospace" fill="#fff"><tspan fill="#7a7a7a">//</tspan><tspan class="tcl"></tspan></text>' +
      '<text class="tt" font-family="Outfit, sans-serif" font-weight="300" fill="#fff" letter-spacing="-0.02em"></text>' +
      '</g></svg>' +
      `<figcaption>${f.label}</figcaption>`;
    f.L = sc.L;
    f.svg = el.querySelector('svg');
    f.tt = f.svg.querySelector('.tt');
    f.tc = f.svg.querySelector('.tc');
    f.tcl = f.svg.querySelector('.tcl');
    f.lean = new Lean(f.svg, f.L);
    return el;
  }

  function render(f, brand, line) {
    const { W, H, s, xs, hz, m, area } = f.L;
    const lastX = xs[xs.length - 1];
    if (f.key === 'avatar') {                        // avatar: first letter only
      const ch = brand.trim().charAt(0).toLowerCase() || 'y';
      const size = Math.min(W, H) * 0.52;
      const y = hz - m * 0.9;
      f.tt.textContent = ch;
      f.tt.setAttribute('font-size', r2(size));
      f.tt.setAttribute('text-anchor', 'middle');
      f.tt.setAttribute('x', r2(W / 2));
      f.tt.setAttribute('y', r2(y));
      f.tc.setAttribute('display', 'none');
      const w = sansEm(ch) * size;
      setClear(f.svg, W / 2 - w / 2 - s * 0.25, y - size * 0.8, w + s * 0.5, size * 0.9);
      return;
    }
    const tx = xs[columnBar(f.L, 'fmt')] + s * 0.14;  // column
    const maxW = lastX - tx - s * 0.5;
    const title = brand.toLowerCase() + '.';
    const ts = Math.min(area * 0.12, maxW / sansEm(title)); // title
    const tBase = hz - m * 1.5;
    const label = ' ' + line.toLowerCase();
    const cs = Math.min(area * 0.03, maxW / (MONO * (label.length + 2))); // comment
    const cBase = tBase - ts * 1.05;
    f.tt.textContent = title;
    f.tt.removeAttribute('text-anchor');
    f.tt.setAttribute('x', r2(tx));
    f.tt.setAttribute('y', r2(tBase));
    f.tt.setAttribute('font-size', r2(ts));
    f.tc.removeAttribute('display');
    f.tcl.textContent = label;
    f.tc.setAttribute('x', r2(tx + ts * 0.08));
    f.tc.setAttribute('y', r2(cBase));
    f.tc.setAttribute('font-size', r2(cs));
    const w = Math.max(sansEm(title) * ts, MONO * cs * (label.length + 2) + ts * 0.08);
    const pad = s * 0.12, top = cBase - cs * 0.9;
    setClear(f.svg, tx - pad, top - pad, w + pad * 2, tBase + ts * 0.25 - top + pad * 2);
  }

  function update() {
    const t0 = performance.now();
    const brand = (inBrand.value.trim() || 'your brand').slice(0, 22);
    const line = (inLine.value.trim() || 'your line').slice(0, 36);
    FORMATS.forEach(f => render(f, brand, line));
    const ms = performance.now() - t0;
    const d = decided ? 1 : 0;
    stats.textContent = `// ${FORMATS.length} formats, ${Object.keys(RULES).length} rules, ${ms.toFixed(1)} ms, ${d} decision${d ? '' : 's'}`;
  }

  function printRules() {
    const keys = Object.keys(RULES);
    const w = Math.max(...keys.map(k => k.length)) + 1;
    const P = t => `<span class="p">${t}</span>`;
    const S = t => `<span class="s">"${esc(t)}"</span>`;
    let out = `<span class="k">const</span> rules ${P('=')} ${P('{')}\n`;
    keys.forEach(k => {
      const v = RULES[k];
      const val = Array.isArray(v) ? P('[') + v.map(S).join(P(', ')) + P(']') : S(v);
      out += `  ${k}${P(':')}${' '.repeat(w - k.length)}${val}${P(',')}\n`;
    });
    out += `${P('};')}\n\n<span class="dline" id="dline"><span class="k">let</span> decision ${P('=')} <span id="dval"></span>${P(';')}</span>\n<span class="c">// one line. that’s the personality.</span>`;
    $('#rules-code').innerHTML = out;
  }

  function printDecision() {
    const P = t => `<span class="p">${t}</span>`;
    $('#dval').innerHTML = decided
      ? `${P('{')} bar${P(':')} <span class="s">"${DECISION.bar}"</span>${P(',')} tilt${P(':')} <span class="n">${DECISION.tilt}</span> ${P('}')}`
      : '<span class="n">null</span>';
    $('#dline').classList.toggle('on', decided);
  }

  function setDecision(on, byUser) {
    decided = on;
    if (byUser) touched = true;
    sw.setAttribute('aria-checked', String(on));
    FORMATS.forEach((f, i) => setTimeout(() => f.lean.to(on ? DECISION.tilt : 0), RM ? 0 : i * 70));
    printDecision();
    update();
  }

  /* ------------------------------------------------------------------
     02 · method spine */
  const stepsWrap = $('#steps');
  function measureSpine() {
    const lastStep = $('.step--last', stepsWrap);
    stepsWrap.style.setProperty('--run-h', r2(lastStep.offsetTop + 8) + 'px');
    stepsWrap.style.setProperty('--end-h', r2(Math.max(40, lastStep.offsetHeight - 10)) + 'px');
  }
  function spine() {
    if (RM) { stepsWrap.style.setProperty('--p', 1); stepsWrap.classList.add('decided'); return; }
    const r = stepsWrap.getBoundingClientRect();
    const runH = parseFloat(stepsWrap.style.getPropertyValue('--run-h')) || r.height * 0.7;
    const p = clamp((innerHeight * 0.72 - r.top) / runH, 0, 1);
    stepsWrap.style.setProperty('--p', p.toFixed(4));
    stepsWrap.classList.toggle('decided', p >= 0.999);
  }

  /* ------------------------------------------------------------------
     the closing strip: same function, one more size */
  const strip = $('#strip');
  let stripLean = null, stripW = 0, stripSeen = false;
  function buildStrip() {
    const b = strip.getBoundingClientRect();
    const W = Math.round(b.width), H = Math.round(b.height);
    if (!W || W === stripW) return;
    stripW = W;
    const sc = scene(W, H);
    const svg = $('svg', strip);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = sc.markup;
    stripLean = new Lean(svg, sc.L);
    stripLean.to(stripSeen || RM ? DECISION.tilt : 0, true);
  }

  /* ------------------------------------------------------------------
     header, scroll, resize */
  const bar = $('#top-bar');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      bar.classList.toggle('solid', scrollY > 40);
      spine();
    });
  }

  let rz = 0;
  function onResize() {
    clearTimeout(rz);
    rz = setTimeout(() => { buildHero(); buildStrip(); measureSpine(); spine(); }, 160);
  }

  /* ------------------------------------------------------------------
     05 · brief */
  function wireBrief() {
    const form = $('#brief-form');
    const st = $('#brief-status');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const what = $('#b-what').value.trim();
      const when = $('#b-when').value.trim();
      const budget = $('#b-budget').value.trim();
      if (!what) {
        st.textContent = '// add what you are making first. the other two can wait.';
        $('#b-what').focus();
        return;
      }
      const subject = 'Brief: ' + what.replace(/\s+/g, ' ').slice(0, 60);
      const body = `Hi Bruno,\n\nWhat we're making:\n${what}\n\nDeadline: ${when || 'open'}\nBudget (USD): ${budget || 'to discuss'}\n`;
      location.href = `mailto:brunotrevisrds@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      st.textContent = '// opening your email app. nothing opened? write to brunotrevisrds@gmail.com';
    });

    $$('.copy').forEach(btn => btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'copied';
      } catch (err) {
        const link = btn.parentElement.querySelector('a');
        const range = document.createRange();
        range.selectNodeContents(link);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = 'selected';
      }
      setTimeout(() => { btn.textContent = 'copy'; }, 1600);
    }));
  }

  /* ------------------------------------------------------------------
     boot */
  function init() {
    // the sheet: row (story, feed, column (ad, avatar)), then the banner
    const rowA = document.createElement('div');
    rowA.className = 'srow srow--a';
    const col = document.createElement('div');
    col.className = 'scol';
    rowA.append(figure(FORMATS[0]), figure(FORMATS[1]), col);
    col.append(figure(FORMATS[2]), figure(FORMATS[3]));
    sheet.append(rowA, figure(FORMATS[4]));

    printRules();
    printDecision();
    update();
    inBrand.addEventListener('input', update);
    inLine.addEventListener('input', update);
    $('#demo-form').addEventListener('submit', e => e.preventDefault());
    sw.addEventListener('click', () => setDecision(!decided, true));

    // first time the sheet is seen, the decision gets made in front of you
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setTimeout(() => { if (!touched) setDecision(true); }, RM ? 0 : 1100);
      });
    }, { threshold: 0.45 }).observe(sheet);

    buildHero(true);
    intro();
    flickLoop();
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

    buildStrip();
    new IntersectionObserver(([e], obs) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      stripSeen = true;
      setTimeout(() => stripLean && stripLean.to(DECISION.tilt), RM ? 0 : 500);
    }, { threshold: 0.6 }).observe(strip);

    measureSpine();
    spine();
    wireBrief();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    onScroll();

    console.log(
      '%c// you opened the console. good instinct.\n// the hero and the five formats are drawn by one function: scene(w, h).\n// brunotrevisrds@gmail.com',
      'font-family: monospace; color: #9a9a9a; line-height: 1.7'
    );
  }

  const fonts = document.fonts
    ? Promise.all([document.fonts.load('300 100px Outfit'), document.fonts.load('400 12px "Plex Mono"')])
    : Promise.resolve();
  Promise.race([fonts, new Promise(r => setTimeout(r, 1500))]).then(init, init);
})();
