document.addEventListener('DOMContentLoaded', function () {
  var postData = null;
  var refData = null;
  var wikiCache = {};
  var popup = null;
  var hideTimeout = null;

  // Fetch post index
  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { postData = data; })
    .catch(function () { postData = {}; });

  // Fetch references index
  fetch('/references.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { refData = data; })
    .catch(function () { refData = {}; });

  // Create popup element
  popup = document.createElement('div');
  popup.className = 'link-preview';
  popup.style.display = 'none';
  document.body.appendChild(popup);

  // === Position popup near target ===
  function positionPopup(target) {
    var rect = target.getBoundingClientRect();
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var scrollX = window.scrollX || document.documentElement.scrollLeft;

    popup.style.display = 'block';

    var popupRect = popup.getBoundingClientRect();
    var top = rect.bottom + scrollY + 8;
    var left = rect.left + scrollX;

    if (left + popupRect.width > window.innerWidth + scrollX - 20) {
      left = window.innerWidth + scrollX - popupRect.width - 20;
    }
    if (left < scrollX + 10) {
      left = scrollX + 10;
    }
    if (top + popupRect.height > window.innerHeight + scrollY - 20) {
      top = rect.top + scrollY - popupRect.height - 8;
    }

    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  // === Post preview popup ===
  function showPostPopup(e, href, data) {
    var readMin = Math.max(1, Math.ceil(data.words / 200));
    var perms = data.nsfw ? '-rwsr--r--' : '-rw-r--r--';
    var group = data.nsfw ? 'stderr' : 'staff';
    var permsClass = data.nsfw ? 'lp-perms lp-nsfw' : 'lp-perms';
    var groupClass = data.nsfw ? 'lp-nsfw' : '';

    popup.className = 'link-preview cat-' + data.category;

    popup.innerHTML =
      '<div class="lp-toolbar">' +
        '<span class="lp-path">~/' + (data.category === 'page' ? data.title.toLowerCase() : data.category + '/' + (data.subcategory ? data.subcategory + '/' : '')) + '</span>' +
        '<span class="lp-actions">' +
          '<a href="' + href + '" target="_blank" class="lp-open" title="open in new tab">↗</a>' +
          '<button class="lp-close" title="close">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="lp-meta">' +
        '<span class="' + permsClass + '">' + perms + '</span>  ' +
        '<span class="lp-owner">jubeen</span>  ' +
        '<span class="' + groupClass + '">' + group + '</span>  ' +
        '<span class="lp-size">' + readMin + ' min</span>  ' +
        '<span class="lp-date">' + data.date + '</span>' +
      '</div>' +
      '<div class="lp-excerpt">' + data.excerpt + '</div>';

    positionPopup(e.target);
  }

  // === Citation preview popup ===
  function showCitePopup(e, ref) {
    popup.className = 'link-preview lp-cite';

    var titleHtml = ref.title;
    var sourceUrl = ref.url || (ref.doi ? 'https://doi.org/' + ref.doi : '');

    // Check if it's a Wikipedia citation
    if (sourceUrl && sourceUrl.indexOf('wikipedia.org') !== -1) {
      showWikiPopup(e, ref, sourceUrl);
      return;
    }

    if (sourceUrl) {
      titleHtml = '<a href="' + sourceUrl + '" target="_blank" class="lp-cite-title-link">' + ref.title + '</a>';
    }

    var abstractHtml = '';
    if (ref.abstract) {
      var excerpt = ref.abstract.length > 200 ? ref.abstract.substring(0, 200) + '...' : ref.abstract;
      abstractHtml = '<div class="lp-cite-abstract">' + excerpt + '</div>';
    } else if (ref.note) {
      var noteExcerpt = ref.note.length > 200 ? ref.note.substring(0, 200) + '...' : ref.note;
      abstractHtml = '<div class="lp-cite-abstract">' + noteExcerpt + '</div>';
    }

    var venueHtml = '';
    if (ref.journal) {
      venueHtml = '<div class="lp-cite-venue">' + ref.journal + '</div>';
    }

    popup.innerHTML =
      '<div class="lp-toolbar">' +
        '<span class="lp-cite-label">ref</span>' +
        '<span class="lp-actions">' +
          (sourceUrl ? '<a href="' + sourceUrl + '" target="_blank" class="lp-open" title="open source">↗</a>' : '') +
          '<button class="lp-close" title="close">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="lp-cite-authors">' + ref.authors + ' (' + ref.year + ')</div>' +
      '<div class="lp-cite-title">' + titleHtml + '</div>' +
      venueHtml +
      abstractHtml;

    positionPopup(e.target);
  }

  // === Wikipedia preview popup ===
  function showWikiPopup(e, ref, url) {
    // Extract title from Wikipedia URL
    var wikiMatch = url.match(/wikipedia\.org\/(?:w\/index\.php\?title=|wiki\/)([^&?#]+)/);
    if (!wikiMatch) {
      // Fallback to regular cite popup without wiki fetch
      showCitePopupFallback(e, ref);
      return;
    }

    var wikiTitle = decodeURIComponent(wikiMatch[1]).replace(/_/g, ' ');
    var apiTitle = wikiMatch[1];

    // Check cache
    if (wikiCache[apiTitle]) {
      renderWikiPopup(e, ref, wikiCache[apiTitle]);
      return;
    }

    // Show loading state
    popup.className = 'link-preview lp-cite lp-wiki';
    popup.innerHTML =
      '<div class="lp-toolbar">' +
        '<span class="lp-cite-label">wikipedia</span>' +
        '<span class="lp-actions">' +
          '<a href="' + url + '" target="_blank" class="lp-open" title="open on wikipedia">↗</a>' +
          '<button class="lp-close" title="close">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="lp-cite-authors">' + ref.authors + ' (' + ref.year + ')</div>' +
      '<div class="lp-cite-title">' + wikiTitle + '</div>' +
      '<div class="lp-cite-abstract lp-loading">loading...</div>';

    positionPopup(e.target);

    // Fetch from Wikipedia REST API
    fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + apiTitle)
      .then(function (r) { return r.json(); })
      .then(function (wikiData) {
        wikiCache[apiTitle] = wikiData;
        // Only render if popup is still visible
        if (popup.style.display === 'block') {
          renderWikiPopup(e, ref, wikiData);
        }
      })
      .catch(function () {
        // Fallback on error
        if (popup.style.display === 'block') {
          showCitePopupFallback(e, ref);
        }
      });
  }

  function renderWikiPopup(e, ref, wikiData) {
    var extract = wikiData.extract || '';
    if (extract.length > 250) {
      extract = extract.substring(0, 250) + '...';
    }

    var thumbHtml = '';
    if (wikiData.thumbnail && wikiData.thumbnail.source) {
      thumbHtml = '<img class="lp-wiki-thumb" src="' + wikiData.thumbnail.source + '" alt="">';
    }

    var sourceUrl = wikiData.content_urls && wikiData.content_urls.desktop ? wikiData.content_urls.desktop.page : '#';

    popup.className = 'link-preview lp-cite lp-wiki';
    popup.innerHTML =
      '<div class="lp-toolbar">' +
        '<span class="lp-cite-label">wikipedia</span>' +
        '<span class="lp-actions">' +
          '<a href="' + sourceUrl + '" target="_blank" class="lp-open" title="open on wikipedia">↗</a>' +
          '<button class="lp-close" title="close">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="lp-wiki-content">' +
        thumbHtml +
        '<div class="lp-wiki-text">' +
          '<div class="lp-cite-title">' + (wikiData.title || ref.title) + '</div>' +
          '<div class="lp-cite-abstract">' + extract + '</div>' +
        '</div>' +
      '</div>';

    positionPopup(e.target);
  }

  function showCitePopupFallback(e, ref) {
    var sourceUrl = ref.url || (ref.doi ? 'https://doi.org/' + ref.doi : '');
    popup.className = 'link-preview lp-cite';
    popup.innerHTML =
      '<div class="lp-toolbar">' +
        '<span class="lp-cite-label">ref</span>' +
        '<span class="lp-actions">' +
          (sourceUrl ? '<a href="' + sourceUrl + '" target="_blank" class="lp-open" title="open source">↗</a>' : '') +
          '<button class="lp-close" title="close">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="lp-cite-authors">' + ref.authors + ' (' + ref.year + ')</div>' +
      '<div class="lp-cite-title">' + ref.title + '</div>';

    positionPopup(e.target);
  }

  // === Hide popup ===
  function hidePopup() {
    hideTimeout = setTimeout(function () {
      popup.style.display = 'none';
    }, 200);
  }

  // Keep popup visible when hovering over it
  popup.addEventListener('mouseenter', function () {
    clearTimeout(hideTimeout);
  });
  popup.addEventListener('mouseleave', function () {
    hidePopup();
  });

  // Close button — event delegation
  popup.addEventListener('click', function (e) {
    if (e.target.classList.contains('lp-close')) {
      e.stopPropagation();
      clearTimeout(hideTimeout);
      popup.style.display = 'none';
    }
  });

  // === Hover handler ===
  document.addEventListener('mouseover', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    // Don't trigger on links inside the popup
    if (popup.contains(link)) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // === Citation links (# anchors pointing to bibliography entries) ===
    if (href.startsWith('#') && refData) {
      // Jekyll-scholar generates IDs like "bostrom2014" from {% cite bostrom2014 %}
      var citeKey = href.substring(1);

      // Try direct match
      if (refData[citeKey]) {
        clearTimeout(hideTimeout);
        showCitePopup(e, refData[citeKey]);
        return;
      }

      // Try matching by checking if the anchor target has a cite key in its ID
      // Jekyll-scholar bibliography entries get IDs like "bostrom2014" or similar
      var targetEl = document.getElementById(citeKey);
      if (targetEl) {
        // Look for a matching key in refData
        for (var key in refData) {
          if (citeKey.indexOf(key) !== -1 || key.indexOf(citeKey) !== -1) {
            clearTimeout(hideTimeout);
            showCitePopup(e, refData[key]);
            return;
          }
        }
      }

      return;
    }

    // === External links — skip ===
    if (href.startsWith('http') || href.startsWith('#')) return;

    // === Internal post/page links ===
    if (!postData) return;

    // Normalize relative URLs to absolute
    if (!href.startsWith('/')) {
      var base = window.location.pathname;
      var dir = base.substring(0, base.lastIndexOf('/') + 1);
      href = dir + href;
    }

    var a = document.createElement('a');
    a.href = href;
    href = a.pathname;

    if (postData[href]) {
      clearTimeout(hideTimeout);
      showPostPopup(e, href, postData[href]);
    }
  });

  document.addEventListener('mouseout', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    hidePopup();
  });
});
