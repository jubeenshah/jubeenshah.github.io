document.addEventListener('DOMContentLoaded', function () {
  var postData = null;
  var popup = null;
  var hideTimeout = null;

  // Fetch post index
  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { postData = data; })
    .catch(function () { postData = {}; });

  // Create popup element
  popup = document.createElement('div');
  popup.className = 'link-preview';
  popup.style.display = 'none';
  document.body.appendChild(popup);

  function showPopup(e, data) {
    var readMin = Math.max(1, Math.ceil(data.words / 200));
    var perms = data.nsfw ? '-rwsr--r--' : '-rw-r--r--';
    var group = data.nsfw ? 'stderr' : 'staff';
    var permsClass = data.nsfw ? 'lp-perms lp-nsfw' : 'lp-perms';
    var groupClass = data.nsfw ? 'lp-nsfw' : '';

    popup.innerHTML =
      '<div class="lp-header">' +
        '<span class="lp-path">~/' + data.category + '/' + data.subcategory + '/</span>' +
      '</div>' +
      '<div class="lp-meta">' +
        '<span class="' + permsClass + '">' + perms + '</span>  ' +
        '<span class="lp-owner">jubeen</span>  ' +
        '<span class="' + groupClass + '">' + group + '</span>  ' +
        '<span class="lp-size">' + readMin + ' min</span>  ' +
        '<span class="lp-date">' + data.date + '</span>' +
      '</div>' +
      '<div class="lp-excerpt">' + data.excerpt + '</div>';

    // Position near the link
    var rect = e.target.getBoundingClientRect();
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var scrollX = window.scrollX || document.documentElement.scrollLeft;

    popup.style.display = 'block';

    // Calculate position — prefer below the link
    var popupRect = popup.getBoundingClientRect();
    var top = rect.bottom + scrollY + 8;
    var left = rect.left + scrollX;

    // Keep within viewport
    if (left + popupRect.width > window.innerWidth + scrollX - 20) {
      left = window.innerWidth + scrollX - popupRect.width - 20;
    }
    if (left < scrollX + 10) {
      left = scrollX + 10;
    }

    // If below would go off screen, show above
    if (top + popupRect.height > window.innerHeight + scrollY - 20) {
      top = rect.top + scrollY - popupRect.height - 8;
    }

    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

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

  // Listen for hover on all internal links
  document.addEventListener('mouseover', function (e) {
    if (!postData) return;

    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    // Normalize relative URLs to absolute
    if (!href.startsWith('/')) {
      // Resolve relative to current page path
      var base = window.location.pathname;
      var dir = base.substring(0, base.lastIndexOf('/') + 1);
      href = dir + href;
    }

    // Clean up any ../ or ./ in the path
    var a = document.createElement('a');
    a.href = href;
    href = a.pathname;

    if (postData[href]) {
      clearTimeout(hideTimeout);
      showPopup(e, postData[href]);
    }
  });

  document.addEventListener('mouseout', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    hidePopup();
  });
});
