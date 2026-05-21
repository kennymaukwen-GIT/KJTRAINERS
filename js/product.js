/* Product detail — one page per shoe, colour chosen in-page.
   Each colourway has its own photo gallery; selecting a colour swaps it. */

(function () {
  const root = document.querySelector('[data-pdp]');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  const p = getProduct(id);

  if (!p) {
    root.innerHTML = '<p class="empty" data-reveal>Sorry, we couldn\'t find that shoe. <a href="shop.html">Back to the collection</a>.</p>';
    if (window.revealScan) window.revealScan();
    return;
  }

  document.title = p.name + ' — KJ TRAINERS';
  const num = String(PRODUCTS.indexOf(p) + 1).padStart(2, '0');

  let colorIdx = 0;
  let sizeUk = null;

  /* Figure markup for the currently selected colour. */
  function figureMarkup() {
    const c = p.colors[colorIdx];
    if (c.gallery && c.gallery.length) {
      return `<div class="pg-main" data-pg-main>${photoVisual(c.gallery[0], p.name + ' — ' + c.name)}</div>
        <div class="pg-thumbs">
          ${c.gallery.map((g, i) => `
            <button class="pg-thumb${i === 0 ? ' active' : ''}" data-pg="${i}" aria-label="View ${i + 1}">
              <img src="${g}" alt="" loading="lazy"
                onerror="this.closest('.pg-thumb').classList.add('thumb-broken')">
            </button>`).join('')}
        </div>`;
    }
    return `<div class="pg-main">${shoeVisual(c.hex, p.name + ' — ' + c.name)}</div>`;
  }

  root.innerHTML = `
    <nav class="crumb" data-reveal>
      <a href="shop.html">Collection</a><span>/</span><span>${p.name}</span>
    </nav>
    <div class="pdp">
      <figure class="pdp-figure" data-reveal data-figure></figure>
      <div class="pdp-info">
        <span class="eyebrow" data-reveal>Footwear / No.${num}</span>
        <h1 class="pdp-title" data-reveal style="transition-delay:80ms">${p.name}</h1>
        <div class="pdp-price" data-reveal style="transition-delay:140ms">${money(p.price)}</div>
        <p class="pdp-desc" data-reveal style="transition-delay:200ms">${p.description}</p>

        <div class="pdp-field" data-reveal style="transition-delay:260ms">
          <div class="field-label"><span>Colour</span><span data-color-name>${p.colors[0].name}</span></div>
          <div class="swatches">
            ${p.colors.map((c, i) => `
              <button class="swatch ${i === 0 ? 'active' : ''}" style="background:${c.hex}"
                data-color="${i}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}
          </div>
        </div>

        <div class="pdp-field" data-reveal style="transition-delay:320ms">
          <div class="field-label"><span>Size</span><span>UK / US</span></div>
          <div class="size-grid">
            ${p.ukSizes.map(uk => `
              <button class="size-btn" data-size="${uk}">UK ${uk}<small>US ${ukToUs(uk)}</small></button>`).join('')}
          </div>
        </div>

        <div data-reveal style="transition-delay:380ms">
          <button class="btn btn-fill block" data-add>Add to bag</button>
          <p class="hint" data-hint hidden>Please choose a size first.</p>
          <p class="ship-note">Complimentary worldwide shipping &middot; 30-day returns</p>
        </div>
      </div>
    </div>`;

  const figure = root.querySelector('[data-figure]');
  const colorName = root.querySelector('[data-color-name]');

  /* Thumbnail clicks swap the main image within the current gallery. */
  function bindThumbs() {
    figure.querySelectorAll('[data-pg]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = p.colors[colorIdx];
        const i = +btn.dataset.pg;
        figure.querySelector('[data-pg-main]').innerHTML =
          photoVisual(c.gallery[i], p.name + ' — ' + c.name);
        figure.querySelectorAll('[data-pg]').forEach(b => {
          b.classList.toggle('active', b === btn);
        });
      });
    });
  }

  function renderFigure() {
    figure.innerHTML = figureMarkup();
    bindThumbs();
  }
  renderFigure();

  /* Colour selection swaps the whole gallery. */
  root.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => {
      colorIdx = +btn.dataset.color;
      colorName.textContent = p.colors[colorIdx].name;
      root.querySelectorAll('[data-color]').forEach(b => {
        b.classList.toggle('active', +b.dataset.color === colorIdx);
      });
      renderFigure();
    });
  });

  root.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeUk = +btn.dataset.size;
      root.querySelectorAll('[data-size]').forEach(b => {
        b.classList.toggle('active', +b.dataset.size === sizeUk);
      });
      root.querySelector('[data-hint]').hidden = true;
    });
  });

  root.querySelector('[data-add]').addEventListener('click', () => {
    if (sizeUk == null) {
      root.querySelector('[data-hint]').hidden = false;
      return;
    }
    addToCart({ id: p.id, color: p.colors[colorIdx].name, ukSize: sizeUk, qty: 1 });
    const btn = root.querySelector('[data-add]');
    btn.textContent = 'Added to bag';
    setTimeout(() => { btn.textContent = 'Add to bag'; }, 1600);
  });

  if (window.revealScan) window.revealScan();
})();
