/* Background — an animated geometric network that also paints the page
   background. Nodes drift and bounce; nearby nodes auto-connect into
   shifting triangles and polygons. On the homepage the background
   transitions black->white as the product index scrolls in.
   The product detail page opts out entirely so the shoe leads.
   Respects prefers-reduced-motion and pauses on hidden tabs. */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  /* Product detail page: no background animation — keep it clean. */
  if (document.querySelector('[data-pdp]')) return;

  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BG_DARK = [14, 14, 14];
  const BG_LIGHT = [255, 255, 255];
  const LINE_ON_DARK = [255, 255, 255];
  const LINE_ON_LIGHT = [22, 22, 22];
  const ACCENT = 'rgb(245,51,31)';
  const LINK = 158;

  /* Homepage carries .index — drives the black->white scroll transition. */
  const indexEl = document.querySelector('.index');

  let w, h, dpr, nodes, raf;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mix(c1, c2, t) {
    return 'rgb(' + Math.round(c1[0] + (c2[0] - c1[0]) * t) + ',' +
                    Math.round(c1[1] + (c2[1] - c1[1]) * t) + ',' +
                    Math.round(c1[2] + (c2[2] - c1[2]) * t) + ')';
  }
  function progress() {
    if (!indexEl) return 1;
    return clamp01(1 - indexEl.getBoundingClientRect().top / window.innerHeight);
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function init() {
    size();
    const count = Math.max(46, Math.min(120,
      Math.round(window.innerWidth * window.innerHeight / 15000)));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: rand(0, w), y: rand(0, h),
        vx: rand(-0.32, 0.32) * dpr,
        vy: rand(-0.32, 0.32) * dpr,
        accent: Math.random() < 0.13
      });
    }
  }

  function step(animate) {
    const p = progress();
    const lineCol = mix(LINE_ON_DARK, LINE_ON_LIGHT, p);
    ctx.fillStyle = mix(BG_DARK, BG_LIGHT, p);
    ctx.fillRect(0, 0, w, h);

    const link = LINK * dpr;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (animate) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < link) {
          const t = 1 - d / link;
          const hot = a.accent || b.accent;
          ctx.globalAlpha = t * (hot ? 0.6 : 0.42);
          ctx.strokeStyle = hot ? ACCENT : lineCol;
          ctx.lineWidth = (hot ? 1.3 : 1) * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.globalAlpha = n.accent ? 0.95 : 0.7;
      ctx.fillStyle = n.accent ? ACCENT : lineCol;
      ctx.beginPath();
      ctx.arc(n.x, n.y, (n.accent ? 2.6 : 1.9) * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    if (animate) raf = requestAnimationFrame(() => step(true));
  }

  init();
  step(!reduce);

  if (reduce) {
    window.addEventListener('scroll', () => step(false), { passive: true });
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    init();
    step(!reduce);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!reduce) {
      cancelAnimationFrame(raf);
      step(true);
    }
  });
})();
