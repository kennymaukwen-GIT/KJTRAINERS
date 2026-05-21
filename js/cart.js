/* Bag + checkout. Card fields are NOT built here — in production the
   checkout button creates a Stripe Checkout Session server-side and
   redirects to Stripe's hosted, PCI-compliant payment page. The site
   never sees or stores card numbers or CVV. */

(function () {
  const root = document.querySelector('[data-cart]');
  if (!root) return;

  function rowHTML(it, idx) {
    const p = getProduct(it.id);
    const c = p.colors.find(x => x.name === it.color) || p.colors[0];
    const fig = c.image ? photoVisual(c.image, p.name) : shoeVisual(c.hex);
    return `<div class="cart-row">
      <div class="cr-figure">${fig}</div>
      <div class="cr-info">
        <div class="cr-name">${p.name}</div>
        <div class="cr-meta">${it.color} &middot; UK ${it.ukSize} / US ${ukToUs(it.ukSize)}</div>
        <div class="qty">
          <button data-dec="${idx}" aria-label="Decrease">&minus;</button>
          <span>${it.qty}</span>
          <button data-inc="${idx}" aria-label="Increase">+</button>
        </div>
        <button class="link-btn" data-rm="${idx}">Remove</button>
      </div>
      <div class="cr-price">${money(p.price * it.qty)}</div>
    </div>`;
  }

  function render() {
    const cart = getCart();

    if (!cart.length) {
      root.innerHTML = `<div class="empty">
        <p>Your bag is empty.</p>
        <a class="btn" href="shop.html">View the collection</a>
      </div>`;
      return;
    }

    const subtotal = cart.reduce((s, it) => s + getProduct(it.id).price * it.qty, 0);

    root.innerHTML = `<div class="cart-layout">
      <div class="cart-items">${cart.map(rowHTML).join('')}</div>
      <aside class="summary">
        <h3 class="summary-title">Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Complimentary</span></div>
        <div class="summary-row summary-total"><span>Total</span><span>${money(subtotal)}</span></div>
        <button class="btn btn-fill block" data-checkout>Proceed to payment</button>
        <p class="pay-note">Payment is completed on Stripe's secure, PCI-compliant
        checkout. Card number and CVV are entered on Stripe &mdash; this site never
        sees or stores them. Duties &amp; taxes are calculated at checkout for
        worldwide delivery.</p>
      </aside>
    </div>`;
    bind();
  }

  function bind() {
    root.querySelectorAll('[data-inc]').forEach(b => {
      b.addEventListener('click', () => {
        const c = getCart(); c[+b.dataset.inc].qty++; setCart(c); render();
      });
    });
    root.querySelectorAll('[data-dec]').forEach(b => {
      b.addEventListener('click', () => {
        const c = getCart(); const i = +b.dataset.dec;
        c[i].qty--; if (c[i].qty < 1) c.splice(i, 1);
        setCart(c); render();
      });
    });
    root.querySelectorAll('[data-rm]').forEach(b => {
      b.addEventListener('click', () => {
        const c = getCart(); c.splice(+b.dataset.rm, 1); setCart(c); render();
      });
    });
    root.querySelector('[data-checkout]').addEventListener('click', checkout);
  }

  function checkout() {
    root.innerHTML = `<div class="confirm">
      <h2>Order confirmed</h2>
      <p>Thank you &mdash; this is a demo confirmation. In production the
      &ldquo;Proceed to payment&rdquo; button creates a Stripe Checkout Session
      on your server and redirects the customer to Stripe's hosted payment page.</p>
      <p class="pay-note">No card data is handled by this website. Stripe collects
      the card number and CVV on its own secure domain, keeping the store
      PCI-DSS compliant.</p>
      <a class="btn" href="shop.html">Continue shopping</a>
    </div>`;
    setCart([]);
  }

  render();
})();
