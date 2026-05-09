(function () {
  var tags = [].slice.call(document.querySelectorAll('.tv-tag-row'));
  var files = [].slice.call(document.querySelectorAll('.tv-file-row'));
  var scroller = document.getElementById('tv-file-scroll');
  var bar = document.getElementById('tv-scrollbar');
  var search = document.getElementById('tv-search');
  var tagWin = document.getElementById('tv-tags-window');
  var fileWin = document.getElementById('tv-files-window');
  var error = document.getElementById('tv-404');
  var themeNames = ['dark', 'light', 'a11y', 'intern'];
  var state = { panel: 'files', tag: 'all', tagIndex: 0, fileIndex: 0 };
  var themeDropdown = document.querySelector('.tv-menu-dropdown');
  var themeMenuButton = document.querySelector('.tv-menu-button');
  var themeOptions = [].slice.call(document.querySelectorAll('[data-tv-theme-option]'));

  function setTheme(theme) {
    if (themeNames.indexOf(theme) < 0) theme = 'intern';
    if (theme !== 'intern') {
      try { localStorage.setItem('theme', theme); } catch (e) {}
      location.href = '/';
      return;
    }
    document.body.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    themeOptions.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-tv-theme-option') === theme);
    });
  }

  function cycleTheme() {
    var current = document.body.getAttribute('data-theme') || 'intern';
    setTheme(themeNames[(themeNames.indexOf(current) + 1) % themeNames.length]);
  }

  function sourceDestination() {
    return document.body.getAttribute('data-source-url') || 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/preview.html';
  }

  function focusSearch() {
    if (search) search.focus();
  }

  function cycleTag() {
    if (!tags.length) return;
    state.tagIndex = (state.tagIndex + 1) % tags.length;
    tags[state.tagIndex].click();
  }

  function closeThemeMenu(restoreFocus) {
    if (!themeDropdown) return;
    themeDropdown.classList.remove('is-open');
    if (!restoreFocus && themeDropdown.contains(document.activeElement)) document.activeElement.blur();
    if (themeMenuButton) {
      themeMenuButton.setAttribute('aria-expanded', 'false');
      if (restoreFocus) themeMenuButton.focus();
    }
  }

  function openThemeMenu(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    if (!themeDropdown) return;
    themeDropdown.classList.add('is-open');
    if (themeMenuButton) themeMenuButton.setAttribute('aria-expanded', 'true');
    var active = themeOptions.find(function (button) { return button.classList.contains('is-active'); }) || themeOptions[0];
    if (active) active.focus();
  }

  function themeMenuHasFocus() {
    return themeDropdown && themeDropdown.contains(document.activeElement);
  }

  function focusThemeOption(step) {
    if (!themeOptions.length) return;
    var current = themeOptions.indexOf(document.activeElement);
    var next = current < 0 ? 0 : (current + step + themeOptions.length) % themeOptions.length;
    themeOptions[next].focus();
  }

  function cursor() {
    var node = document.createElement('span');
    node.className = 'tv-cursor';
    node.setAttribute('aria-hidden', 'true');
    return node;
  }

  function shownFiles() {
    return files.filter(function (row) { return row.style.display !== 'none'; });
  }

  function setUrl() {
    if (tags.length) {
      history.replaceState(null, '', state.tag === 'all' ? location.pathname : location.pathname + '?tag=' + encodeURIComponent(state.tag));
    }
  }

  function updateBar() {
    if (!bar || !scroller) return;
    var lines = Math.max(3, Math.floor(scroller.clientHeight / 18));
    var max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    var thumb = Math.min(lines - 1, Math.round(scroller.scrollTop / max * (lines - 1)));
    bar.innerHTML = '';
    for (var i = 0; i < lines; i++) {
      var cell = document.createElement('span');
      cell.textContent = i === thumb ? '▓' : '▒';
      if (i === thumb) cell.className = 'is-thumb';
      bar.appendChild(cell);
    }
  }

  function render() {
    document.querySelectorAll('.tv-cursor').forEach(function (node) { node.remove(); });
    tags.forEach(function (row, i) {
      var active = row.getAttribute('data-tag') === state.tag;
      row.classList.toggle('is-active', active);
      row.querySelector('.tv-row-prefix').textContent = active ? '►' : ' ';
      if (state.panel === 'tags' && i === state.tagIndex) row.appendChild(cursor());
    });
    var visible = shownFiles();
    if (state.fileIndex >= visible.length) state.fileIndex = Math.max(0, visible.length - 1);
    files.forEach(function (row) { row.classList.remove('is-selected'); });
    if (visible[state.fileIndex]) {
      visible[state.fileIndex].classList.add('is-selected');
      if (state.panel === 'files') visible[state.fileIndex].querySelector('a').appendChild(cursor());
      visible[state.fileIndex].scrollIntoView({ block: 'nearest' });
    }
    updateBar();
  }

  function setPanel(name) {
    state.panel = name;
    if (tagWin) tagWin.classList.toggle('is-active', name === 'tags');
    if (fileWin) fileWin.classList.toggle('is-active', name === 'files');
    render();
  }

  function filter(tag) {
    var query = search ? search.value.toLowerCase() : '';
    state.tag = tag;
    files.forEach(function (row) {
      var tagMatch = tag === 'all' || row.getAttribute('data-category') === tag;
      var textMatch = !query || row.textContent.toLowerCase().indexOf(query) !== -1;
      row.style.display = tagMatch && textMatch ? '' : 'none';
    });
    state.fileIndex = 0;
    render();
    setUrl();
  }

  tags.forEach(function (row, i) {
    row.addEventListener('click', function () {
      state.tagIndex = i;
      filter(row.getAttribute('data-tag'));
      setPanel('tags');
    });
  });

  files.forEach(function (row) {
    row.querySelector('a').addEventListener('focus', function () {
      state.fileIndex = shownFiles().indexOf(row);
      setPanel('files');
    });
    row.addEventListener('mouseenter', function () {
      state.fileIndex = shownFiles().indexOf(row);
      render();
    });
  });

  if (search) search.addEventListener('input', function () { filter(state.tag); });
  if (scroller) scroller.addEventListener('scroll', updateBar);
  if (bar) {
    bar.addEventListener('click', function (e) {
      var rect = bar.getBoundingClientRect();
      scroller.scrollTop = (e.clientY - rect.top) / rect.height * (scroller.scrollHeight - scroller.clientHeight);
    });
  }

  if (themeMenuButton) {
    themeMenuButton.setAttribute('aria-expanded', 'false');
    themeMenuButton.addEventListener('click', function (event) {
      event.preventDefault();
      openThemeMenu();
    });
  }

  themeOptions.forEach(function (button) {
    button.addEventListener('click', function () {
      closeThemeMenu(false);
      setTheme(button.getAttribute('data-tv-theme-option'));
    });
  });

  document.addEventListener('click', function (event) {
    if (themeDropdown && !themeDropdown.contains(event.target)) closeThemeMenu(false);
  });

  document.querySelectorAll('[data-tv-action="theme"]').forEach(function (button) {
    button.addEventListener('click', openThemeMenu);
  });

  document.querySelectorAll('[data-tv-action="search"]').forEach(function (button) {
    button.addEventListener('click', focusSearch);
  });

  document.querySelectorAll('[data-tv-action="tag"]').forEach(function (button) {
    button.addEventListener('click', cycleTag);
  });

  function isTyping(event) {
    var node = event.target;
    if (!node) return false;
    var tag = node.tagName;
    return node.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  function hasShortcutModifier(event) {
    return event.altKey || event.ctrlKey || event.metaKey;
  }

  function navigateKey(event) {
    var key = event.key.toLowerCase();
    if (key === 'p') return '/preview.html';
    if (key === 'a') return '/about/';
    if (key === 'd') return '/disclaimer/';
    if (key === 'h') return '/keyboard.html';
    return '';
  }

  function handleThemeMenuKey(event) {
    var key = event.key || '';
    if (!isTyping(event) && !hasShortcutModifier(event) && key.toLowerCase() === 't') {
      event.preventDefault();
      openThemeMenu();
      return true;
    }
    if (!themeMenuHasFocus()) return false;
    if (key === 'Escape') {
      event.preventDefault();
      closeThemeMenu(true);
      return true;
    }
    if (key === 'ArrowDown') {
      event.preventDefault();
      focusThemeOption(1);
      return true;
    }
    if (key === 'ArrowUp') {
      event.preventDefault();
      focusThemeOption(-1);
      return true;
    }
    return false;
  }

  function handleStatusKey(event) {
    if (isTyping(event) || hasShortcutModifier(event)) return false;
    if (event.key === '1' || event.key === 'F1') {
      event.preventDefault();
      location.href = '/keyboard.html';
      return true;
    }
    if (event.key === '2' || event.key === 'F2') {
      event.preventDefault();
      location.href = '/about/';
      return true;
    }
    if (event.key === '3' || event.key === 'F3') {
      event.preventDefault();
      location.href = sourceDestination();
      return true;
    }
    if (event.key === '4' || event.key === 'F4') {
      event.preventDefault();
      openThemeMenu();
      return true;
    }
    if (event.key === '5' || event.key === 'F5') {
      event.preventDefault();
      focusSearch();
      return true;
    }
    if (event.key === '7' || event.key === 'F7') {
      event.preventDefault();
      cycleTag();
      return true;
    }
    if (event.key === '0' || event.key === 'F10') {
      event.preventDefault();
      location.href = '/disclaimer/';
      return true;
    }
    return false;
  }

  document.addEventListener('keydown', function (e) {
    if (handleThemeMenuKey(e)) return;
    if (handleStatusKey(e)) return;
    var destination = isTyping(e) ? '' : navigateKey(e);
    if (destination) {
      e.preventDefault();
      location.href = destination;
    } else if (error) {
      e.preventDefault();
      location.href = '/';
    } else if (e.key === 'Tab' && tags.length) {
      e.preventDefault();
      setPanel(state.panel === 'files' ? 'tags' : 'files');
    } else if (e.key === 'ArrowDown' && tags.length) {
      e.preventDefault();
      if (state.panel === 'tags') state.tagIndex = Math.min(tags.length - 1, state.tagIndex + 1);
      else state.fileIndex = Math.min(shownFiles().length - 1, state.fileIndex + 1);
      render();
    } else if (e.key === 'ArrowUp' && tags.length) {
      e.preventDefault();
      if (state.panel === 'tags') state.tagIndex = Math.max(0, state.tagIndex - 1);
      else state.fileIndex = Math.max(0, state.fileIndex - 1);
      render();
    } else if (e.key === 'Enter' && tags.length) {
      e.preventDefault();
      if (state.panel === 'tags') tags[state.tagIndex].click();
      else if (shownFiles()[state.fileIndex]) shownFiles()[state.fileIndex].querySelector('a').click();
    }
  });

  if (tags.length) {
    var params = new URLSearchParams(location.search);
    var requested = params.get('tag') || 'all';
    var focusRequested = params.get('search') === '1';
    var first = tags.find(function (row) { return row.getAttribute('data-tag') === requested; });
    if (first) state.tagIndex = tags.indexOf(first);
    filter(first ? requested : 'all');
    setPanel('files');
    if (focusRequested) focusSearch();
  }
  setTheme('intern');
})();
