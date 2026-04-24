function renderCart() {
  const wrap = document.querySelector("#cartItems");
  const checkoutGrid = document.querySelector(".checkout-grid");
  if (!wrap) return;
  const cart = getCart();
  if (!cart.length) {
    wrap.innerHTML = "<p>Giỏ hàng trống. Hãy thêm sách bạn yêu thích.</p>";
    if (checkoutGrid) checkoutGrid.style.display = "none";
    updateTotals(0, 0);
    return;
  }
  if (checkoutGrid) checkoutGrid.style.display = "grid";

  wrap.innerHTML = cart.map((i) => {
    const b = BOOKS.find((x) => x.id === i.id);
    return `
      <div style="display:grid;grid-template-columns:1fr auto auto auto;gap:10px;align-items:center;border-bottom:1px solid #e2e8f0;padding:10px 0">
        <span>${b.title}</span>
        <span>${money(b.price)}</span>
        <input type="number" min="1" value="${i.qty}" style="width:70px" onchange="updateQty(${i.id}, this.value)" />
        <button class="btn small" onclick="removeItem(${i.id})">Xóa</button>
      </div>
    `;
  }).join("");

  const subtotal = cart.reduce((sum, i) => {
    const b = BOOKS.find((x) => x.id === i.id);
    return sum + b.price * i.qty;
  }, 0);
  updateTotals(subtotal, Number(localStorage.getItem("discount") || 0));
}

function updateTotals(subtotal, discount) {
  document.querySelector("#subtotal").textContent = money(subtotal);
  document.querySelector("#discount").textContent = money(discount);
  document.querySelector("#total").textContent = money(Math.max(0, subtotal - discount));
}

function updateQty(id, qty) {
  const cart = getCart().map((i) => i.id === id ? { ...i, qty: Number(qty) } : i);
  setCart(cart);
  updateCartBadge();
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter((i) => i.id !== id);
  setCart(cart);
  updateCartBadge();
  renderCart();
}

function initCheckout() {
  const cartItems = document.querySelector("#cartItems");
  if (!cartItems) return;
  renderCart();

  const applyCouponBtn = document.querySelector("#applyCouponBtn");
  const placeOrderBtn = document.querySelector("#placeOrderBtn");
  applyCouponBtn?.addEventListener("click", () => {
    if (!getCart().length) return;
    const subtotal = getCart().reduce((sum, i) => sum + BOOKS.find((b) => b.id === i.id).price * i.qty, 0);
    const code = document.querySelector("#couponInput").value.trim().toUpperCase();
    const discount = code === "BOOK10" ? Math.round(subtotal * 0.1) : (code === "SALE50K" ? 50000 : 0);
    localStorage.setItem("discount", discount);
    updateTotals(subtotal, discount);
  });

  placeOrderBtn?.addEventListener("click", () => {
    if (!getCart().length) return;
    const tracking = { step: 0, updatedAt: Date.now() };
    localStorage.setItem("tracking", JSON.stringify(tracking));
    setCart([]);
    localStorage.removeItem("discount");
    updateCartBadge();
    alert("Đặt hàng thành công! Đã gửi email xác nhận (demo) và bắt đầu theo dõi đơn hàng realtime.");
    location.href = "account.html";
  });
}

document.addEventListener("DOMContentLoaded", initCheckout);
