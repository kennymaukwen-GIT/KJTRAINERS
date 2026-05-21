/* Shop — filter by colour family, UK size and US size. */

(function () {
  const grid = document.querySelector('[data-grid]');
  const countEl = document.querySelector('[data-count]');
  const emptyEl = document.querySelector('[data-empty]');
  if (!grid) return;

  function selected(name) {
    return [...document.querySelectorAll(`[data-filter="${name}"]:checked`)]
      .map(c => c.value);
  }

  function apply() {
    const colors = selected('color');
    const uks = selected('uk').map(Number);
    const uss = selected('us').map(Number);

    const list = PRODUCTS.filter(p => {
      const colorOk = !colors.length || p.colors.some(c => colors.includes(c.family));
      const ukOk = !uks.length || p.ukSizes.some(s => uks.includes(s));
      const usOk = !uss.length || p.ukSizes.some(s => uss.includes(ukToUs(s)));
      return colorOk && ukOk && usOk;
    });

    grid.innerHTML = list.map((p, i) => productCardHTML(p, i)).join('');
    countEl.textContent = list.length + (list.length === 1 ? ' style' : ' styles');
    emptyEl.hidden = list.length > 0;
    if (window.revealScan) window.revealScan();
  }

  document.querySelectorAll('[data-filter]').forEach(c => {
    c.addEventListener('change', apply);
  });

  const clear = document.querySelector('[data-clear]');
  if (clear) {
    clear.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(c => { c.checked = false; });
      apply();
    });
  }

  const toggle = document.querySelector('[data-filter-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.querySelector('.filters').classList.toggle('open');
    });
  }

  apply();
})();
