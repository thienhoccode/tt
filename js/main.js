// ===== MAIN JS =====
document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --- MOBILE MENU ---
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('main-nav')?.classList.toggle('open');
  });

  // --- HERO SLIDER ---
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let current = 0, autoPlay;

  const goTo = (n) => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
    // Re-trigger hero text animations
    const activeSlide = slides[current];
    ['.hero__tag','.hero__title','.hero__sub','.hero__cta'].forEach(sel => {
      const el = activeSlide.querySelector(sel);
      if (el) { el.style.animation='none'; el.offsetHeight; el.style.animation=''; }
    });
  };

  const nextSlide = () => goTo(current + 1);
  const startAuto = () => { autoPlay = setInterval(nextSlide, 5000); };
  const resetAuto = () => { clearInterval(autoPlay); startAuto(); };

  document.getElementById('hero-next')?.addEventListener('click', () => { nextSlide(); resetAuto(); });
  document.getElementById('hero-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));
  if (slides.length) startAuto();

  // --- SCROLL ANIMATIONS ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.aos-fade-up, .aos-fade-in, .aos-scale').forEach(el => observer.observe(el));

  // --- BOOK CARD FACTORY ---
  function createBookCard(book) {
    const disc = book.originalPrice ? Math.round((1 - book.price/book.originalPrice)*100) : 0;
    const stars = '★'.repeat(Math.floor(book.rating)) + (book.rating % 1 >= 0.5 ? '½' : '');
    const badgeHTML = book.badge ? `<span class="book-card__badge book-card__badge--${book.badge === 'new' ? 'new' : 'sale'}">${book.badge === 'bestseller' ? 'BEST' : book.badge === 'new' ? 'MỚI' : `-${disc}%`}</span>` : '';
    return `
      <div class="book-card aos-fade-up" style="--delay:${Math.random()*0.3}s">
        <div class="book-card__cover-wrap">
          <div class="book-card__cover-inner">
            <div class="book-card__img">${book.emoji}</div>
          </div>
          <div class="book-card__shadow"></div>
          ${badgeHTML}
          <button class="book-card__wishlist" onclick="toggleWishlist(this,${book.id})" aria-label="Yêu thích">♡</button>
          <div class="book-card__actions">
            <button class="btn btn--gold" onclick="Cart.add(${book.id})">+ Giỏ</button>
            <a href="book-detail.html?id=${book.id}" class="btn btn--ghost">Xem</a>
          </div>
        </div>
        <div class="book-card__info">
          <span class="book-card__cat">${book.cat}</span>
          <a href="book-detail.html?id=${book.id}" class="book-card__title">${book.title}</a>
          <span class="book-card__author">${book.author}</span>
          <div class="book-card__rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${book.reviews.toLocaleString()})</span>
          </div>
          <div class="book-card__price">
            <span class="price-current">${book.price.toLocaleString('vi-VN')}₫</span>
            ${book.originalPrice ? `<span class="price-original">${book.originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
            ${disc ? `<span class="price-discount">-${disc}%</span>` : ''}
          </div>
        </div>
      </div>`;
  }

  // --- SKELETON LOADER ---
  function skeletonCards(n) {
    return Array(n).fill(`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line skeleton-line--short"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line skeleton-line--medium"></div>
          <div class="skeleton skeleton-line skeleton-line--short"></div>
        </div>
      </div>`).join('');
  }

  function loadGrid(gridId, books, count) {
    const el = document.getElementById(gridId);
    if (!el) return;
    el.innerHTML = skeletonCards(count);
    el.querySelectorAll('.skeleton-card,.skeleton').forEach(s => s.classList.add('skeleton'));
    setTimeout(() => {
      el.innerHTML = books.slice(0, count).map(createBookCard).join('');
      el.querySelectorAll('.aos-fade-up').forEach(e => observer.observe(e));
    }, 900);
  }

  // --- POPULATE GRIDS ---
  loadGrid('new-books-grid', BOOKS.filter(b => b.badge === 'new' || b.id <= 5), 5);
  loadGrid('bestseller-grid', BOOKS.filter(b => b.badge === 'bestseller'), 5);

  // Author books
  const authorBooks = document.getElementById('author-books');
  if (authorBooks) {
    authorBooks.innerHTML = BOOKS.slice(0, 3).map(b => `
      <a href="book-detail.html?id=${b.id}" class="book-card" style="cursor:pointer;">
        <div class="book-card__cover-wrap" style="height:180px;">
          <div class="book-card__cover-inner"><div class="book-card__img">${b.emoji}</div></div>
        </div>
        <div class="book-card__info" style="padding:10px;">
          <div class="book-card__title" style="font-size:0.8rem;">${b.title}</div>
          <div class="price-current" style="font-size:0.85rem;">${b.price.toLocaleString('vi-VN')}₫</div>
        </div>
      </a>`).join('');
  }

  // Blog grid
  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid) {
    blogGrid.innerHTML = BLOG_POSTS.map(p => `
      <a href="blog.html?id=${p.id}" class="blog-card aos-fade-up">
        <div class="blog-card__img">${p.emoji}</div>
        <div class="blog-card__body">
          <span class="blog-card__cat">${p.cat}</span>
          <h3 class="blog-card__title">${p.title}</h3>
          <p class="blog-card__excerpt">${p.excerpt}</p>
          <div class="blog-card__meta">
            <span>📅 ${p.date}</span>
            <span>⏱ ${p.readTime} đọc</span>
          </div>
        </div>
      </a>`).join('');
    blogGrid.querySelectorAll('.aos-fade-up').forEach(e => observer.observe(e));
  }

  // --- COUNTDOWN ---
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const end = new Date(); end.setHours(end.getHours() + 23, 59, 59);
    const tick = () => {
      const diff = end - new Date();
      if (diff <= 0) { countdownEl.innerHTML = '<span>Đã kết thúc</span>'; return; }
      const h = String(Math.floor(diff/3600000)).padStart(2,'0');
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
      const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
      countdownEl.innerHTML = `
        <div class="countdown">
          <div class="countdown-item"><span class="countdown-num">${h}</span><span class="countdown-label">Giờ</span></div>
          <div class="countdown-item"><span class="countdown-num">${m}</span><span class="countdown-label">Phút</span></div>
          <div class="countdown-item"><span class="countdown-num">${s}</span><span class="countdown-label">Giây</span></div>
        </div>`;
    };
    tick(); setInterval(tick, 1000);
  }

  // --- NEWSLETTER ---
  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email')?.value;
    if (email) { showToast('success', '✉️ Đăng ký thành công!', `Cảm ơn ${email}`); e.target.reset(); }
  });
});

// --- WISHLIST ---
const wishlist = JSON.parse(localStorage.getItem('tsv_wishlist') || '[]');
function toggleWishlist(btn, id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id); btn.textContent = '♥'; btn.classList.add('active');
    showToast('info', '❤️ Đã thêm yêu thích!', '');
  } else {
    wishlist.splice(idx, 1); btn.textContent = '♡'; btn.classList.remove('active');
  }
  localStorage.setItem('tsv_wishlist', JSON.stringify(wishlist));
}
window.toggleWishlist = toggleWishlist;
