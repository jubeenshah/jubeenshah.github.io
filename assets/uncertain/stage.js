/* The stage behind "It's a scary uncertain world we live in": one WebGL2 scene for the whole post, no library.
   The same 25,000 particles take every shape the site has had: Odyssey's light rain, a single point, the commit
   log, each era's recording, the mesh, the globe, a helix of every line written and erased. Each .u-beat section in
   the post names its shape (data-scene) and, for an era, its clip (data-clip); scroll is time.
   Data: commits.json (scripts/uncertain-data.py) and the about page's globe.json. */
(function () {
  var cv = document.getElementById('u-stage'), beats = [].slice.call(document.querySelectorAll('.u-beat'));
  var hud = document.getElementById('u-hud'), root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = cv && cv.getContext('webgl2', { antialias: true, alpha: false, premultipliedAlpha: true });
  if (!gl || !beats.length) { root.classList.add('u-flat'); return; }
  root.classList.add('u-live');

  var SCENES = { whisper: 0, rain: 1, plate: 2, point: 3, timeline: 4, dust: 5, burst: 6, mesh: 7, globe: 8, helix: 9 };
  var GW = 200, GH = 125, N = GW * GH, D = 2.4142;                       // the grid matches the clips' 16:10; D puts the z=0 plane edge to edge
  var BASE = cv.dataset.base || '/assets/uncertain/';

  /* ---- shaders ---- */
  var VS = '#version 300 es\nprecision highp float;\n' +
  'layout(location=0) in vec2 aGrid; layout(location=1) in vec4 aSeed; layout(location=2) in vec4 aCommit;\n' +
  'layout(location=3) in vec3 aGlobe; layout(location=4) in vec3 aHelix; layout(location=5) in float aEnd;\n' +
  'uniform int uA, uB; uniform float uT, uPA, uPB, uTime, uAspect, uPx, uDpr, uMotion, uLines, uDay, uFlash, uFade;\n' +
  'uniform vec2 uPointer; uniform vec4 uPlate; uniform sampler2D uTexA, uTexB; uniform mat4 uProj;\n' +
  'out vec4 vColor; out float vSq;\n' +
  'const float PI = 3.14159265;\n' +
  'const vec3 CYAN = vec3(.518,.788,.984), TEAL = vec3(.012,.855,.773), VIOLET = vec3(.733,.549,.965), ROSE = vec3(.812,.4,.475);\n' +
  'const vec3 PERMS = vec3(.6,.502,1.), WHITE = vec3(.92,.95,.97), R1 = vec3(1.,.247,.557), R2 = vec3(.016,.761,.788), R3 = vec3(.18,.333,.757);\n' +
  'struct F { vec3 p; vec4 c; float s; float sq; };\n' +
  'mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }\n' +
  'F mk(vec3 p, vec4 c, float s, float sq) { F f; f.p = p; f.c = c; f.s = s; f.sq = sq; return f; }\n' +
  // a whisper: a thin waveform across the middle of the dark
  'F whisper(float pr) {\n' +
  '  float x = (aGrid.x * 2. - 1.) * uAspect * 1.1, env = exp(-x * x / (uAspect * uAspect) * 2.2);\n' +
  '  float y = -.38 + sin(x * 4.5 + uTime * 1.1 + aGrid.y * 1.7) * .09 * env * (.7 + .3 * sin(uTime * .6 + x * 2.)) + (aGrid.y - .5) * .05 * env + (aSeed.y - .5) * .012;\n' +
  '  return mk(vec3(x, y, (aSeed.z - .5) * .25), vec4(mix(CYAN, TEAL, aGrid.x), (.10 + .5 * env) * step(.55, aSeed.w)), 1.3, 0.);\n' +
  '}\n' +
  // 2020: Odyssey's rain, the pts.js field from the old site: points turning round a corner, each with a streak
  'F rain(float pr) {\n' +
  '  vec2 q = rot(aGrid.x * PI + uTime * .052 * uMotion) * ((aSeed.xy * 2. - 1.) * 2.1);\n' +
  '  vec3 p = vec3(vec2(-uAspect * .55, .55) + q, 0.);\n' +
  '  float on = step(aSeed.w, .014); float k = floor(aSeed.z * 3.);\n' +
  '  vec3 col = k < 1. ? R1 : k < 2. ? R2 : R3;\n' +
  '  if (aEnd > .5) { vec2 d = normalize(vec2(2., -1.)), L0 = vec2(uAspect * .5, -1.5); p.xy = L0 + d * dot(p.xy - L0, d); }\n' +
  '  return mk(p, vec4(col, on), 1.7, 0.);\n' +
  '}\n' +
  // an era: the grid laid over that era's clip, each particle the colour of its pixel
  'F plate(vec3 tex) {\n' +
  '  vec2 xy = uPlate.xy + vec2((aGrid.x - .5) * uPlate.z, (.5 - aGrid.y) * uPlate.w);\n' +
  '  return mk(vec3(xy, (xy.x - uPlate.x) * uPointer.x * .07 + (xy.y - uPlate.y) * uPointer.y * .07), vec4(tex, 1.), uPlate.z / float(' + GW + ') * uPx * 1.06, 1.);\n' +
  '}\n' +
  // 2022-05-12 22:57: everything in one point
  'F point(float pr) {\n' +
  '  vec3 d = normalize(aSeed.xyz * 2. - 1. + 1e-4); float r = pow(aSeed.w, 4.) * .10 * (1. + .25 * sin(uTime * 2.4));\n' +
  '  return mk(d * r + vec3(uPlate.xy, 0.), vec4(WHITE, .05 + .25 * (1. - aSeed.w)), 1.4, 0.);\n' +
  '}\n' +
  // the commit log: one column per day, a commit's height by the lines it touched; the future lies flat
  'F timeline(float pr) {\n' +
  '  float x = (aCommit.x * 2. - 1.) * uAspect * .86 + (aSeed.x - .5) * .004, near = exp(-abs(aCommit.x - uDay) * 160.);\n' +
  '  bool done = aCommit.x <= uDay + .0004;\n' +
  '  vec3 col = aCommit.z < .5 ? CYAN : aCommit.z < 1.5 ? VIOLET : vec3(.6);\n' +
  '  return mk(vec3(x, done ? -.5 + aCommit.y * 1.05 : -.5 - .006 * aSeed.y, 0.), vec4(mix(col, WHITE, near * .6), done ? .5 + .45 * near : .05), 1.5 + near * 1.8, 0.);\n' +
  '}\n' +
  // the silence: dust, barely moving; uFlash lights some of it
  'F dust(float pr) {\n' +
  '  vec3 q = (aSeed.xyz * 2. - 1.) * vec3(uAspect * 1.5, 1.4, 1.6) + .04 * sin(uTime * .25 + aSeed.wzy * 6.283) * uMotion;\n' +
  '  return mk(q, vec4(mix(CYAN, VIOLET, aSeed.y), .04 + .1 * aSeed.w * aSeed.w + uFlash * .5 * step(.82, aSeed.x)), 1.1 + uFlash * step(.82, aSeed.x) * 1.5, 0.);\n' +
  '}\n' +
  // March 2026: the burst, scrolled open
  'F burst(float pr) {\n' +
  '  vec3 d = normalize(aSeed.xyz * 2. - 1. + 1e-4); float r = (.04 + pr * 1.7) * pow(aSeed.w, .35);\n' +
  '  float arm = floor(aSeed.x * 5.) / 5. * 6.283;\n' +
  '  d.xy = mix(d.xy, vec2(cos(arm + r * 3.), sin(arm + r * 3.)), .55 * pr); d.xy = rot(pr * 2.4 * (1. - aSeed.w) + uTime * .06 * uMotion) * d.xy; d.z *= .5;\n' +
  '  return mk(d * r + vec3(uPlate.xy, 0.), vec4(mix(VIOLET, TEAL, aSeed.y), .55 * (1. - pr * .4)), 1.5, 0.);\n' +
  '}\n' +
  // 2026-11-14: the dot wave from the site's background
  'F mesh(float pr) {\n' +
  '  float x = (aGrid.x - .5) * 6., z = 1.2 - aGrid.y * 6.;\n' +
  '  float y = -.72 + .18 * sin(x * 1.6 + uTime * .55 * uMotion + pr * 3.) * cos(z * 1.2 + uTime * .4 * uMotion);\n' +
  '  vec3 col = aGrid.x < .5 ? mix(PERMS, CYAN, aGrid.x * 2.) : mix(CYAN, TEAL, aGrid.x * 2. - 1.);\n' +
  '  return mk(vec3(x, y, z), vec4(col, .55 * smoothstep(0., .3, aGrid.y) * step(.5, aSeed.w)), 1.6, 0.);\n' +
  '}\n' +
  // 2026-11-15: the globe, turning from Mumbai to Raleigh as you scroll
  'F globe(float pr) {\n' +
  '  vec3 v = aGlobe; float e = smoothstep(0., 1., pr);\n' +
  '  v.xz = rot(radians(mix(72.9, -78.6, e))) * v.xz; v.yz = rot(radians(mix(19., 36., e))) * v.yz;\n' +
  '  return mk(v * .6 + vec3(uPlate.xy, 0.), vec4(mix(PERMS, CYAN, aSeed.y), .12 + .7 * smoothstep(-.15, .25, v.z)), 1.5, 0.);\n' +
  '}\n' +
  // every line written (one strand) and erased (the other), by date, oldest at the bottom
  'F helix(float pr) {\n' +
  '  vec3 v = aHelix; v.y -= mix(-1.05, 1.05, pr); v.xz = rot(uTime * .22 * uMotion + pr * 2.5) * v.xz;\n' +
  '  float w = aCommit.w; vec3 col = w < .5 || (w > 2.5 && w < 3.5) ? CYAN : w < 1.5 || w > 3.5 ? ROSE : (aCommit.z < .5 ? WHITE : VIOLET);\n' +
  '  float a = (w > 2.5 ? .32 : w > 1.5 ? .45 : .8) * smoothstep(-1.45, -.95, v.y) * smoothstep(1.45, .95, v.y) * (.45 + .55 * smoothstep(-.4, .4, v.z));\n' +
  '  return mk(v + vec3(uPlate.xy, 0.), vec4(col, a), w > 2.5 ? 1.3 : 1.7, 0.);\n' +
  '}\n' +
  'F form(int id, float pr, vec3 tex) {\n' +
  '  if (id == 1) return rain(pr); if (id == 2) return plate(tex); if (id == 3) return point(pr); if (id == 4) return timeline(pr);\n' +
  '  if (id == 5) return dust(pr); if (id == 6) return burst(pr); if (id == 7) return mesh(pr); if (id == 8) return globe(pr); if (id == 9) return helix(pr);\n' +
  '  return whisper(pr);\n' +
  '}\n' +
  'void main() {\n' +
  '  float e = uT;\n' +
  '  F a = form(uA, uPA, uA == 2 ? texture(uTexA, aGrid).rgb : vec3(0.)), b = form(uB, uPB, uB == 2 ? texture(uTexB, aGrid).rgb : vec3(0.));\n' +
  '  vec3 p = mix(a.p, b.p, e) + (aSeed.zxy * 2. - 1.) * vec3(.55, .4, .7) * sin(PI * e) * uMotion;   // the long way round, between forms\n' +
  '  vec4 c = mix(a.c, b.c, e); vSq = mix(a.sq, b.sq, e);\n' +
  '  if (uLines > .5) c = vec4(WHITE, .085 * ((uA == 1 ? 1. - e : 0.) + (uB == 1 ? e : 0.)) * step(aSeed.w, .014));\n' +
  '  c.a *= uFade;\n' +
  '  vec4 clip = uProj * vec4(p, 1.); gl_Position = clip;\n' +
  '  gl_PointSize = clamp(mix(a.s, b.s, e) * uDpr * ' + D.toFixed(4) + ' / clip.w, 1., 64.);\n' +
  '  vColor = c;\n' +
  '}\n';
  var FS = '#version 300 es\nprecision highp float;\nin vec4 vColor; in float vSq; uniform float uLines; out vec4 o;\n' +
  'void main() {\n' +
  '  float a = vColor.a;\n' +
  '  if (uLines < .5) { vec2 q = gl_PointCoord * 2. - 1.; a *= mix(smoothstep(1., .2, dot(q, q)), 1., vSq); }\n' +
  '  o = vec4(vColor.rgb * a, a * mix(.3, 1., vSq));\n' +                 // glow adds up; the era mosaic covers
  '}\n';
  var BAR = .045;                                                         // the window's title bar, as a share of the clip's height
  var QVS = '#version 300 es\nprecision highp float;\nlayout(location=0) in vec2 aCorner; uniform vec4 uPlate; uniform vec2 uPointer; uniform mat4 uProj; out vec2 vUv;\n' +
  'void main() { vec2 c = vec2(aCorner.x, aCorner.y * (1. + ' + BAR + ') - ' + BAR + '); vec2 xy = uPlate.xy + vec2((c.x - .5) * uPlate.z, (.5 - c.y) * uPlate.w); vUv = c;\n' +
  '  gl_Position = uProj * vec4(xy, (xy.x - uPlate.x) * uPointer.x * .07 + (xy.y - uPlate.y) * uPointer.y * .07, 1.); }\n';
  var QFS = '#version 300 es\nprecision mediump float;\nin vec2 vUv; uniform sampler2D uTex; uniform float uAlpha, uAspectP; out vec4 o;\n' +
  'void main() {\n' +
  '  vec3 c = texture(uTex, clamp(vUv, 0., 1.)).rgb;\n' +
  '  if (vUv.y < 0.) { vec2 q = vec2(vUv.x * uAspectP, -vUv.y / ' + BAR + '); c = vec3(.105, .14, .16);\n' +
  '    for (int i = 0; i < 3; i++) { float dd = length(vec2(q.x - .035 - float(i) * .045, (q.y - .5) * ' + BAR + ')); c = mix(c, i == 0 ? vec3(.81,.4,.47) : i == 1 ? vec3(.96,.93,.55) : vec3(.01,.85,.77), smoothstep(.011, .008, dd)); }\n' +
  '    c = mix(c, vec3(.17, .22, .25), step(abs(q.y - .5), .26) * step(.2, q.x) * step(q.x, uAspectP - .2) * .7); }\n' +
  '  vec2 d = vec2(min(vUv.x, 1. - vUv.x), min(vUv.y + ' + BAR + ', 1. - vUv.y)); float edge = smoothstep(0., .003, min(d.x, d.y * 1.6));\n' +
  '  o = vec4(c * uAlpha * edge, uAlpha * edge); }\n';

  /* the Revelation's solid: the SolidCraft helix, wearing the MaterialCraft surface (every commit hash, cut in),
     turned exactly as the particle helix is, so the particles can settle onto it */
  var HVS = '#version 300 es\nprecision highp float;\n' +
  'layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNor; layout(location=2) in float aTag;\n' +
  'uniform mat4 uProj; uniform vec4 uPlate; uniform float uPr, uTime, uMotion;\n' +
  'out vec3 vObj; out vec3 vN; out vec3 vON; out float vTag; out float vY;\n' +
  'mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }\n' +
  'void main() {\n' +
  '  vec3 p = aPos * 1e-4; vObj = p; vON = aNor; vTag = aTag;\n' +
  '  float a = uTime * .22 * uMotion + uPr * 2.5; p.y -= mix(-1.05, 1.05, uPr); p.xz = rot(a) * p.xz; vec3 n = aNor; n.xz = rot(a) * n.xz;\n' +
  '  vN = n; vY = p.y; gl_Position = uProj * vec4(p + vec3(uPlate.xy, 0.), 1.);\n' +
  '}\n';
  var HFS = '#version 300 es\nprecision highp float;\n' +
  'in vec3 vObj; in vec3 vN; in vec3 vON; in float vTag; in float vY; uniform sampler2D uCol, uNor; uniform vec2 uPointer; uniform float uAlpha; out vec4 o;\n' +
  'vec3 tint(float t) { return t < .5 ? vec3(.518,.788,.984) : t < 1.5 ? vec3(.812,.4,.475) : t < 2.5 ? vec3(.62,.86,1.) : t < 3.5 ? vec3(.93,.5,.58) : t < 4.5 ? vec3(.9,.93,.95) : vec3(.733,.549,.965); }\n' +
  'void main() {\n' +
  '  vec3 w = pow(abs(normalize(vON)), vec3(4.)); w /= w.x + w.y + w.z;\n' +   // triplanar: the hashes need no UVs
  '  vec3 q = vObj * 2.4;\n' +
  '  vec3 base = texture(uCol, q.zy).rgb * w.x + texture(uCol, q.xz).rgb * w.y + texture(uCol, q.xy).rgb * w.z;\n' +
  '  vec2 b = (texture(uNor, q.zy).xy * 2. - 1.) * w.x + (texture(uNor, q.xz).xy * 2. - 1.) * w.y + (texture(uNor, q.xy).xy * 2. - 1.) * w.z;\n' +
  '  vec3 n = normalize(normalize(vN) + vec3(b, 0.) * .6);\n' +
  '  vec3 L = normalize(vec3(uPointer * 1.4 + vec2(.4, .5), 1.)), V = vec3(0., 0., 1.), H = normalize(L + V);\n' +
  '  float d = max(dot(n, L), 0.), sp = pow(max(dot(n, H), 0.), 42.), rim = pow(1. - max(dot(n, V), 0.), 3.);\n' +
  '  vec3 c = base * tint(vTag) * (.28 + 1.1 * d) + vec3(sp * .7) + tint(vTag) * rim * .55;\n' +
  '  float a = uAlpha * smoothstep(-1.45, -.95, vY) * smoothstep(1.45, .95, vY);\n' +
  '  o = vec4(c * a, a);\n' +
  '}\n';

  function shader(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  function program(v, f) {
    var p = gl.createProgram(); gl.attachShader(p, shader(gl.VERTEX_SHADER, v)); gl.attachShader(p, shader(gl.FRAGMENT_SHADER, f)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}; p.u = function (n) { return n in u ? u[n] : (u[n] = gl.getUniformLocation(p, n)); }; return p;
  }
  var P, Q;
  var Hp;
  try { P = program(VS, FS); Q = program(QVS, QFS); Hp = program(HVS, HFS); } catch (err) { console.warn('[uncertain] stage off:', err.message); root.classList.remove('u-live'); root.classList.add('u-flat'); return; }

  /* ---- particles: where each one sits in every form that is not computed on the fly ---- */
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var vao = gl.createVertexArray(), lineVao = gl.createVertexArray(), quadVao = gl.createVertexArray(), ready = false;
  function buffer(data, loc, size, target) {
    gl.bindVertexArray(target); var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  var worldDots = 0;
  function build(log, land) {
    var r = rng(20200512), grid = new Float32Array(N * 2), seed = new Float32Array(N * 4), commit = new Float32Array(N * 4), sphere = new Float32Array(N * 3), helix = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) { grid[i * 2] = (i % GW + .5) / GW; grid[i * 2 + 1] = (Math.floor(i / GW) + .5) / GH; for (var k = 0; k < 4; k++) seed[i * 4 + k] = r(); }
    // commits: particles in proportion to the lines each touched, handed out in order, so the top of a page becomes the oldest commit
    var cs = log.commits, last = cs[cs.length - 1][0], w = cs.map(function (c) { return 1 + Math.log2(1 + c[3] + c[4]); }), W = w.reduce(function (a, b) { return a + b; }, 0);
    var day = {}, base = cs.map(function (c, k) { var b = day[c[0]] || 0; day[c[0]] = b + w[k]; return b; }), tallest = Math.max.apply(null, Object.keys(day).map(function (d) { return day[d]; }));
    var k = 0, acc = w[0], first = 0;
    for (i = 0; i < N; i++) {
      var f = (i + .5) / N * W; while (f > acc && k < cs.length - 1) { k++; first = i; acc += w[k]; }
      var c = cs[k], n = Math.max(1, Math.round(w[k] / W * N)), u = Math.min(1, (i - first + .5) / n);
      commit[i * 4] = c[0] / last; commit[i * 4 + 1] = (base[k] + u * w[k]) / tallest; commit[i * 4 + 2] = c[2];
      var share = c[3] + c[4] ? c[3] / (c[3] + c[4]) : .5, strand = u < .8 * share ? 0 : u < .8 ? 1 : 2, y = -1.5 + 3 * c[0] / last, R = .4, th;
      if (seed[i * 4 + 3] < .3) { strand = seed[i * 4] < .5 ? 3 : 4; y = -1.5 + 3 * seed[i * 4 + 1]; }   // the backbone: both strands, unbroken, through the quiet too
      th = y * 4.2 + (strand === 1 || strand === 4 ? Math.PI : 0);
      commit[i * 4 + 3] = strand;
      if (strand === 2) { var t = r() * 2 - 1; helix[i * 3] = Math.cos(th) * R * t; helix[i * 3 + 2] = Math.sin(th) * R * t; }
      else { var spread = strand > 2 ? .025 : .06; helix[i * 3] = Math.cos(th) * R + (r() - .5) * spread; helix[i * 3 + 2] = Math.sin(th) * R + (r() - .5) * spread; y += (r() - .5) * (strand > 2 ? .01 : .03); }
      helix[i * 3 + 1] = y;
    }
    // the globe: the about page's land dots, a few particles to each, jittered a little
    for (i = 0; i < N; i++) {
      var j = (i * 7919) % (land.length / 2), jit = j < worldDots ? 2 : .7, lon = (land[j * 2] / 100 + (r() - .5) * jit) * Math.PI / 180, lat = (land[j * 2 + 1] / 100 + (r() - .5) * jit) * Math.PI / 180;
      sphere[i * 3] = Math.cos(lat) * Math.sin(lon); sphere[i * 3 + 1] = Math.sin(lat); sphere[i * 3 + 2] = Math.cos(lat) * Math.cos(lon);
    }
    [vao, lineVao].forEach(function (v, line) {
      var dup = function (a, s) { if (!line) return a; var o = new Float32Array(a.length * 2); for (var i = 0; i < N; i++) for (var k = 0; k < s; k++) { o[i * 2 * s + k] = a[i * s + k]; o[(i * 2 + 1) * s + k] = a[i * s + k]; } return o; };
      buffer(dup(grid, 2), 0, 2, v); buffer(dup(seed, 4), 1, 4, v); buffer(dup(commit, 4), 2, 4, v); buffer(dup(sphere, 3), 3, 3, v); buffer(dup(helix, 3), 4, 3, v);
      var end = new Float32Array(line ? N * 2 : N); if (line) for (i = 0; i < N; i++) end[i * 2 + 1] = 1; buffer(end, 5, 1, v);
    });
    buffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), 0, 2, quadVao);
    gl.bindVertexArray(null); ready = true;
  }

  /* the solid helix loads once the reader is past the middle of the post */
  var solid = null, solidAsked = false;
  function texFrom(src) {
    var t = gl.createTexture(), img = new Image();
    img.onload = function () { gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); t.ready = true; };
    img.src = src; return t;
  }
  function loadSolid() {
    solidAsked = true;
    fetch(BASE + 'helix.bin').then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      var h = new Uint32Array(buf, 0, 2), V = h[0], I = h[1], off = 8, al = function (n) { return n + (-n & 3); };
      var pos = new Int16Array(buf, off, V * 3); off += al(V * 6);
      var nor = new Int8Array(buf, off, V * 3); off += al(V * 3);
      var tag = new Uint8Array(buf, off, V); off += al(V);
      var idx = new Uint16Array(buf, off, I);
      var v = gl.createVertexArray(); gl.bindVertexArray(v);
      [[pos, 0, gl.SHORT, false], [nor, 1, gl.BYTE, true], [tag, 2, gl.UNSIGNED_BYTE, false]].forEach(function (x) {
        var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, x[0], gl.STATIC_DRAW);
        gl.enableVertexAttribArray(x[1]); gl.vertexAttribPointer(x[1], x[0] === tag ? 1 : 3, x[2], x[3], 0, 0);
      });
      var e = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      gl.bindVertexArray(null);
      solid = { vao: v, count: I, col: texFrom(BASE + 'helix-color.webp'), nor: texFrom(BASE + 'helix-normal.webp') };
    }).catch(function (err) { console.warn('[uncertain] no solid helix:', err); });
  }

  /* ---- the eras: one <video> and one texture each, loaded when the reader gets near ---- */
  var eras = {};
  function era(name) {
    if (eras[name]) return eras[name];
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([23, 31, 36, 255]));
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(function (p) { gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR); });
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (p) { gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE); });
    var e = eras[name] = { tex: t, video: null, still: new Image(), live: false };
    e.still.onload = function () { if (!e.live) { gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, e.still); } };
    e.still.src = BASE + 'eras/' + name + '.jpg';
    if (!still) {
      var v = e.video = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.crossOrigin = 'anonymous';
      v.src = BASE + 'eras/' + name + '.mp4';
    }
    return e;
  }
  function wake(name, on) {
    var e = era(name); if (!e.video) return e;
    if (on && e.video.paused) e.video.play().catch(function () {});
    if (!on && !e.video.paused) e.video.pause();
    if (on && e.video.readyState >= 2) { e.live = true; gl.bindTexture(gl.TEXTURE_2D, e.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, e.video); }
    return e;
  }

  /* ---- reading the page ---- */
  var B = beats.map(function (el) { return { el: el, scene: SCENES[el.dataset.scene] || 0, clip: el.dataset.clip, from: +el.dataset.from || 0, to: +el.dataset.to || 0, }; });
  function position() {                                                     // beat index + how far through it the middle of the window is
    var mid = innerHeight * .5;
    for (var i = 0; i < B.length; i++) { var r = B[i].el.getBoundingClientRect(); if (r.bottom > mid) return i + Math.max(0, Math.min(1, (mid - r.top) / r.height)); }
    return B.length;
  }

  var START = null, LAST = 1648, LOG = [];
  function latest(d) { var lo = 0, hi = LOG.length - 1, k = -1; while (lo <= hi) { var m = (lo + hi) >> 1; if (LOG[m][0] <= d) { k = m; lo = m + 1; } else hi = m - 1; } return k < 0 ? null : LOG[k]; }
  function date(d) { var t = new Date(START.getTime() + d * 864e5); return t.toISOString().slice(0, 10); }
  function month(d) { return new Date(START.getTime() + d * 864e5).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }); }

  /* ---- camera ---- */
  var w = 0, h = 0, dpr = 1, aspect = 1, proj = new Float32Array(16), plate = [0, 0, 1, 1];
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75); w = innerWidth; h = innerHeight; aspect = w / h;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); gl.viewport(0, 0, cv.width, cv.height);
    var f = D, n = .05, far = 30;                                            // fovy = 2 atan(1 / D), so z = 0 spans the window
    proj.fill(0); proj[0] = f / aspect; proj[5] = f; proj[10] = (far + n) / (n - far); proj[11] = -1;
    proj[14] = (far + n) / (n - far) * -D + 2 * far * n / (n - far); proj[15] = D;   // perspective times a step back of D
    var wide = aspect > 1.15, W = wide ? Math.min(aspect * 1.02, 2.1) : aspect * 1.86;   // eras sit right of the words on a wide screen, above them on a narrow one
    plate = wide ? [aspect - W / 2 - aspect * .07, .02, W, W / 1.6] : [0, .42, W, W / 1.6];
    root.style.setProperty('--u-plate-left', wide ? (0.5 + (plate[0] - W / 2) / (2 * aspect)) * 100 + 'vw' : '0');
  }

  /* ---- the frame ---- */
  var s = 0, px = 0, py = 0, tx = 0, ty = 0, t0 = performance.now(), active = -1;
  addEventListener('pointermove', function (e) { tx = e.clientX / w * 2 - 1; ty = 1 - e.clientY / h * 2; }, { passive: true });
  function set(p, name, v) { var l = p.u(name); if (typeof v === 'number') gl.uniform1f(l, v); else if (v.length === 2) gl.uniform2fv(l, v); else if (v.length === 4) gl.uniform4fv(l, v); else gl.uniformMatrix4fv(l, false, v); }
  function frame(now) {
    requestAnimationFrame(frame); if (document.hidden || !ready) return;
    var target = position(); s = still ? target : s + (target - s) * .12; px += (tx - px) * .05; py += (ty - py) * .05;
    var u = s - .75, i0 = Math.floor(u), t = Math.max(0, Math.min(1, (u - i0) / .5)); t = t * t * (3 - 2 * t);
    var ia = Math.max(0, Math.min(B.length - 1, i0)), ib = Math.max(0, Math.min(B.length - 1, i0 + 1)), A = B[ia], Bb = B[ib];
    var pa = Math.max(0, Math.min(1, s - ia)), pb = Math.max(0, Math.min(1, s - ib));
    if (i0 < 0) { t = 0; pa = Math.max(0, s); }
    var cur = Math.max(0, Math.min(B.length - 1, Math.floor(s)));
    if (cur !== active) { if (B[active]) B[active].el.classList.remove('is-on'); B[cur].el.classList.add('is-on'); active = cur; }
    B[cur].el.style.setProperty('--p', (s - cur).toFixed(3));
    // only the one or two eras on screen play; the next one starts loading early
    var playing = {}; [[A, 1 - t], [Bb, t]].forEach(function (x) { if (x[0].clip && x[1] > .001) playing[x[0].clip] = 1; });
    if (B[cur + 1] && B[cur + 1].clip) era(B[cur + 1].clip);
    Object.keys(eras).forEach(function (n) { if (!playing[n]) wake(n, false); });
    var ea = A.clip ? wake(A.clip, true) : null, eb = Bb.clip ? wake(Bb.clip, true) : null;
    // what the readout says, and when December lights the dust
    var tl = A.scene === 4 || A.scene === 5 ? A : Bb, tp = tl === A ? pa : pb, dd = tl.from + (tl.to - tl.from) * tp, flash = 0;
    if (START && (tl.scene === 4 || tl.scene === 5) && tl.to) {
      hud.textContent = tl.scene === 5 ? 'day ' + Math.max(1, Math.round(dd - tl.from)) + ' of ' + (tl.to - tl.from) + '  ·  ' + month(dd)
        : date(dd) + '  ·  ' + ((latest(dd) || [0, 0, 0, 0, 0, ''])[5] || '');           // the newest commit on or before that day
      if (tl.scene === 5) { var dec = Math.round(dd); var m = new Date(START.getTime() + dec * 864e5).getUTCMonth(); flash = m === 11 ? 1 : 0; }
      hud.classList.add('on'); hud.classList.toggle('dec', flash > 0);
    } else hud.classList.remove('on', 'dec');
    gl.clearColor(23 / 255, 31 / 255, 36 / 255, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    var crisp = A.scene === 2 && t < .1 ? 1 - t / .1 : Bb.scene === 2 && t > .9 ? (t - .9) / .1 : 0;
    if (!solidAsked && s > B.length * .6) loadSolid();
    var hx = (A.scene === 9 ? 1 - t : 0) + (Bb.scene === 9 ? t : 0), hp = A.scene === 9 ? pa : pb;
    var form = solid && solid.col.ready && solid.nor.ready ? hx * (still ? 1 : (function (x) { return x * x * (3 - 2 * x); })(Math.max(0, Math.min(1, (hp - .2) / .3)))) : 0;   // the particles settle, then the solid takes their place
    var time = still ? 0 : (now - t0) / 1000;
    gl.useProgram(P);
    gl.uniform1i(P.u('uA'), A.scene); gl.uniform1i(P.u('uB'), Bb.scene);
    [['uT', t], ['uPA', pa], ['uPB', pb], ['uTime', time], ['uAspect', aspect], ['uPx', h / 2], ['uDpr', dpr], ['uMotion', still ? 0 : 1],
     ['uDay', dd / LAST], ['uFlash', flash * (.6 + .4 * Math.sin(time * 3))], ['uFade', (1 - crisp * .97) * (1 - form * .8)], ['uPointer', [px, py]], ['uPlate', plate], ['uProj', proj]].forEach(function (x) { set(P, x[0], x[1]); });
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ea ? ea.tex : null); gl.uniform1i(P.u('uTexA'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, eb ? eb.tex : null); gl.uniform1i(P.u('uTexB'), 1);
    if (A.scene === 1 || Bb.scene === 1) { set(P, 'uLines', 1); gl.bindVertexArray(lineVao); gl.drawArrays(gl.LINES, 0, N * 2); }
    set(P, 'uLines', 0); gl.bindVertexArray(vao); gl.drawArrays(gl.POINTS, 0, N);
    if (crisp > 0) {                                                        // settled on an era: the clip itself, sharp
      var e = A.scene === 2 && t < .5 ? ea : eb;
      gl.useProgram(Q); set(Q, 'uPlate', plate); set(Q, 'uAspectP', 1.6); set(Q, 'uPointer', [px, py]); set(Q, 'uProj', proj); set(Q, 'uAlpha', crisp);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, e.tex); gl.uniform1i(Q.u('uTex'), 0);
      gl.bindVertexArray(quadVao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    if (form > .001) {
      gl.enable(gl.DEPTH_TEST); gl.clear(gl.DEPTH_BUFFER_BIT); gl.useProgram(Hp);
      [['uProj', proj], ['uPlate', plate], ['uPr', hp], ['uTime', time], ['uMotion', still ? 0 : 1], ['uPointer', [px, py]], ['uAlpha', form]].forEach(function (x) { set(Hp, x[0], x[1]); });
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, solid.col); gl.uniform1i(Hp.u('uCol'), 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, solid.nor); gl.uniform1i(Hp.u('uNor'), 1);
      gl.bindVertexArray(solid.vao); gl.drawElements(gl.TRIANGLES, solid.count, gl.UNSIGNED_SHORT, 0); gl.disable(gl.DEPTH_TEST);
    }
    gl.bindVertexArray(null);
  }

  size(); addEventListener('resize', size);
  Promise.all([fetch(BASE + 'commits.json').then(function (r) { return r.json(); }), fetch(cv.dataset.globe).then(function (r) { return r.json(); })])
    .then(function (d) {
      START = new Date(d[0].start + 'T00:00:00Z'); LOG = d[0].commits; LAST = LOG[LOG.length - 1][0];
      var g = d[1], land = g.dots.concat(g.regions.india.dots, g.regions.usa.dots); worldDots = g.dots.length / 2;
      build(d[0], land); requestAnimationFrame(frame);
    })
    .catch(function (err) { console.warn('[uncertain] stage off:', err); root.classList.remove('u-live'); root.classList.add('u-flat'); });
})();
