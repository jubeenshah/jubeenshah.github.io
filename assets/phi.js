/* A live plexus / wire wave / dot wave behind the page, a light HUD, and animated nav icons, for the dark, light
   and colour-blind themes (not the intern shell). Colours come from the active theme's CSS variables, so each
   theme keeps its own palette. The maths is ported from the phi-d3lx0h background generator. */
(function () {
  var THEMES = ['dark', 'light', 'a11y', 'intern'];
  var TAU = Math.PI * 2, MODES = ['plexus', 'wire', 'dots', 'off'];
  var qs = new URLSearchParams(location.search), q = qs.get('theme'), qb = qs.get('bg');
  if (THEMES.indexOf(q) >= 0) localStorage.setItem('theme', q);          // ?theme=light&bg=wire opens straight into it
  if (MODES.indexOf(qb) >= 0) localStorage.setItem('mesh-bg', qb);
  var wanted = function () { return localStorage.getItem('theme') !== 'intern' && !document.body.classList.contains('intern-mode'); };
  if (localStorage.getItem('theme') !== 'intern') document.documentElement.classList.add('phi-on');   // before first paint

  var BASE = (document.currentScript && document.currentScript.src || '/assets/phi.js').replace(/phi\.js.*$/, 'phi/');
  var STOPS, INK, CYAN, LABELS;                                             // read from the theme in palette()
  function rgb(v) {
    v = v.trim(); var m = /^#([0-9a-f]{3,8})$/i.exec(v);
    if (m) { var x = m[1]; if (x.length < 6) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2]; return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; }
    m = v.match(/[\d.]+/g) || [128, 128, 128]; return [+m[0], +m[1], +m[2]];
  }
  function palette() {                                                     // the mesh sweeps perms -> career -> accent in whatever theme is on
    var s = getComputedStyle(document.body), c = function (n) { return rgb(s.getPropertyValue(n)); };
    STOPS = [c('--perms'), c('--cat-career'), c('--accent')]; INK = c('--text').join(','); CYAN = c('--accent').join(',');
    LABELS = [['0x1A', 'agent.03  ok', CYAN], ['0x3F', 'unsigned tool call', c('--nsfw').join(',')], ['0x7C', 'gateway  ok', c('--link').join(',')]];
  }
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cv, cx, w = 0, h = 0, raf = 0, last = 0, nodes = [], picks = [];
  // Scroll parallax. sp eases toward the page's scroll position, and each layer moves by a fraction of it:
  // far marks 3%, the mesh 8%, the page itself 100%. Small on purpose; this sits behind text.
  var sp = 0, FAR = 0.03, MESH = 0.08;
  function wrap(y) { var span = h + 120; return ((y + 60) % span + span) % span - 60; }   // nodes leaving the top come back at the bottom
  var mode = localStorage.getItem('mesh-bg') || 'plexus', mouse = { x: -999, y: -999, on: false };

  function mix(u, a) {
    var t = Math.min(Math.max(u, 0), 1) * 2, i = Math.min(Math.floor(t), 1), f = t - i, p = STOPS[i], n = STOPS[i + 1];
    return 'rgba(' + Math.round(p[0] + (n[0] - p[0]) * f) + ',' + Math.round(p[1] + (n[1] - p[1]) * f) + ',' + Math.round(p[2] + (n[2] - p[2]) * f) + ',' + a + ')';
  }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function push(p) {                                                       // the pointer pushes the mesh away from itself
    if (!mouse.on) return p;
    var dx = p[0] - mouse.x, dy = p[1] - mouse.y, d = Math.sqrt(dx * dx + dy * dy) || 1, k = 34 * Math.exp(-(d * d) / 26000);
    return [p[0] + dx / d * k, p[1] + dy / d * k];
  }
  function surface(u, t, amp, ph) {                                        // a wavy sheet seen from above its near edge
    var s = 0.30 + 0.70 * Math.pow(t, 1.5);
    var x = w / 2 + (u - 0.5) * w * 1.75 * s;
    var y = h * (0.36 + 0.60 * Math.pow(t, 1.55)) - amp * (h / 1080) * s * (Math.sin(TAU * (1.4 * u + 0.9 * t) + ph) + 0.45 * Math.sin(TAU * (3.1 * u - 1.3 * t + 0.2) - 2 * ph));
    return push([x, y - Math.min(sp * MESH * 0.6, h * 0.07)]);       // the wave lifts a little as you read down, then holds
  }
  function lift(x, y, ph) { var c = h * 0.55 + h * 0.14 * Math.sin(TAU * x / w * 1.1 + ph); return Math.exp(-Math.pow((y - c) / (h * 0.28), 2)); }

  function layout() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var step = Math.max(88, Math.sqrt(w * h / 380)), cols = Math.ceil(w / step), rows = Math.ceil(h / (step * 1.1)), r = rng(7), d = rng(11);
    nodes = [];
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      nodes.push({ x: (i + 0.5 + (r() - 0.5) * 0.76) * w / cols, y: (j + 0.5 + (r() - 0.5) * 0.76) * h / rows, th: d() * TAU, k: d() < 0.33 ? 2 : 1, rx: 10 + d() * 20, ry: 10 + d() * 20 });
    }
    picks = [];                                                            // three bright, well-spaced nodes get a label
    nodes.map(function (n, i) { return [lift(n.x, n.y, 0), i]; }).sort(function (a, b) { return b[0] - a[0]; }).forEach(function (e) {
      var n = nodes[e[1]];
      if (picks.length < 3 && n.x > w * 0.12 && n.x < w * 0.78 && n.y > h * 0.25 && n.y < h * 0.8 && picks.every(function (p) { return Math.abs(nodes[p].x - n.x) > w * 0.2; })) picks.push(e[1]);
    });
    picks.sort(function (a, b) { return nodes[a].x - nodes[b].x; });
  }

  function plexus(ph) {
    var P = nodes.map(function (n) {
      var x = n.x + n.rx * (Math.cos(n.k * ph + n.th) - Math.cos(n.th)), y = wrap(n.y - sp * MESH) + n.ry * (Math.sin(n.k * ph + n.th) - Math.sin(n.th));
      return push([x, y + h * 0.065 * Math.sin(TAU * (x / w * 1.3 + y / h * 0.5) + ph)]);
    });
    cx.lineWidth = 1;
    for (var a = 0; a < P.length; a++) for (var b = a + 1; b < P.length; b++) {
      var dx = P[a][0] - P[b][0], dy = P[a][1] - P[b][1]; if (dx > 150 || dx < -150 || dy > 150 || dy < -150) continue;
      var d = Math.sqrt(dx * dx + dy * dy); if (d >= 150) continue;
      var mx = (P[a][0] + P[b][0]) / 2, my = (P[a][1] + P[b][1]) / 2;
      cx.strokeStyle = mix(mx / w, ((0.06 + 0.5 * lift(mx, my, ph)) * (1 - d / 190) * Math.min(1, (150 - d) / 30)).toFixed(3));
      cx.beginPath(); cx.moveTo(P[a][0], P[a][1]); cx.lineTo(P[b][0], P[b][1]); cx.stroke();
    }
    P.forEach(function (p) {
      var l = lift(p[0], p[1], ph);
      if (mouse.on) { var d = Math.hypot(p[0] - mouse.x, p[1] - mouse.y); if (d < 190) { cx.strokeStyle = 'rgba(' + INK + ',' + (0.5 * (1 - d / 190)).toFixed(3) + ')'; cx.beginPath(); cx.moveTo(mouse.x, mouse.y); cx.lineTo(p[0], p[1]); cx.stroke(); } }
      cx.fillStyle = mix(p[0] / w, (0.2 + 0.8 * l).toFixed(2)); cx.beginPath(); cx.arc(p[0], p[1], 1.6 + 3.6 * l, 0, TAU); cx.fill();
    });
    if (w > 760) picks.forEach(function (i, n) { callout(P[i][0], P[i][1], LABELS[n]); });
  }
  function wire(ph) {
    var rows = 30, cols = 46, n = 110, g = cx.createLinearGradient(0, 0, w, 0), i, j, p;
    g.addColorStop(0, mix(0, 1)); g.addColorStop(0.5, mix(0.5, 1)); g.addColorStop(1, mix(1, 1)); cx.strokeStyle = g;
    for (j = 0; j <= rows; j++) {
      var t = j / rows; cx.globalAlpha = 0.10 + 0.70 * t; cx.lineWidth = 0.7 + 0.9 * t; cx.beginPath();
      for (i = 0; i <= n; i++) { p = surface(i / n, t, 150, ph); if (i) cx.lineTo(p[0], p[1]); else cx.moveTo(p[0], p[1]); }
      cx.stroke();
    }
    cx.globalAlpha = 0.28; cx.lineWidth = 0.8;
    for (i = 0; i <= cols; i++) { cx.beginPath(); for (j = 0; j <= 48; j++) { p = surface(i / cols, j / 48, 150, ph); if (j) cx.lineTo(p[0], p[1]); else cx.moveTo(p[0], p[1]); } cx.stroke(); }
    cx.globalAlpha = 1;
  }
  function dots(ph) {
    var rows = 34, cols = 78;
    for (var j = 0; j <= rows; j++) for (var i = 0; i <= cols; i++) {
      var t = j / rows, u = i / cols, p = surface(u, t, 170, ph); if (p[0] < -20 || p[0] > w + 20) continue;
      cx.fillStyle = mix(u, (0.18 + 0.78 * t).toFixed(2)); cx.beginPath(); cx.arc(p[0], p[1], 0.7 + 2.6 * Math.pow(t, 1.3), 0, TAU); cx.fill();
    }
  }
  function callout(x, y, label) {                                         // a reticle on a node, with a leader and a label
    var r = 13, c = 5, kx = x + 40, ky = y - 40; cx.strokeStyle = 'rgba(' + label[2] + ',0.9)'; cx.lineWidth = 1.2; cx.beginPath();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { cx.moveTo(x + s[0] * (r - c), y + s[1] * r); cx.lineTo(x + s[0] * r, y + s[1] * r); cx.lineTo(x + s[0] * r, y + s[1] * (r - c)); });
    cx.moveTo(x + r, y - r); cx.lineTo(kx, ky); cx.lineTo(kx + 52, ky); cx.stroke();
    cx.font = '12px ' + MONO; cx.fillStyle = 'rgba(' + label[2] + ',1)'; cx.fillText(label[0], kx + 60, ky - 2);
    cx.font = '11px ' + MONO; cx.fillStyle = 'rgba(' + INK + ',0.6)'; cx.fillText(label[1], kx + 60, ky + 13);
  }
  function hud(sec) {                                                      // corner marks, registration crosses, a scan line, a readout
    var m = 18, a = 26, x, y; cx.strokeStyle = 'rgba(' + INK + ',0.32)'; cx.lineWidth = 1; cx.beginPath();
    [[m, 72, 1, 1], [w - m, 72, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]].forEach(function (k) { cx.moveTo(k[0] + k[2] * a, k[1]); cx.lineTo(k[0], k[1]); cx.lineTo(k[0], k[1] + k[3] * a); });
    cx.stroke(); cx.strokeStyle = 'rgba(' + INK + ',0.11)'; cx.beginPath();
    for (x = 240; x < w; x += 240) for (y = 240 - (sp * FAR) % 180; y < h; y += 180) { if (y < 80) continue; cx.moveTo(x - 6, y); cx.lineTo(x + 6, y); cx.moveTo(x, y - 6); cx.lineTo(x, y + 6); }
    cx.stroke();
    var sy = 60 + (h - 60) * ((sec / 12 + 0.58) % 1), g = cx.createLinearGradient(0, sy - 70, 0, sy);
    g.addColorStop(0, 'rgba(' + CYAN + ',0)'); g.addColorStop(1, 'rgba(' + CYAN + ',0.08)'); cx.fillStyle = g; cx.fillRect(0, sy - 70, w, 70);
    cx.strokeStyle = 'rgba(' + CYAN + ',0.30)'; cx.beginPath(); cx.moveTo(0, sy); cx.lineTo(w, sy); cx.stroke();
    var pad = function (v, n) { v = String(Math.max(0, Math.round(v))); while (v.length < n) v = '0' + v; return v; };
    cx.font = '11px ' + MONO; cx.textAlign = 'right'; cx.fillStyle = 'rgba(' + INK + ',0.42)';
    cx.fillText('x:' + pad(mouse.on ? mouse.x : 0, 4) + ' y:' + pad(mouse.on ? mouse.y : 0, 4) + '  ' + mode + '  T+' + pad(Math.floor(sec / 60), 2) + ':' + pad(Math.floor(sec % 60), 2), w - m - 8, h - m - 34);   // sits just above the --bg switch
    cx.textAlign = 'left';
  }
  function frame(ts) {
    raf = still ? 0 : requestAnimationFrame(frame);
    if (!still && ts - last < 32) return;
    last = ts;
    var sec = ts / 1000, ph = sec / 24 * TAU; cx.clearRect(0, 0, w, h);
    sp = still ? 0 : sp + (window.scrollY - sp) * 0.14;                 // eased, so the background glides after the page
    if (mode === 'plexus') plexus(ph); else if (mode === 'wire') wire(ph + sp * 0.0014); else if (mode === 'dots') dots(ph + sp * 0.0014);   // scrolling also rolls the wave
    hud(sec);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; if (cx) cx.clearRect(0, 0, w, h); }
  function sync() {
    var on = wanted(); document.documentElement.classList.toggle('phi-on', on); if (on) palette();
    stop(); if (on && mode !== 'off' && !document.hidden) { layout(); raf = requestAnimationFrame(frame); }
    if (on) icons();
    var chip = document.getElementById('mesh-chip'); if (chip) chip.textContent = '--bg=' + mode;
  }
  function set(m) { mode = MODES.indexOf(m) >= 0 ? m : 'plexus'; localStorage.setItem('mesh-bg', mode); sync(); }

  /* nav icons: the static sprite shows first; once the player loads, each icon replays its motion on hover */
  var player = null;
  function lottie(cb) {
    if (window.lottie) return cb(window.lottie);
    if (!player) { player = document.createElement('script'); player.src = BASE + 'lottie_light.min.js'; document.head.appendChild(player); }
    player.addEventListener('load', function () { cb(window.lottie); });
  }
  function icons() {
    var spans = [].slice.call(document.querySelectorAll('.phi-ico[data-icon]:not(.phi-wired)')); if (!spans.length) return;
    spans.forEach(function (s) { s.classList.add('phi-wired'); });
    lottie(function (L) {
      spans.forEach(function (s) {
        fetch(BASE + 'lottie/' + s.dataset.icon + '.json').then(function (r) { return r.json(); }).then(function (data) {
          var box = document.createElement('span'); box.className = 'phi-anim'; s.appendChild(box);
          var a = L.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: data });
          a.addEventListener('DOMLoaded', function () { a.goToAndStop(a.totalFrames - 1, true); s.classList.add('phi-live'); });
          (s.closest('a') || s).addEventListener('mouseenter', function () { if (!still) a.goToAndPlay(0, true); });
        }).catch(function () {});
      });
    });
  }

  function boot() {
    cv = document.getElementById('phi-mesh'); if (!cv) return; cx = cv.getContext('2d');
    window.addEventListener('resize', sync);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; });
    document.addEventListener('mouseleave', function () { mouse.on = false; });
    document.addEventListener('visibilitychange', sync);
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    var chip = document.getElementById('mesh-chip'); if (chip) chip.addEventListener('click', function () { set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]); });
    sync();
  }
  window.phiMesh = { set: set, lottie: lottie, base: BASE, get mode() { return mode; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
