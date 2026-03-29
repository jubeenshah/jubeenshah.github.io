document.addEventListener('DOMContentLoaded', function () {
  var lsRow = document.getElementById('tp-ls-row');
  var lsCmd = document.getElementById('tp-ls-cmd');
  var lsOutput = document.getElementById('tp-ls-output');
  var catRow = document.getElementById('tp-cat-row');
  var catCmd = document.getElementById('tp-cat-cmd');
  var outer = document.getElementById('tp-outer');
  var nav = document.getElementById('tp-nav');
  var related = document.getElementById('tp-related');
  var content = document.querySelector('.tp-content');
  var spanTags = document.querySelectorAll('.tp-span-anim');

  var CHAR_DELAY = 35;
  var CMD_PAUSE = 300;

  // Store the real text, clear it for typing
  var lsText = lsCmd ? lsCmd.textContent : '';
  var catText = catCmd ? catCmd.textContent : '';

  function typeInto(element, text, callback) {
    var i = 0;
    function next() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        setTimeout(next, CHAR_DELAY);
      } else {
        callback();
      }
    }
    next();
  }

  function showAll() {
    if (lsRow) lsRow.style.display = '';
    if (lsCmd) lsCmd.textContent = lsText;
    if (lsOutput) lsOutput.style.display = '';
    if (catRow) catRow.style.display = '';
    if (catCmd) catCmd.textContent = catText;
    if (outer) outer.style.display = '';
    if (nav) nav.style.display = '';
    if (related) related.style.display = '';
    spanTags.forEach(function (s) { s.style.display = ''; });
  }

  function animate() {
    // Show ls row with prompt visible, but command text empty
    lsRow.style.display = '';
    lsCmd.textContent = '';

    // Type the ls command
    typeInto(lsCmd, lsText, function () {
      // Show spanning tags
      spanTags.forEach(function (s) { s.style.display = ''; });

      setTimeout(function () {
        // Show ls output with fade
        lsOutput.style.display = '';
        lsOutput.classList.add('tp-fade-in');

        setTimeout(function () {
          // Show cat row with prompt visible, command text empty
          catRow.style.display = '';
          catCmd.textContent = '';

          typeInto(catCmd, catText, function () {
            setTimeout(function () {
              // Reveal content with staggered fade
              setTimeout(function () {
                if (outer) {
                  outer.style.display = '';
                  outer.classList.add('tp-fade-in');
                }
              }, 150);
              setTimeout(function () {
                if (related) {
                  related.style.display = '';
                  related.classList.add('tp-fade-in');
                }
              }, 300);
              setTimeout(function () {
                if (nav) {
                  nav.style.display = '';
                  nav.classList.add('tp-fade-in');
                }
              }, 450);
            }, CMD_PAUSE);
          });
        }, CMD_PAUSE);
      }, CMD_PAUSE);
    });
  }

  // Animate once per session per page
  var sessionKey = 'tp-played-' + window.location.pathname;
  var hasPlayed = sessionStorage.getItem(sessionKey);

  if (hasPlayed) {
    showAll();
  } else {
    animate();
    sessionStorage.setItem(sessionKey, '1');
  }

  // === TOC ===
  if (!content) return;

  var tocNav = document.getElementById('toc-nav');
  if (!tocNav) return;

  var headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    var toc = document.getElementById('writing-toc');
    if (toc) toc.style.display = 'none';
    return;
  }

  headings.forEach(function (heading) {
    if (heading === content.querySelector('h2:first-child')) return;

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.className = 'toc-link';

    if (heading.tagName === 'H3') {
      link.classList.add('toc-link-sub');
    }

    tocNav.appendChild(link);
  });

  var tocLinks = tocNav.querySelectorAll('.toc-link');

  function updateActiveToc() {
    var scrollPos = window.scrollY + 100;
    var active = null;

    headings.forEach(function (heading) {
      if (heading === content.querySelector('h2:first-child')) return;
      if (heading.offsetTop <= scrollPos) {
        active = heading.id;
      }
    });

    tocLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + active) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveToc);
  updateActiveToc();
});
