document.addEventListener('DOMContentLoaded', function () {
  var lsRow = document.getElementById('tp-ls-row');
  var lsCmd = document.getElementById('tp-ls-cmd');
  var lsOutput = document.getElementById('tp-ls-output');
  var catRow = document.getElementById('tp-cat-row');
  var catCmd = document.getElementById('tp-cat-cmd');
  var toc = document.getElementById('writing-toc');
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
    if (toc) toc.style.display = '';
    if (nav) nav.style.display = '';
    if (related) related.style.display = '';
    spanTags.forEach(function (s) { s.style.display = ''; });
  }

  function animate() {
    // If no animation elements exist (page layout), just show everything
    if (!lsRow || !lsCmd || !catRow || !catCmd) {
      showAll();
      return;
    }

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
              // Reveal TOC + content with staggered fade
              if (toc) {
                toc.style.display = '';
                toc.classList.add('tp-fade-in');
              }
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

  // === Progress indicator ===
  var progressEl = document.getElementById('tp-progress');
  var progressFill = document.getElementById('tp-progress-fill');
  var progressHeading = document.getElementById('tp-progress-heading');
  var tocEl = document.getElementById('writing-toc');

  function updateScrollIndicators() {
    var scrollPos = window.scrollY + 100;
    var active = null;
    var activeText = '';

    // Update active TOC link + find current heading
    headings.forEach(function (heading) {
      if (heading === content.querySelector('h2:first-child')) return;
      if (heading.offsetTop <= scrollPos) {
        active = heading.id;
        activeText = heading.textContent;
      }
    });

    tocLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + active) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    });

    // Update progress bar
    if (progressEl && progressFill && progressHeading) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
      progressFill.style.height = progress + '%';
      progressHeading.textContent = activeText;

      // Show progress indicator only after TOC scrolls out of view
      if (tocEl) {
        var tocBottom = tocEl.getBoundingClientRect().bottom;
        if (tocBottom < 0) {
          progressEl.classList.add('visible');
        } else {
          progressEl.classList.remove('visible');
        }
      } else {
        // No TOC (e.g. certs) — show after scrolling past header
        if (window.scrollY > 300) {
          progressEl.classList.add('visible');
        } else {
          progressEl.classList.remove('visible');
        }
      }
    }
  }

  window.addEventListener('scroll', updateScrollIndicators);
  updateScrollIndicators();

  // === Marginalia — right margin citation notes ===
  var marginalia = document.getElementById('tp-marginalia');
  if (!marginalia) return;

  var refData = null;
  var marginNotes = [];

  fetch('/references.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      refData = data;
      buildMarginNotes();
    })
    .catch(function () {});

  function buildMarginNotes() {
    if (!refData || !content) return;

    // Find all citation links in the content
    var citeLinks = content.querySelectorAll('a[href^="#"]');
    var seen = {};

    citeLinks.forEach(function (link) {
      var key = link.getAttribute('href').substring(1);

      // Try to find matching ref
      var ref = refData[key];
      if (!ref) {
        // Try fuzzy match
        for (var k in refData) {
          if (key.indexOf(k) !== -1 || k.indexOf(key) !== -1) {
            ref = refData[k];
            key = k;
            break;
          }
        }
      }

      if (!ref) return;
      if (!ref.note) return;
      if (seen[key]) return;
      seen[key] = true;

      var noteText = ref.note;
      if (noteText.length > 150) {
        noteText = noteText.substring(0, 150) + '...';
      }

      var noteEl = document.createElement('div');
      noteEl.className = 'tp-margin-note';
      noteEl.innerHTML =
        '<div class="tp-margin-note-key">' + ref.authors.split(',')[0].split(' and ')[0] + ' ' + ref.year + '</div>' +
        '<div class="tp-margin-note-title">' + ref.title.substring(0, 60) + (ref.title.length > 60 ? '...' : '') + '</div>' +
        '<div class="tp-margin-note-text">' + noteText + '</div>';

      marginalia.appendChild(noteEl);

      marginNotes.push({
        el: noteEl,
        link: link
      });
    });

    positionMarginNotes();
    window.addEventListener('scroll', updateMarginVisibility);
    window.addEventListener('resize', positionMarginNotes);
  }

  function positionMarginNotes() {
    var articleRect = content.getBoundingClientRect();
    var articleTop = content.offsetTop;

    marginNotes.forEach(function (note) {
      var linkRect = note.link.getBoundingClientRect();
      var linkTop = note.link.offsetTop;

      // Position relative to the article container
      var parent = note.link.offsetParent;
      var top = 0;
      var el = note.link;
      while (el && el !== document.body) {
        top += el.offsetTop;
        el = el.offsetParent;
      }

      note.el.style.top = (top - marginalia.offsetTop) + 'px';
    });
  }

  function updateMarginVisibility() {
    var viewTop = window.scrollY;
    var viewBottom = viewTop + window.innerHeight;

    marginNotes.forEach(function (note) {
      var noteTop = note.el.getBoundingClientRect().top + window.scrollY;

      if (noteTop > viewTop - 100 && noteTop < viewBottom + 100) {
        note.el.classList.add('visible');
      } else {
        note.el.classList.remove('visible');
      }
    });
  }
});
