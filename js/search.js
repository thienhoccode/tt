// ===== LIVE SEARCH =====
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const closeSearch = document.getElementById('close-search');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  const open = () => {
    overlay?.classList.add('open');
    setTimeout(() => input?.focus(), 100);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (resultsEl) resultsEl.innerHTML = '';
  };

  searchBtn?.addEventListener('click', open);
  closeSearch?.addEventListener('click', close);
  overlay?.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });

  let searchTimer;
  input?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const q = input.value.trim().toLowerCase();
    if (!q) { resultsEl.innerHTML = ''; return; }
    searchTimer = setTimeout(() => runSearch(q), 200);
  });

  function runSearch(q) {
    const matches = BOOKS.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.cat.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!matches.length) {
      resultsEl.innerHTML = `<div class="search-no-result">Không tìm thấy kết quả cho "<strong>${q}</strong>"</div>`;
      return;
    }

    resultsEl.innerHTML = matches.map(b => `
      <a href="book-detail.html?id=${b.id}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('open'); document.body.style.overflow='';">
        <div class="search-result-item__img">${b.emoji}</div>
        <div>
          <div class="search-result-item__title">${highlight(b.title, q)}</div>
          <div class="search-result-item__author">${b.author} · ${b.cat}</div>
        </div>
        <div class="search-result-item__price">${b.price.toLocaleString('vi-VN')}₫</div>
      </a>`).join('');
  }

  function highlight(text, q) {
    const re = new RegExp(`(${q})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(201,168,76,0.3);color:var(--gold);border-radius:2px;">$1</mark>');
  }
});
