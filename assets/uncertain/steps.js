/* Fades each step's words in while it holds the middle of the window, and plays the two 2020 Lottie files
   (Odyssey's scroll cue and its build-test-deploy line, recoloured in EffectCraft) when they come into view. */
(function () {
  var steps = document.querySelectorAll('.u-step'), anims = document.querySelectorAll('[data-lottie]');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) { steps.forEach(function (s) { s.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-in', e.isIntersecting); }); }, { rootMargin: '-38% 0px -38% 0px' });
  steps.forEach(function (s) { io.observe(s); });
  if (!anims.length || !window.lottie) return;
  var base = document.getElementById('u-stage').dataset.base;
  var lo = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var el = e.target;
      if (!el.anim) el.anim = window.lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: false, path: base + 'lottie/' + el.dataset.lottie });
      if (e.isIntersecting && !still) el.anim.play(); else el.anim.pause();
    });
  });
  anims.forEach(function (a) { lo.observe(a); });
})();
