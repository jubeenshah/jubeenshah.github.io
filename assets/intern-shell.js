(function () {
  if (localStorage.getItem('theme') !== 'intern') return;
  if (document.body.classList.contains('intern-mode')) return;

  var themeNames = ['dark', 'light', 'a11y', 'intern'];
  var themeLabels = {
    dark: '--dark',
    light: '--light',
    a11y: '--colour-blind-chums',
    intern: '--the-intern-experience'
  };
  var themeDropdown = null;
  var themeMenuButton = null;
  var themeOptions = [];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function link(href, text, hotkey) {
    var node = el('a');
    node.href = href;
    node.innerHTML = text.replace(hotkey, '<span class="tv-hotkey">' + hotkey + '</span>');
    return node;
  }

  function themeButton(theme) {
    var button = el('button', 'tv-theme-option', themeLabels[theme]);
    button.type = 'button';
    button.setAttribute('data-tv-theme-option', theme);
    button.classList.toggle('is-active', theme === 'intern');
    button.addEventListener('click', function () {
      closeThemeMenu(false);
      setTheme(theme);
    });
    return button;
  }

  function statusItem(kind, key, label, href, action) {
    var node = kind === 'a' ? el('a') : el('button');
    if (kind === 'a') node.href = href;
    if (kind === 'button') {
      node.type = 'button';
      node.addEventListener('click', action);
    }
    node.appendChild(el('span', 'tv-status-key', key));
    node.appendChild(document.createTextNode(label));
    return node;
  }

  function setTheme(theme) {
    if (themeNames.indexOf(theme) < 0) theme = 'dark';
    localStorage.setItem('theme', theme);
    if (theme !== 'intern') {
      location.reload();
      return;
    }
    themeOptions.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-tv-theme-option') === theme);
    });
  }

  function cycleTheme() {
    var next = themeNames[(themeNames.indexOf('intern') + 1) % themeNames.length];
    setTheme(next);
  }

  function focusSearch() {
    var search = document.getElementById('tv-search') ||
      document.querySelector('input[type="search"], input[name="q"], .search-input');
    if (search) {
      search.focus();
      return;
    }
    location.href = '/preview.html?search=1';
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

  function sourceUrl() {
    var path = location.pathname;
    if (path === '/about/' || path === '/about') return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/about.md';
    if (path === '/disclaimer/' || path === '/disclaimer') return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/disclaimer.md';
    if (path === '/credits.html') return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/credits.html';
    if (path === '/keyboard.html') return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/keyboard.html';
    var parts = path.split('/').filter(Boolean);
    if (parts.length >= 5 && /\.html$/.test(path)) {
      var slug = parts[4].replace(/\.html$/, '');
      return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/_posts/' + parts[1] + '-' + parts[2] + '-' + parts[3] + '-' + slug + '.md';
    }
    if (parts.length === 2 && !/\.html$/.test(path)) {
      return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main/' + parts[0] + '/' + parts[1] + '.md';
    }
    return 'https://github.com/jubeenshah/jubeenshah.github.io/blob/main' + path;
  }

  function pageTitle() {
    var title = document.title.split('|')[0].trim() || 'jubeen.sh';
    return 'jubeen.sh -- ' + title;
  }

  function sourceNode(wrapper) {
    return wrapper.querySelector('.tp-content.e-content') ||
      wrapper.querySelector('.tp-page-content') ||
      wrapper.querySelector('.terminal-404') ||
      wrapper;
  }

  function frameLine(left, title, right) {
    var line = el('div', 'tv-frame-line');
    line.innerHTML = left + '<a class="tv-close" href="/">[■]</a>══╡ <span class="tv-window-title"></span> ╞════════════════════════════════════════════════════════════════════' + right;
    line.querySelector('.tv-window-title').textContent = title;
    return line;
  }

  function applyShell() {
    var main = document.querySelector('main.page-content');
    var wrapper = main && main.querySelector('.wrapper');
    if (!main || !wrapper) return;

    document.body.classList.add('intern-mode');
    document.body.setAttribute('data-theme', 'intern');

    var picked = sourceNode(wrapper);
    var dialog = /\/(about|disclaimer)\/?$/.test(location.pathname) || /\/(credits|keyboard)\.html$/.test(location.pathname);
    var desktop = el('div', 'tv-desktop');
    desktop.setAttribute('aria-label', 'Turbo Vision page');

    var shell = el('div', 'tv-window-shell' + (dialog ? ' tv-dialog-shell' : ''));
    shell.appendChild(el('div', 'tv-shadow'));

    var win = el('section', 'tv-window is-active');
    win.appendChild(frameLine('╔', pageTitle(), '╗'));

    var body = el('div', 'tv-window-body');
    body.appendChild(el('span', 'tv-edge', '║'));
    var content = el('div', 'tv-content');
    if (picked === wrapper) {
      while (wrapper.firstChild) content.appendChild(wrapper.firstChild);
    } else {
      content.appendChild(picked);
    }
    body.appendChild(content);
    body.appendChild(el('span', 'tv-edge', '║'));

    win.appendChild(body);
    win.appendChild(el('div', 'tv-frame-line', '╚══════════════════════════════════════════════════════════════════════════════╝'));
    shell.appendChild(win);
    desktop.appendChild(shell);

    wrapper.textContent = '';
    wrapper.appendChild(desktop);

    content.appendChild(el('span', 'tv-cursor'));
  }

  function addChrome() {
    var menu = el('nav', 'tv-menu');
    menu.setAttribute('aria-label', 'Primary');
    menu.appendChild(link('/preview.html', 'Posts', 'P'));
    menu.appendChild(link('/about/', 'About', 'A'));
    menu.appendChild(link('/disclaimer/', 'Disclaimer', 'D'));
    menu.appendChild(link('/keyboard.html', 'Help', 'H'));
    var menuDropdown = el('div', 'tv-menu-dropdown');
    var menuButton = el('button', 'tv-menu-button');
    menuButton.type = 'button';
    menuButton.setAttribute('aria-haspopup', 'true');
    menuButton.innerHTML = '<span class="tv-hotkey">T</span>heme';
    var themes = el('div', 'tv-theme-options');
    themeNames.forEach(function (theme) { themes.appendChild(themeButton(theme)); });
    menuDropdown.appendChild(menuButton);
    menuDropdown.appendChild(themes);
    menu.appendChild(menuDropdown);
    themeDropdown = menuDropdown;
    themeMenuButton = menuButton;
    themeOptions = [].slice.call(themes.querySelectorAll('[data-tv-theme-option]'));
    themeMenuButton.setAttribute('aria-expanded', 'false');
    themeMenuButton.addEventListener('click', function (event) {
      event.preventDefault();
      openThemeMenu();
    });
    document.body.insertBefore(menu, document.body.firstChild);

    var status = el('nav', 'tv-status');
    status.setAttribute('aria-label', 'Keyboard shortcuts');
    status.appendChild(statusItem('a', '1', 'Help', '/keyboard.html'));
    status.appendChild(statusItem('a', '2', 'About', '/about/'));
    status.appendChild(statusItem('a', '3', 'Source', sourceUrl()));
    status.lastChild.classList.add('hide-mobile');
    var theme = statusItem('button', '4', 'Theme', '', openThemeMenu);
    theme.classList.add('hide-mobile');
    status.appendChild(theme);
    status.appendChild(statusItem('button', '5', 'Search', '', focusSearch));
    var tag = statusItem('a', '7', 'Tag', '/preview.html');
    tag.classList.add('hide-mobile');
    status.appendChild(tag);
    status.appendChild(statusItem('a', '10', 'Quit', '/disclaimer/'));
    document.body.appendChild(status);
  }

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
      location.href = sourceUrl();
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
      location.href = '/preview.html';
      return true;
    }
    if (event.key === '0' || event.key === 'F10') {
      event.preventDefault();
      location.href = '/disclaimer/';
      return true;
    }
    return false;
  }

  document.addEventListener('keydown', function (event) {
    if (handleThemeMenuKey(event)) return;
    if (handleStatusKey(event)) return;
    var destination = isTyping(event) ? '' : navigateKey(event);
    if (destination) {
      event.preventDefault();
      location.href = destination;
    }
  });

  document.addEventListener('click', function (event) {
    if (themeDropdown && !themeDropdown.contains(event.target)) closeThemeMenu(false);
  });

  applyShell();
  addChrome();
})();
