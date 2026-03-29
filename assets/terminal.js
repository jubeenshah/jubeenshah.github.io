document.addEventListener('DOMContentLoaded', function () {
  const output = document.getElementById('terminal-output');
  const cursor = document.getElementById('terminal-cursor');
  const tagBar = document.getElementById('tag-bar');
  const subcategoryBar = document.getElementById('subcategory-bar');
  const spanningBar = document.getElementById('spanning-bar');
  const postList = document.getElementById('post-list');
  const postCount = document.getElementById('post-count');

  const prompt = 'you@jubeen.sh:~$ ';

  // Subcategory map
  var subcategories = {
    writing:  ['film', 'personal', 'society'],
    security: ['networking', 'appsec'],
    projects: ['iot', 'devops', 'privacy', 'security'],
    certs:    ['academic', 'offsec', 'redhat', 'splunk', 'aws'],
    career:   ['productivity', 'mentorship', 'meta']
  };

  // L1 color map for sub-category inheritance
  var l1Colors = {
    writing:  '#CF6679',
    security: '#03dac5',
    projects: '#9980FF',
    certs:    '#FFB74D',
    career:   '#84c9fb'
  };

  // Current filter state
  var activeL1 = 'all';
  var activeL2 = null;
  var activeL3 = null;
  var showNsfw = true;

  // 12 messages of the month
  var motm = [
    'be curious, not judgmental. \u2014 walt whitman',
    'the powerful play goes on, and you may contribute a verse.',
    'let\'s learn publicly this time around. a little less hiding.',
    'please, first, hack your way to the answer.',
    'every day, i feel a little more stupid. and that\'s the point.',
    'nobody knows your life better than yourself. stop outsourcing the answer.',
    'open source is created by people. lots of things depend on people.',
    'we trained them to catch the liars. then the liars learned to speak like us.',
    'to improve yourself, you must have self-discipline in life.',
    'if you can\'t stop cold turkey, phase it out slowly.',
    'this is a gigantic joke, which just isn\'t funny.',
    'the powerful play continues, and you may contribute a verse.'
  ];

  var currentMonth = new Date().getMonth();
  var todaysMessage = motm[currentMonth];
  var postTotal = document.querySelectorAll('.post-entry').length;

  const script = [
    { type: 'command', text: 'whoareyou' },
    { type: 'response', text: 'security engineer. poet. curious being.' },
    { type: 'pause', ms: 300 },
    { type: 'command', text: 'stat jubeen' },
    { type: 'response', text: 'passionately curious about technology' },
    { type: 'pause', ms: 300 },
    { type: 'command', text: 'cat /etc/motm' },
    { type: 'response', text: todaysMessage },
    { type: 'pause', ms: 300 },
    { type: 'command', text: './posts/filter.sh' },
    { type: 'response', text: 'loading ' + postTotal + ' posts...' },
    { type: 'done' }
  ];

  const CHAR_DELAY = 20;
  const COMMAND_PAUSE = 200;

  function typeText(text, className, callback) {
    var i = 0;
    var span = document.createElement('span');
    span.className = className;
    output.appendChild(span);

    function next() {
      if (i < text.length) {
        span.textContent += text[i];
        i++;
        setTimeout(next, CHAR_DELAY);
      } else {
        callback();
      }
    }
    next();
  }

  function addText(text, className) {
    var span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    output.appendChild(span);
  }

  function newline() {
    output.appendChild(document.createTextNode('\n'));
  }

  function runScript(steps, index) {
    if (index >= steps.length) return;

    var step = steps[index];

    if (step.type === 'command') {
      addText(prompt, 'terminal-prompt');
      typeText(step.text, 'terminal-command', function () {
        newline();
        setTimeout(function () { runScript(steps, index + 1); }, COMMAND_PAUSE);
      });
    } else if (step.type === 'response') {
      addText(step.text, 'terminal-response');
      newline();
      runScript(steps, index + 1);
    } else if (step.type === 'pause') {
      setTimeout(function () { runScript(steps, index + 1); }, step.ms);
    } else if (step.type === 'done') {
      cursor.style.display = 'none';
      showContent();
    }
  }

  function showContent() {
    tagBar.style.display = 'block';

    setTimeout(function () {
      postList.style.display = 'block';
      updateCount();
      postCount.style.display = 'block';
    }, 200);
  }

  function updateCount() {
    var visible = postList.querySelectorAll('.post-entry:not(.hidden)').length;
    document.getElementById('count-display').textContent =
      visible + ' of ' + postTotal + ' posts';
  }

  // Get spanning tags relevant to currently visible posts
  function getVisibleSpanningTags() {
    var tags = {};
    var posts = postList.querySelectorAll('.post-entry:not(.hidden)');
    posts.forEach(function (post) {
      var spanning = post.getAttribute('data-spanning');
      if (spanning) {
        spanning.split(',').forEach(function (t) {
          t = t.trim();
          if (t) tags[t] = (tags[t] || 0) + 1;
        });
      }
    });
    return tags;
  }

  // Render Layer 2 subcategories
  function renderL2(category) {
    var container = document.getElementById('layer2');
    container.innerHTML = '';

    if (!subcategories[category]) {
      subcategoryBar.style.display = 'none';
      return;
    }

    var color = l1Colors[category] || '#aaa';

    // Set the left border to match parent color
    container.style.borderLeftColor = color;

    var allBtn = document.createElement('button');
    allBtn.className = 'sub-btn active';
    allBtn.setAttribute('data-sub', 'all');
    allBtn.setAttribute('data-color', color);
    allBtn.style.borderColor = color;
    allBtn.style.color = '#171f24';
    allBtn.style.background = color;
    allBtn.textContent = 'all';
    container.appendChild(allBtn);

    subcategories[category].forEach(function (sub) {
      var btn = document.createElement('button');
      btn.className = 'sub-btn';
      btn.setAttribute('data-sub', sub);
      btn.setAttribute('data-color', color);
      btn.style.borderColor = color + '66';
      btn.style.color = color;
      btn.textContent = sub;
      container.appendChild(btn);
    });

    subcategoryBar.style.display = 'block';
  }

  // Render Layer 3 spanning tags
  function renderL3() {
    var container = document.getElementById('layer3');
    container.innerHTML = '';

    var tags = getVisibleSpanningTags();
    var tagNames = Object.keys(tags).sort();

    if (tagNames.length === 0) {
      spanningBar.style.display = 'none';
      return;
    }

    tagNames.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.className = 'span-btn';
      btn.setAttribute('data-span', tag);
      btn.textContent = '#' + tag;
      container.appendChild(btn);
    });

    spanningBar.style.display = 'block';
  }

  // Filter posts based on current state
  function filterPosts() {
    var posts = postList.querySelectorAll('.post-entry');

    posts.forEach(function (post) {
      var cat = post.getAttribute('data-category');
      var sub = post.getAttribute('data-subcategory');
      var spanning = post.getAttribute('data-spanning') || '';

      var show = true;

      // Layer 1 filter
      if (activeL1 !== 'all' && cat !== activeL1) show = false;

      // Layer 2 filter
      if (show && activeL2 && activeL2 !== 'all' && sub !== activeL2) show = false;

      // Layer 3 filter
      if (show && activeL3) {
        if (spanning.indexOf(activeL3) === -1) show = false;
      }

      // NSFW filter
      if (show && !showNsfw) {
        var isNsfw = post.getAttribute('data-nsfw') === 'true';
        if (isNsfw) show = false;
      }

      if (show) {
        post.classList.remove('hidden');
      } else {
        post.classList.add('hidden');
      }
    });

    updateCount();
  }

  // Layer 1 click handler
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('layer1-btn')) {
      // Update active state
      document.querySelectorAll('.layer1-btn').forEach(function (btn) {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');

      activeL1 = e.target.getAttribute('data-tag');
      activeL2 = null;
      activeL3 = null;

      if (activeL1 === 'all') {
        subcategoryBar.style.display = 'none';
        spanningBar.style.display = 'none';
      } else {
        renderL2(activeL1);
      }

      filterPosts();
      renderL3();
    }

    // Layer 2 click handler
    if (e.target.classList.contains('sub-btn')) {
      var color = e.target.getAttribute('data-color');

      // Reset all sub buttons to outline style
      document.querySelectorAll('.sub-btn').forEach(function (btn) {
        btn.classList.remove('active');
        btn.style.color = color;
        btn.style.background = 'transparent';
        btn.style.borderColor = color + '66';
      });

      // Active button gets filled
      e.target.classList.add('active');
      e.target.style.color = '#171f24';
      e.target.style.background = color;
      e.target.style.borderColor = color;

      activeL2 = e.target.getAttribute('data-sub');
      activeL3 = null;

      // Clear any active spanning
      document.querySelectorAll('.span-btn').forEach(function (btn) {
        btn.classList.remove('active');
      });

      filterPosts();
      renderL3();
    }

    // Layer 3 click handler
    if (e.target.classList.contains('span-btn')) {
      var clickedTag = e.target.getAttribute('data-span');

      if (activeL3 === clickedTag) {
        // Toggle off
        activeL3 = null;
        e.target.classList.remove('active');
      } else {
        document.querySelectorAll('.span-btn').forEach(function (btn) {
          btn.classList.remove('active');
        });
        activeL3 = clickedTag;
        e.target.classList.add('active');
      }

      filterPosts();
    }
  });

  // NSFW toggle handler
  document.getElementById('nsfw-toggle').addEventListener('change', function () {
    showNsfw = this.checked;
    filterPosts();
  });

  // Check if animation has played this session
  var hasPlayed = sessionStorage.getItem('terminal-played');

  if (hasPlayed) {
    var lines = [
      { prompt: true, cmd: 'whoareyou' },
      { text: 'security engineer. poet. curious being.' },
      { prompt: true, cmd: 'stat jubeen' },
      { text: 'passionately curious about technology' },
      { prompt: true, cmd: 'cat /etc/motm' },
      { text: todaysMessage },
      { prompt: true, cmd: './posts/filter.sh' },
      { text: 'loading ' + postTotal + ' posts...' }
    ];

    lines.forEach(function (line) {
      if (line.prompt) {
        addText(prompt, 'terminal-prompt');
        addText(line.cmd, 'terminal-command');
      } else {
        addText(line.text, 'terminal-response');
      }
      newline();
    });

    cursor.style.display = 'none';
    showContent();
  } else {
    runScript(script, 0);
    sessionStorage.setItem('terminal-played', '1');
  }
});
