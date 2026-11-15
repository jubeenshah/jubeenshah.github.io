/* The about-page globe: home, the great circle, and where it lands. Plain canvas, no library.
   Land is a grid of dots plus a coastline; two regions carry a finer coastline and denser dots that fade in when
   the camera is close. The camera runs a short timeline once the figure scrolls into view, then idles; drag to turn it.
   Data: assets/globe/globe.json (scripts/globe-data.py). Places come from data- attributes on the figure. */
(function () {
  var fig = document.getElementById('globe');
  if (!fig || localStorage.getItem('theme') === 'intern') return;         // the intern shell keeps the still image
  var cv = fig.querySelector('canvas'), cx = cv.getContext('2d'), out = fig.querySelector('.globe-out'), again = fig.querySelector('.globe-replay');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = Math.PI / 180, TAU = Math.PI * 2;
  function place(s) { s = s.split('|'); return { name: s[0], lat: +s[1], lon: +s[2], tz: s[3], v: vec(+s[2], +s[1]) }; }
  function vec(lon, lat) { var c = Math.cos(lat * D); return [c * Math.cos(lon * D), c * Math.sin(lon * D), Math.sin(lat * D)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var n = Math.sqrt(dot(a, a)) || 1; return [a[0] / n, a[1] / n, a[2] / n]; }
  function slerp(a, b, t) {                                               // along the great circle from a to b
    var w = Math.acos(Math.max(-1, Math.min(1, dot(a, b)))), s = Math.sin(w); if (s < 1e-6) return a;
    var p = Math.sin((1 - t) * w) / s, q = Math.sin(t * w) / s; return [a[0] * p + b[0] * q, a[1] * p + b[1] * q, a[2] * p + b[2] * q];
  }
  var ease = function (t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var step = function (x, a, b) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

  var HOME = place(fig.dataset.home), HERE = place(fig.dataset.here);
  var SIDE = norm([HOME.v[1] * HERE.v[2] - HOME.v[2] * HERE.v[1], HOME.v[2] * HERE.v[0] - HOME.v[0] * HERE.v[2], HOME.v[0] * HERE.v[1] - HOME.v[1] * HERE.v[0]]);
  if (SIDE[2] > 0) SIDE = [-SIDE[0], -SIDE[1], -SIDE[2]];                  // the pole of the route's great circle, southern side
  function beside(v, by) { return norm([v[0] + SIDE[0] * by, v[1] + SIDE[1] * by, v[2] + SIDE[2] * by]); }   // look from a little south of the route, so the arc bows
  var MID = beside(norm(slerp(HOME.v, HERE.v, 0.5)), 0.45);
  var ARC = Math.acos(dot(HOME.v, HERE.v)), MILES = ARC * 3958.8, KM = ARC * 6371;
  function offset(tz) { var n = new Date(); return (new Date(n.toLocaleString('en-US', { timeZone: tz })) - new Date(n.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000; }
  function clock(tz) { return new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }); }
  var AHEAD = offset(HOME.tz) - offset(HERE.tz);                            // minutes home is ahead of here, today

  /* ---- data: [lon, lat] in hundredths of a degree -> unit vectors ---- */
  var world = null;
  function unit(flat) { var a = new Float32Array(flat.length / 2 * 3); for (var i = 0, j = 0; i < flat.length; i += 2, j += 3) { var v = vec(flat[i] / 100, flat[i + 1] / 100); a[j] = v[0]; a[j + 1] = v[1]; a[j + 2] = v[2]; } return a; }
  function load(d) {
    var reg = function (r, p) {                                             // thin the dense dots toward the region's edge, so it has no square outline
      var all = unit(r.dots), keep = [];
      for (var i = 0; i < all.length; i += 3) if ((i * 7919 % 1000) / 1000 < step(all[i] * p.v[0] + all[i + 1] * p.v[1] + all[i + 2] * p.v[2], 0.925, 0.985)) keep.push(all[i], all[i + 1], all[i + 2]);
      var state = r.state.map(unit), mid = [0, 0, 0];                       // the middle of the state, for keeping labels off it
      state.forEach(function (a) { for (var i = 0; i < a.length; i++) mid[i % 3] += a[i]; });
      return { at: p.v, coast: r.coast.map(unit), dots: new Float32Array(keep), state: state, mid: norm(mid) };
    };
    world = { coast: d.coast.map(unit), dots: unit(d.dots), near: [reg(d.regions.india, HOME), reg(d.regions.usa, HERE)] };
  }

  /* ---- colours follow the theme ---- */
  var STOPS, INK, ACC, WARM, BGC;
  function rgb(v) {
    v = v.trim(); var m = /^#([0-9a-f]{3,8})$/i.exec(v);
    if (m) { var x = m[1]; if (x.length < 6) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2]; return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; }
    m = v.match(/[\d.]+/g) || [128, 128, 128]; return [+m[0], +m[1], +m[2]];
  }
  function palette() {
    var s = getComputedStyle(document.body), c = function (n) { return rgb(s.getPropertyValue(n)); };
    STOPS = [c('--perms'), c('--cat-career'), c('--accent')]; INK = c('--text').join(','); ACC = c('--accent').join(','); WARM = c('--warning').join(','); BGC = c('--bg').join(',');
  }
  function mix(u) { var t = Math.max(0, Math.min(1, u)) * 2, i = Math.min(Math.floor(t), 1), f = t - i, p = STOPS[i], n = STOPS[i + 1]; return Math.round(p[0] + (n[0] - p[0]) * f) + ',' + Math.round(p[1] + (n[1] - p[1]) * f) + ',' + Math.round(p[2] + (n[2] - p[2]) * f); }

  /* ---- camera and projection ---- */
  var w = 0, h = 0, R = 0, F, E, U, K = 1, X0, Y0;
  function aim(f, k) { F = f; E = norm([-f[1], f[0], 0]); U = [F[1] * E[2] - F[2] * E[1], F[2] * E[0] - F[0] * E[2], F[0] * E[1] - F[1] * E[0]]; K = k; }
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2); w = fig.clientWidth; h = Math.round(Math.min(w * 0.62, 520));
    cv.style.height = h + 'px'; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); R = Math.min(w, h) * 0.43; X0 = w / 2; Y0 = h / 2;
  }
  function sun() {                                                          // where the sun is overhead right now
    var n = new Date(), day = (Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) - Date.UTC(n.getUTCFullYear(), 0, 0)) / 864e5;
    return vec(-(n.getUTCHours() + n.getUTCMinutes() / 60 - 12) * 15, -23.44 * Math.cos(TAU / 365 * (day + 10)));
  }

  function dots(a, r, alpha, SUN) {                                         // batched: a few fills instead of one per dot
    var bins = {}, s = R * K;
    for (var i = 0; i < a.length; i += 3) {
      var z = a[i] * F[0] + a[i + 1] * F[1] + a[i + 2] * F[2]; if (z < 0.03) continue;
      var x = X0 + s * (a[i] * E[0] + a[i + 1] * E[1] + a[i + 2] * E[2]), y = Y0 - s * (a[i] * U[0] + a[i + 1] * U[1] + a[i + 2] * U[2]);
      if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
      var lit = a[i] * SUN[0] + a[i + 1] * SUN[1] + a[i + 2] * SUN[2] > 0 ? 1 : 0, key = Math.min(5, Math.floor(x / w * 6)) * 4 + lit * 2 + (z > 0.45 ? 1 : 0);
      (bins[key] || (bins[key] = [])).push(x, y);
    }
    Object.keys(bins).forEach(function (key) {
      var b = bins[key], k = +key, lit = (k >> 1) & 1, front = k & 1;
      cx.fillStyle = 'rgba(' + mix((Math.floor(k / 4) + 0.5) / 6) + ',' + (alpha * (lit ? 1 : 0.55) * (front ? 0.95 : 0.5)).toFixed(3) + ')'; cx.beginPath();
      for (var i = 0; i < b.length; i += 2) { cx.moveTo(b[i] + r, b[i + 1]); cx.arc(b[i], b[i + 1], front ? r : r * 0.8, 0, TAU); }
      cx.fill();
    });
  }
  function lines(list, style, width, fill) {                                // coastlines: skip any segment that is behind the limb
    var s = R * K; cx.beginPath();
    list.forEach(function (a) {
      var pen = false;
      for (var i = 0; i < a.length; i += 3) {
        var z = a[i] * F[0] + a[i + 1] * F[1] + a[i + 2] * F[2]; if (z < 0) { pen = false; continue; }
        var x = X0 + s * (a[i] * E[0] + a[i + 1] * E[1] + a[i + 2] * E[2]), y = Y0 - s * (a[i] * U[0] + a[i + 1] * U[1] + a[i + 2] * U[2]);
        if (pen) cx.lineTo(x, y); else cx.moveTo(x, y); pen = true;
      }
    });
    if (fill) { cx.fillStyle = fill; cx.fill(); }
    cx.strokeStyle = style; cx.lineWidth = width; cx.stroke();
  }
  function at(v, lift) { var z = dot(v, F), s = R * K * (lift || 1); return [X0 + s * dot(v, E), Y0 - s * dot(v, U), z]; }
  function pin(p, t, label, colour, show, avoid) {                        // the label goes on the side away from `avoid`: the route, or the state outline
    var q = at(p.v); if (q[2] < 0.05 || show <= 0) return;
    var pulse = (t * 0.8) % 1; cx.globalAlpha = show;
    cx.strokeStyle = 'rgba(' + colour + ',' + (0.7 * (1 - pulse)).toFixed(3) + ')'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(q[0], q[1], 5 + pulse * 16, 0, TAU); cx.stroke();
    cx.fillStyle = 'rgb(' + colour + ')'; cx.beginPath(); cx.arc(q[0], q[1], 4, 0, TAU); cx.fill();
    cx.font = '12px ui-monospace, Menlo, Consolas, monospace'; var tw = cx.measureText(label).width, left = (at(avoid)[0] > q[0] || q[0] + tw + 30 > w) && q[0] - tw - 30 > 0;
    cx.strokeStyle = 'rgba(' + colour + ',0.8)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(q[0] + (left ? -6 : 6), q[1] - 6); cx.lineTo(q[0] + (left ? -16 : 16), q[1] - 18); cx.lineTo(q[0] + (left ? -22 : 22), q[1] - 18); cx.stroke();
    cx.fillStyle = 'rgba(' + BGC + ',0.7)'; cx.fillRect(left ? q[0] - 30 - tw : q[0] + 24, q[1] - 28, tw + 8, 18);
    cx.fillStyle = 'rgb(' + colour + ')'; cx.textAlign = left ? 'right' : 'left'; cx.fillText(label, q[0] + (left ? -26 : 28), q[1] - 14); cx.textAlign = 'left'; cx.globalAlpha = 1;
  }

  /* ---- the timeline: [end second, what the camera does] ---- */
  var T = { spin: 2.2, inHome: 4.8, holdHome: 6.2, outHome: 7.8, fly: 12.0, inHere: 14.4, holdHere: 15.8, out: 18.2 }, FAR = vec(HOME.lon - 46, HOME.lat - 14);
  function shot(t) {
    var s = { arc: 0, home: step(t, 1.2, 2.4), here: 0, f: HOME.v, k: 1 };
    if (t < T.spin) { s.f = norm(slerp(FAR, HOME.v, ease(t / T.spin))); s.k = 0.86 + 0.14 * ease(t / T.spin); }
    else if (t < T.inHome) s.k = 1 + 2.3 * ease((t - T.spin) / (T.inHome - T.spin));
    else if (t < T.holdHome) s.k = 3.3;
    else if (t < T.outHome) s.k = 3.3 - 2.25 * ease((t - T.holdHome) / (T.outHome - T.holdHome));
    else if (t < T.fly) { s.arc = ease((t - T.outHome) / (T.fly - T.outHome)); s.f = beside(norm(slerp(HOME.v, HERE.v, s.arc)), 0.4 * Math.sin(Math.PI * s.arc)); s.k = 1.05; }
    else {
      s.arc = 1; s.here = step(t, T.fly - 0.2, T.fly + 0.6); s.f = HERE.v;
      if (t < T.inHere) s.k = 1.05 + 2.35 * ease((t - T.fly) / (T.inHere - T.fly));
      else if (t < T.holdHere) s.k = 3.4;
      else { var e = ease((t - T.holdHere) / (T.out - T.holdHere)); s.k = 3.4 - 2.42 * e; s.f = norm(slerp(HERE.v, MID, e)); }
    }
    return s;
  }

  var t0 = 0, last = 0, raf = 0, seen = false, hops = -1, drag = null, yaw = 0, pitch = 0, freeze = 0;
  function turned(f, sway) {                                                // the idle view: a slow sway, plus whatever was dragged
    var lon = Math.atan2(f[1], f[0]) / D + yaw + sway, lat = Math.max(-80, Math.min(80, Math.asin(f[2]) / D + pitch)); return vec(lon, lat);
  }
  function frame(ts) {
    raf = requestAnimationFrame(frame); if (!world) return;
    var t = still ? 99 : (ts - t0) / 1000, idle = t >= T.out;
    if (idle && !drag && ts - last < 40) return; last = ts;
    var s = idle ? { arc: 1, home: 1, here: 1, f: MID, k: 0.98 } : shot(t), SUN = sun();
    aim(idle ? turned(s.f, still ? 0 : 6 * Math.sin((t - T.out) / 7)) : s.f, s.k); cx.clearRect(0, 0, w, h);

    var g = cx.createRadialGradient(X0, Y0, R * K * 0.2, X0, Y0, R * K * 1.12);   // the sphere and a thin atmosphere
    g.addColorStop(0, 'rgba(' + mix(0.5) + ',0.10)'); g.addColorStop(0.86, 'rgba(' + mix(0.5) + ',0.04)'); g.addColorStop(0.9, 'rgba(' + ACC + ',0.16)'); g.addColorStop(1, 'rgba(' + ACC + ',0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(X0, Y0, R * K * 1.12, 0, TAU); cx.fill();
    cx.strokeStyle = 'rgba(' + INK + ',0.22)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(X0, Y0, R * K, 0, TAU); cx.stroke();

    dots(world.dots, Math.min(1.8, 1.15 * Math.sqrt(K)), 0.9, SUN);
    lines(world.coast, 'rgba(' + INK + ',' + (0.30 - 0.12 * step(K, 1.4, 2.6)).toFixed(3) + ')', 1);
    world.near.forEach(function (r) {                                    // the finer layer, only when close and facing it
      var a = step(K, 1.35, 2.5) * step(dot(F, r.at), 0.86, 0.97); if (a < 0.02) return;
      cx.globalAlpha = a; dots(r.dots, 1.3, 0.9, SUN); lines(r.coast, 'rgba(' + INK + ',0.62)', 1.2);
      lines(r.state, 'rgba(' + ACC + ',0.95)', 1.6, 'rgba(' + ACC + ',0.14)');           // Maharashtra, North Carolina
      cx.globalAlpha = 1;
    });

    if (s.arc > 0) {                                                        // the route, lifted off the surface so it reads as flight
      var n = Math.max(2, Math.round(90 * s.arc)), head = null; cx.beginPath();
      for (var i = 0, pen = false; i <= n; i++) {
        var u = s.arc * i / n, lift = 1 + 0.11 * Math.sin(Math.PI * u), q = at(norm(slerp(HOME.v, HERE.v, u)), lift);
        if (q[2] < 0 && Math.hypot(q[0] - X0, q[1] - Y0) < R * K) { pen = false; continue; }    // behind the globe
        if (pen) cx.lineTo(q[0], q[1]); else cx.moveTo(q[0], q[1]); pen = true; head = q;
      }
      cx.strokeStyle = 'rgba(' + WARM + ',0.95)'; cx.lineWidth = 2; cx.lineCap = 'round'; cx.stroke();
      if (head && s.arc < 1) { cx.fillStyle = 'rgb(' + WARM + ')'; cx.beginPath(); cx.arc(head[0], head[1], 3.5, 0, TAU); cx.fill(); }
    }
    pin(HOME, ts / 1000, HOME.name, ACC, s.home, s.arc > 0 ? HERE.v : world.near[0].mid); pin(HERE, ts / 1000 + 0.4, HERE.name, WARM, s.here, HOME.v);
    report(idle ? 4 : t < T.spin ? 0 : t < T.outHome ? 1 : t < T.fly ? 2 : 3, s.arc);
    if (still) { cancelAnimationFrame(raf); raf = 0; }
  }

  /* ---- the readout under the globe, written like traceroute ---- */
  function deg(v, pos, neg) { return Math.abs(v).toFixed(2) + '°' + (v >= 0 ? pos : neg); }
  function row(n, p) { return ' ' + n + '  ' + (p.name + '                  ').slice(0, 18) + deg(p.lat, 'N', 'S') + '  ' + (deg(p.lon, 'E', 'W') + '   ').slice(0, 10) + clock(p.tz); }
  function report(stage, arc) {
    if (stage === hops && stage !== 2) return; hops = stage;
    var mi = Math.round(MILES * arc).toLocaleString('en-US'), rows = [];
    if (stage >= 1) rows.push(row(1, HOME));
    if (stage >= 2) rows.push(' 2  * * *             ' + (stage === 2 ? mi : Math.round(MILES).toLocaleString('en-US')) + ' mi');
    if (stage >= 3) rows.push(row(3, HERE));
    if (stage >= 4) rows.push(Math.round(MILES).toLocaleString('en-US') + ' mi, ' + Math.round(KM).toLocaleString('en-US') + ' km. home is ' + Math.floor(Math.abs(AHEAD) / 60) + ' h ' + (Math.abs(AHEAD) % 60 ? Math.abs(AHEAD) % 60 + ' min ' : '') + (AHEAD >= 0 ? 'ahead.' : 'behind.'));
    out.textContent = rows.join('\n');
  }

  function play() { t0 = performance.now(); hops = -1; yaw = pitch = 0; if (!raf) raf = requestAnimationFrame(frame); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  fig.classList.add('globe-live'); palette(); size(); aim(HOME.v, 1);
  fetch(fig.dataset.src).then(function (r) { return r.json(); }).then(function (d) { load(d); if (still) raf = requestAnimationFrame(frame); }).catch(function () { fig.classList.remove('globe-live'); });
  new IntersectionObserver(function (es) {                                  // start on first sight; sleep while off screen
    if (es[0].isIntersecting) { if (!seen) { seen = true; play(); } else if (!raf) { freeze && (t0 += performance.now() - freeze); raf = requestAnimationFrame(frame); } }
    else if (raf) { freeze = performance.now(); stop(); }
  }, { threshold: 0.25 }).observe(fig);
  new MutationObserver(palette).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', size);
  again.addEventListener('click', play);
  cv.addEventListener('pointerdown', function (e) { if (performance.now() - t0 > T.out * 1000 || still) { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); } });
  cv.addEventListener('pointermove', function (e) { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.35; pitch += (e.clientY - drag[1]) * 0.35; pitch = Math.max(-70, Math.min(70, pitch)); drag = [e.clientX, e.clientY]; if (still && !raf) raf = requestAnimationFrame(frame); });
  cv.addEventListener('pointerup', function () { drag = null; });
})();
