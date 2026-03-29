document.addEventListener('DOMContentLoaded', function () {
  const output = document.getElementById('terminal-output');
  const cursor = document.getElementById('terminal-cursor');
  const tagBar = document.getElementById('tag-bar');
  const postList = document.getElementById('post-list');
  const postCount = document.getElementById('post-count');

  const prompt = 'you@jubeen.sh:~$ ';

  // 12 messages of the month — one per month, from your writing
  var motm = [
    'be curious, not judgmental. — walt whitman',                                        // jan
    'the powerful play goes on, and you may contribute a verse.',                         // feb
    'let\'s learn publicly this time around. a little less hiding.',                      // mar
    'please, first, hack your way to the answer.',                                       // apr
    'every day, i feel a little more stupid. and that\'s the point.',                     // may
    'nobody knows your life better than yourself. stop outsourcing the answer.',          // jun
    'open source is created by people. lots of things depend on people.',                 // jul
    'we trained them to catch the liars. then the liars learned to speak like us.',       // aug
    'to improve yourself, you must have self-discipline in life.',                        // sep
    'if you can\'t stop cold turkey, phase it out slowly.',                               // oct
    'this is a gigantic joke, which just isn\'t funny.',                                  // nov
    'the powerful play continues, and you may contribute a verse.'                        // dec
  ];

  var currentMonth = new Date().getMonth(); // 0-11
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
    let i = 0;
    const span = document.createElement('span');
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
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    output.appendChild(span);
  }

  function newline() {
    output.appendChild(document.createTextNode('\n'));
  }

  function runScript(steps, index) {
    if (index >= steps.length) return;

    const step = steps[index];

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
    var total = postList.querySelectorAll('.post-entry').length;
    document.getElementById('count-display').textContent =
      visible + ' of ' + total + ' posts';
  }

  // Tag filtering
  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('tag-btn')) return;

    // Update active button
    document.querySelectorAll('.tag-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    var tag = e.target.getAttribute('data-tag');
    var posts = postList.querySelectorAll('.post-entry');

    posts.forEach(function (post) {
      if (tag === 'all') {
        post.classList.remove('hidden');
      } else {
        var categories = post.getAttribute('data-categories').split(' ');
        if (categories.indexOf(tag) !== -1) {
          post.classList.remove('hidden');
        } else {
          post.classList.add('hidden');
        }
      }
    });

    updateCount();
  });

  // Check if animation has played this session
  var hasPlayed = sessionStorage.getItem('terminal-played');

  if (hasPlayed) {
    // Skip animation — show final state immediately
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
    // Play animation and mark as played
    runScript(script, 0);
    sessionStorage.setItem('terminal-played', '1');
  }
});
