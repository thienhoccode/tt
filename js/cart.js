// ===== CART MODULE =====
const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('tsv_cart') || '[]');

  const save = () => localStorage.setItem('tsv_cart', JSON.stringify(items));

  const getCount = () => items.reduce((s, i) => s + i.qty, 0);

  const updateUI = () => {
    const count = getCount();
    document.querySelectorAll('#cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('visible', count > 0);
    });
    renderMiniCart();
  };

  const add = (bookId) => {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const existing = items.find(i => i.id === bookId);
    if (existing) existing.qty++;
    else items.push({ id: bookId, qty: 1 });
    save(); updateUI();
    showToast('success', '📚 Đã thêm vào giỏ!', book.title);
    animateCartIcon();
  };

  const remove = (bookId) => {
    items = items.filter(i => i.id !== bookId);
    save(); updateUI();
  };

  const updateQty = (bookId, delta) => {
    const item = items.find(i => i.id === bookId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    save(); updateUI();
  };

  const getTotal = () => items.reduce((s, i) => {
    const b = BOOKS.find(b => b.id === i.id);
    return s + (b ? b.price * i.qty : 0);
  }, 0);

  const renderMiniCart = () => {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<div class="mini-cart__empty"><div class="empty-icon">🛒</div><p>Giỏ hàng trống</p></div>`;
      if (totalEl) totalEl.textContent = '0₫';
      return;
    }

    container.innerHTML = items.map(item => {
      const b = BOOKS.find(b => b.id === item.id);
      if (!b) return '';
      return `
        <div class="cart-item" data-id="${b.id}">
          <div class="cart-item__img">${b.emoji}</div>
          <div class="cart-item__info">
            <div class="cart-item__title">${b.title}</div>
            <div class="cart-item__author">${b.author}</div>
            <div class="cart-item__price">${(b.price * item.qty).toLocaleString('vi-VN')}₫</div>
            <div class="cart-item__actions">
              <button class="qty-btn" onclick="Cart.updateQty(${b.id},-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="Cart.updateQty(${b.id},1)">+</button>
              <button class="cart-item__remove" onclick="Cart.remove(${b.id})">✕</button>
            </div>
          </div>
        </div>`;
    }).join('');

    if (totalEl) totalEl.textContent = getTotal().toLocaleString('vi-VN') + '₫';
  };

  const animateCartIcon = () => {
    const btn = document.getElementById('cart-btn');
    if (!btn) return;
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);
  };

  const openCart = () => {
    document.getElementById('mini-cart')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    document.getElementById('mini-cart')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  return { add, remove, updateQty, getTotal, getCount, openCart, closeCart, updateUI };
})();

window.Cart = Cart;

// ===== TOAST =====
function showToast(type, title, msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `
    <span class="toast__icon">${icons[type] || '📢'}</span>
    <div class="toast__body">
      <div class="toast__title">${title}</div>
      ${msg ? `<div class="toast__msg">${msg}</div>` : ''}
    </div>
    <span class="toast__close">✕</span>`;
  el.addEventListener('click', () => removeToast(el));
  container.appendChild(el);
  setTimeout(() => removeToast(el), 3500);
}

function removeToast(el) {
  el.classList.add('out');
  setTimeout(() => el.remove(), 400);
}

window.showToast = showToast;

// ===== CART EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateUI();

  document.getElementById('cart-btn')?.addEventListener('click', Cart.openCart);
  document.getElementById('close-cart')?.addEventListener('click', Cart.closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', Cart.closeCart);
});
