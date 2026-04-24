const money = (n) => `${n.toLocaleString("vi-VN")} VND`;
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
const getWishlist = () =>
  JSON.parse(localStorage.getItem("wishlist") || "[1,5]");
const getCurrentUser = () =>
  JSON.parse(localStorage.getItem("currentUser") || "null");

function stars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function bookCard(book) {
  return `
    <article class="book-card">
      <img src="${book.cover}" alt="${book.title}" />
      <div class="body">
        <p class="genre">${book.genre}</p>
        <h4>${book.title}</h4>
        <p>${book.author}</p>
        <p class="stars">${stars(book.rating)} ${book.rating}</p>
        <p class="price">${money(book.price)}</p>
        <div style="display:flex;gap:8px">
          <a class="btn small" href="book.html?id=${book.id}">Chi tiết</a>
          <button class="btn small primary" onclick="addToCart(${book.id})">Thêm giỏ</button>
        </div>
      </div>
    </article>
  `;
}

function homeBookCard(book, badgeText = "") {
  return `
    <article class="book-card home-modern-card">
      <div class="cover-wrap">
        <img src="${book.cover}" alt="${book.title}" />
        ${badgeText ? `<span class="book-badge">${badgeText}</span>` : ""}
      </div>
      <div class="body">
        <p class="genre">${book.genre}</p>
        <h4>${book.title}</h4>
        <p>${book.author}</p>
        <div class="book-meta">
          <p class="stars">${stars(book.rating)} ${book.rating}</p>
          <span>Đã bán ${book.sold}</span>
        </div>
        <p class="price">${money(book.price)}</p>
        <div class="book-actions">
          <a class="btn small" href="book.html?id=${book.id}">Chi tiết</a>
          <button class="btn small primary" onclick="addToCart(${book.id})">Thêm giỏ</button>
        </div>
      </div>
    </article>
  `;
}

function addToCart(bookId) {
  const cart = getCart();
  const item = cart.find((x) => x.id === bookId);
  if (item) item.qty += 1;
  else cart.push({ id: bookId, qty: 1 });
  setCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector("#cartCount");
  if (!badge) return;
  const totalQty = getCart().reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = totalQty;
}

function initGlobalSearch() {
  const input = document.querySelector("#globalSearch");
  const suggest = document.querySelector("#searchSuggest");
  if (!input || !suggest) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      suggest.style.display = "none";
      return;
    }
    const found = BOOKS.filter((b) =>
      [b.title, b.author, b.genre, b.isbn].some((v) =>
        v.toLowerCase().includes(q),
      ),
    ).slice(0, 5);
    suggest.innerHTML = found
      .map((b) => `<a href="book.html?id=${b.id}">${b.title} - ${b.author}</a>`)
      .join("");
    suggest.style.display = found.length ? "block" : "none";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.trim();
    window.location.href = `search.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  });
}

function initAuthNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const authSlot = nav.querySelector('a[href="login.html"], a[href="account.html"]');
  if (!authSlot) return;
  const user = getCurrentUser();
  const isAccountPage = window.location.pathname.endsWith("account.html");
  const isLoginPage = window.location.pathname.endsWith("login.html");

  if (!user) {
    authSlot.href = "login.html";
    authSlot.textContent = "👤 Đăng nhập";
    authSlot.classList.toggle("active", isLoginPage);
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "auth-menu";
  wrapper.innerHTML = `
    <a href="account.html" class="${isAccountPage ? "active" : ""}">👤 ${user.name || "Tài khoản"}</a>
    <div class="auth-dropdown">
      <a href="account.html">Tài khoản của tôi</a>
      <a href="cart.html">Đơn hàng của tôi</a>
      <button type="button" class="auth-logout-btn">Đăng xuất</button>
    </div>
  `;
  authSlot.replaceWith(wrapper);

  const logoutBtn = wrapper.querySelector(".auth-logout-btn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

function initHome() {
  const featured = document.querySelector("#featuredBooks");
  const newer = document.querySelector("#newBooks");
  const reviews = document.querySelector("#reviews");
  if (!featured || !newer || !reviews) return;

  const HOME_PRODUCT_LIMIT = 1;
  const bySold = [...BOOKS].sort((a, b) => b.sold - a.sold);
  const byNew = [...BOOKS].sort((a, b) => b.year - a.year);
  featured.innerHTML = bySold
    .slice(0, HOME_PRODUCT_LIMIT)
    .map((book, idx) => homeBookCard(book, idx < 3 ? `Top ${idx + 1}` : "Bán chạy"))
    .join("");
  newer.innerHTML = byNew
    .slice(0, HOME_PRODUCT_LIMIT)
    .map((book) => homeBookCard(book, "Mới"))
    .join("");
  reviews.innerHTML = REVIEWS.map(
    (r) => `
    <article>
      <h4>${r.name}</h4>
      <p class="stars">${"★".repeat(r.rating)}</p>
      <p>${r.text}</p>
    </article>
  `,
  ).join("");

  let sec = 47 * 3600 + 59 * 60 + 59;
  const c = document.querySelector("#countdown");
  if (c) {
    setInterval(() => {
      sec = Math.max(0, sec - 1);
      const h = String(Math.floor(sec / 3600)).padStart(2, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      c.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }
}

function initCarousels() {
  if (document.body.classList.contains("home-page")) return;
  const tracks = [...document.querySelectorAll(".carousel-track")];
  if (!tracks.length) return;

  const smoothScrollTo = (el, target, duration = 420) => {
    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) return;
    const startTime = performance.now();
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      el.scrollLeft = start + distance * eased;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const getStep = (track) => {
    const card = track.querySelector(".home-modern-card");
    return card ? card.clientWidth + 12 : 222;
  };

  tracks.forEach((track) => {
    const cards = [...track.children];
    if (!cards.length) return;

    // Infinite loop by cloning both sides.
    const before = cards.map((c) => c.cloneNode(true));
    const after = cards.map((c) => c.cloneNode(true));
    before.forEach((c) => track.prepend(c));
    after.forEach((c) => track.append(c));

    let baseWidth = getStep(track) * cards.length;
    track.scrollLeft = baseWidth;

    const resetInfinite = () => {
      if (track.scrollLeft < baseWidth * 0.5) track.scrollLeft += baseWidth;
      if (track.scrollLeft > baseWidth * 1.5) track.scrollLeft -= baseWidth;
    };

    track.addEventListener("scroll", resetInfinite);
    window.addEventListener("resize", () => {
      baseWidth = getStep(track) * cards.length;
    });

    // Drag to scroll (mouse/touch/pen)
    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    track.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.scrollLeft = startLeft - dx;
    });
    const endDrag = () => {
      isDown = false;
      track.classList.remove("is-dragging");
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    // Autoplay pauses on hover
    let paused = false;
    track.addEventListener("mouseenter", () => (paused = true));
    track.addEventListener("mouseleave", () => (paused = false));

    setInterval(() => {
      if (paused || document.hidden) return;
      const next = track.scrollLeft + getStep(track);
      smoothScrollTo(track, next, 500);
    }, 2600);
  });

  const buttons = document.querySelectorAll(".carousel-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const track = document.getElementById(targetId);
      if (!track) return;
      const step = getStep(track);
      const delta = btn.classList.contains("left") ? -step : step;
      const next = track.scrollLeft + delta;
      smoothScrollTo(track, next);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthNav();
  updateCartBadge();
  initGlobalSearch();
  initHome();
  initCarousels();
});
