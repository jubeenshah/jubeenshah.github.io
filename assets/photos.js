/* Photos — keyboard + filter behaviour for /photos/ (feh -t) and single photos (feh <file>).
   Markup: photos/index.html, _layouts/photo.html · Styles: assets/photos.css

   Grid:   ←→↑↓ or hjkl move · Enter open · x exif pane · g/G first/last · Esc close pane
   Single: ←/→ or p/n prev/next · q or Esc back to the grid (selection restored via #hash)

   Letters already claimed by --the-intern-experience (h, p) step aside in that theme;
   arrows always work. Nothing here fires while typing in a field. */
(function () {
  var page = document.getElementById('ph-page');
  if (!page) return;

  var intern = document.body.classList.contains('intern-mode') ||
    safeGet(localStorage, 'theme') === 'intern';

  function safeGet(store, key) {
    try { return store.getItem(key); } catch (e) { return null; }
  }
  function safeSet(store, key, value) {
    try { store.setItem(key, value); } catch (e) { /* private mode: no-op */ }
  }
  function isTyping(e) {
    var n = e.target;
    if (!n) return false;
    return n.isContentEditable || n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT';
  }
  function hasModifier(e) {
    return e.altKey || e.ctrlKey || e.metaKey;
  }

  /* ---------- single photo ---------- */
  if (page.classList.contains('ph-detail')) {
    var prevUrl = page.getAttribute('data-prev');
    var nextUrl = page.getAttribute('data-next');
    var gridUrl = page.getAttribute('data-grid');

    document.addEventListener('keydown', function (e) {
      if (isTyping(e) || hasModifier(e)) return;
      var k = e.key;
      var dest = '';
      if (k === 'ArrowLeft' || (k === 'p' && !intern)) dest = prevUrl;
      else if (k === 'ArrowRight' || k === 'n') dest = nextUrl;
      else if (k === 'q' || k === 'Escape') dest = gridUrl;
      else return;
      e.preventDefault();
      if (dest) location.href = dest;
    });
    return;
  }

  /* ---------- grid ---------- */
  var grid = document.getElementById('ph-grid');
  if (!grid) return; // empty gallery

  var body = document.getElementById('ph-body');
  var cmd = document.getElementById('ph-cmd');
  var status = document.getElementById('ph-status');
  var exifPane = document.getElementById('ph-exif');
  var exifCmd = document.getElementById('ph-exif-cmd');
  var exifOut = document.getElementById('ph-exif-out');
  var countOut = document.getElementById('ph-count');
  var countCmd = document.getElementById('ph-count-cmd');
  var filters = Array.prototype.slice.call(document.querySelectorAll('.ph-filter'));
  var cells = Array.prototype.slice.call(grid.querySelectorAll('.ph-cell'));

  var selected = -1;      // index into cells
  var exifOpen = false;
  var activeAlbum = 'all';

  function visible() {
    return cells.filter(function (c) { return !c.classList.contains('hidden'); });
  }

  // cells per row, read from the live layout so it tracks the viewport
  function columns() {
    var v = visible();
    if (v.length < 2) return 1;
    var top = v[0].offsetTop;
    var n = 1;
    for (var i = 1; i < v.length; i++) {
      if (v[i].offsetTop === top) n++; else break;
    }
    return n;
  }

  function data(cell, key) {
    return cell.getAttribute('data-' + key) || '';
  }

  function span(cls, text) {
    var s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  }

  // "[3/13] montenegro/kotor-bay.jpg  1920x1280  Hasselblad X2D 100C · 25 mm · f/2.8 · 1/250 · ISO 800"
  function renderStatus(cell) {
    status.textContent = '';
    if (!cell) return;
    var v = visible();
    status.appendChild(span('ph-status-idx', '[' + (v.indexOf(cell) + 1) + '/' + v.length + '] '));
    status.appendChild(span('ph-status-file', data(cell, 'file')));
    var meta = [data(cell, 'size')];
    var shot = [data(cell, 'camera'), data(cell, 'film'), data(cell, 'focal'), data(cell, 'aperture'), data(cell, 'shutter')]
      .filter(Boolean);
    if (data(cell, 'iso')) shot.push('ISO ' + data(cell, 'iso'));
    if (shot.length) meta.push(shot.join(' · '));
    meta.filter(Boolean).forEach(function (m) {
      status.appendChild(span('ph-status-sep', '  '));
      status.appendChild(document.createTextNode(m));
    });
  }

  function pad(key) {
    return (key + '                ').slice(0, 16);
  }

  function renderExif(cell) {
    if (!cell) return;
    var file = data(cell, 'file');
    exifCmd.textContent = 'exiftool ' + file;
    var rows = [
      ['File Name', file.split('/').pop()],
      ['Directory', '~/photos/' + data(cell, 'album')],
      ['Image Size', data(cell, 'size')],
      ['Date/Time', data(cell, 'date')],
      ['Title', data(cell, 'title')],
      ['Location', data(cell, 'location')],
      ['Camera', data(cell, 'camera')],
      ['Lens', data(cell, 'lens')],
      ['Film', data(cell, 'film')],
      ['Focal Length', data(cell, 'focal')],
      ['Aperture', data(cell, 'aperture')],
      ['Shutter Speed', data(cell, 'shutter')],
      ['ISO', data(cell, 'iso')],
      ['SHA256', data(cell, 'sha256')]
    ].filter(function (r) { return r[1]; });
    rows.push(['GPS Position', '(stripped)']);
    exifOut.textContent = '';
    rows.forEach(function (r, i) {
      exifOut.appendChild(span('ph-k', pad(r[0])));
      exifOut.appendChild(document.createTextNode(': ' + r[1] + (i < rows.length - 1 ? '\n' : '')));
    });
  }

  function select(cell, opts) {
    opts = opts || {};
    if (selected >= 0) {
      cells[selected].classList.remove('selected');
      cells[selected].removeAttribute('aria-current');
    }
    selected = cells.indexOf(cell);
    if (selected < 0) {
      renderStatus(null);
      return;
    }
    cell.classList.add('selected');
    cell.setAttribute('aria-current', 'true');
    renderStatus(cell);
    if (exifOpen) renderExif(cell);
    if (opts.scroll && cell.scrollIntoView) {
      cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    if (opts.hash && window.history && history.replaceState) {
      history.replaceState(null, '', '#' + cell.id);
    }
  }

  function move(delta) {
    var v = visible();
    if (!v.length) return;
    var cur = selected >= 0 ? v.indexOf(cells[selected]) : -1;
    var next = cur < 0 ? 0 : Math.min(Math.max(cur + delta, 0), v.length - 1);
    select(v[next], { scroll: true, hash: true });
  }

  function jump(toEnd) {
    var v = visible();
    if (!v.length) return;
    select(v[toEnd ? v.length - 1 : 0], { scroll: true, hash: true });
  }

  function open() {
    if (selected >= 0) location.href = cells[selected].href;
  }

  function toggleExif(force) {
    exifOpen = typeof force === 'boolean' ? force : !exifOpen;
    if (exifOpen) {
      if (selected < 0) move(0);
      renderExif(cells[selected]);
      exifPane.hidden = false;
      exifPane.scrollIntoView({ block: 'nearest' });
    } else {
      exifPane.hidden = true;
    }
  }

  function applyFilter(album) {
    activeAlbum = album;
    filters.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-album') === album);
    });
    cells.forEach(function (c) {
      c.classList.toggle('hidden', album !== 'all' && data(c, 'album') !== album);
    });
    var v = visible();
    countOut.textContent = String(v.length);
    countCmd.textContent = 'ls ~/photos/' + (album === 'all' ? '*' : album) + '/*.jpg | wc -l';
    if (selected < 0 || cells[selected].classList.contains('hidden')) {
      select(v[0] || null, {});
    } else {
      renderStatus(cells[selected]);
    }
  }

  /* ----- events ----- */
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      applyFilter(b.getAttribute('data-album'));
      b.blur();
    });
  });

  cells.forEach(function (c) {
    c.addEventListener('mouseenter', function () { select(c, {}); });
    c.addEventListener('focus', function () { select(c, {}); });
  });

  document.addEventListener('keydown', function (e) {
    if (isTyping(e) || hasModifier(e)) return;
    var k = e.key;
    var handled = true;
    switch (k) {
      case 'ArrowLeft': move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'ArrowUp': move(-columns()); break;
      case 'ArrowDown': move(columns()); break;
      case 'l': move(1); break;
      case 'j': move(columns()); break;
      case 'k': move(-columns()); break;
      case 'h': if (intern) handled = false; else move(-1); break;
      case 'g': case 'Home': jump(false); break;
      case 'G': case 'End': jump(true); break;
      case 'Enter': if (document.activeElement === document.body || grid.contains(document.activeElement)) open(); else handled = false; break;
      case 'x': toggleExif(); break;
      case 'Escape': if (exifOpen) toggleExif(false); else handled = false; break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  });

  /* ----- boot: type the command (once per session), then reveal and select ----- */
  function reveal() {
    if (body) body.classList.remove('is-pending');
    applyFilter('all');
    var target = null;
    if (location.hash.length > 1) {
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { target = null; }
    }
    if (target && target.classList.contains('ph-cell')) {
      select(target, { scroll: true });
    } else {
      select(visible()[0] || null, {});
    }
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cmd || intern || reduced || safeGet(sessionStorage, 'ph-typed')) {
    reveal();
    return;
  }

  var text = cmd.textContent;
  cmd.textContent = '';
  if (body) body.classList.add('is-pending');
  var i = 0;
  (function tick() {
    if (i < text.length) {
      cmd.textContent += text.charAt(i++);
      setTimeout(tick, 35);
    } else {
      safeSet(sessionStorage, 'ph-typed', '1');
      setTimeout(reveal, 250);
    }
  })();
})();
