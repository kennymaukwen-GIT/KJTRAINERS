/* Shared UI helpers: shoe visual, product card, cart (localStorage), nav. */

const SHOE_ICON = `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M10 50 C10 38 18 36 24 39 L31 42 C34 36 34 30 32 26 C36 28 41 33 45 40 C53 44 62 45 70 51 C72 52 72 55 70 56 L14 56 C11 56 10 53 10 50 Z"/>
  <path d="M14 56 L70 56"/>
  <path d="M35 38 L38 44 M43 41 L46 47 M51 44 L54 49"/>
</svg>`;

function isLight(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
}

/* Placeholder product image: a quiet colour panel of the chosen colourway.
   Swap for <img> tags with real photography for production. */
function shoeVisual(hex, label) {
  const ink = isLight(hex) ? '#1a1a1a' : '#f4f4f2';
  return `<div class="visual" style="background:${hex}">
    <span class="visual-icon" style="color:${ink}">${SHOE_ICON}</span>
    ${label ? `<span class="visual-label" style="color:${ink}">${label}</span>` : ''}
  </div>`;
}

function money(n) {
  return '£' + n;
}

/* Real product photo, with graceful fallback to the colour placeholder
   if the image file is not present in the images/ folder. */
function photoVisual(src, alt) {
  return `<div class="visual visual--photo">
    <img src="${src}" alt="${alt || ''}" loading="lazy"
      onerror="this.closest('.visual').classList.add('img-broken')">
    <span class="visual-fallback">${SHOE_ICON}</span>
  </div>`;
}

/* Use the first colourway's photo when available, otherwise the colour panel. */
function mainVisual(p) {
  const c = p.colors[0];
  return c.image ? photoVisual(c.image, p.name) : shoeVisual(c.hex);
}

/* Product card — LV-style: clean image, centred name + price below. */
function productCardHTML(p, i) {
  return `<a class="product-card" href="product.html?id=${p.id}"
      data-reveal style="transition-delay:${(i || 0) * 70}ms">
    <div class="pc-frame">${mainVisual(p)}</div>
    <div class="pc-info">
      <span class="pc-name">${p.name}</span>
      <span class="pc-price">${money(p.price)}</span>
    </div>
  </a>`;
}

/* ---- Cart (persisted in localStorage) ---- */
const CART_KEY = 'meridian_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}
function setCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  updateCartCount();
}
function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}
function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach(e => {
    e.textContent = cartCount();
  });
}
function addToCart(item) {
  const c = getCart();
  const ex = c.find(i => i.id === item.id && i.color === item.color && i.ukSize === item.ukSize);
  if (ex) ex.qty += item.qty;
  else c.push(item);
  setCart(c);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  const toggle = document.querySelector('[data-nav-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.querySelector('[data-nav]').classList.toggle('open');
    });
  }
});
