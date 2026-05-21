/* Slow scroll-reveal — the Rolls-Royce "ceremonial" rise.
   Elements marked [data-reveal] fade and lift into place as they enter
   the viewport. Call window.revealScan() after injecting new markup. */

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = reduce ? null : new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  window.revealScan = function () {
    document.querySelectorAll('[data-reveal]:not(.reveal-bound)').forEach(el => {
      el.classList.add('reveal-bound');
      if (reduce) el.classList.add('is-visible');
      else io.observe(el);
    });
  };

  document.addEventListener('DOMContentLoaded', window.revealScan);
})();
