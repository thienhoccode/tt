function fillSelect(id, values) {
  const el = document.querySelector(id);
  if (!el) return;
  el.innerHTML = `<option value="">Tất cả</option>` + values.map((v) => `<option>${v}</option>`).join("");
}

function initCatalog() {
  const container = document.querySelector("#catalogBooks");
  const pagination = document.querySelector("#catalogPagination");
  if (!container) return;

  fillSelect("#genreFilter", [...new Set(BOOKS.map((b) => b.genre))]);
  fillSelect("#authorFilter", [...new Set(BOOKS.map((b) => b.author))]);
  fillSelect("#publisherFilter", [...new Set(BOOKS.map((b) => b.publisher))]);

  const genreFilter = document.querySelector("#genreFilter");
  const authorFilter = document.querySelector("#authorFilter");
  const publisherFilter = document.querySelector("#publisherFilter");
  const priceFilter = document.querySelector("#priceFilter");
  const ratingFilter = document.querySelector("#ratingFilter");
  const sortFilter = document.querySelector("#sortFilter");
  const priceValue = document.querySelector("#priceValue");
  const pageSize = 4;
  let currentPage = 1;
  const urlGenre = new URLSearchParams(window.location.search).get("genre");
  if (urlGenre) genreFilter.value = urlGenre.replaceAll("+", " ");

  function renderPagination(totalItems) {
    if (!pagination) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    currentPage = safePage;
    if (totalItems === 0) {
      pagination.innerHTML = "";
      return;
    }

    const pages = [];
    for (let p = 1; p <= totalPages; p += 1) {
      pages.push(`
        <button class="btn small ${p === currentPage ? "primary" : ""}" data-page="${p}">
          ${p}
        </button>
      `);
    }

    pagination.innerHTML = `
      <button class="btn small" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Trước</button>
      ${pages.join("")}
      <button class="btn small" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Sau</button>
    `;

    pagination.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = Number(btn.getAttribute("data-page"));
        if (!Number.isFinite(page) || page < 1 || page > totalPages || page === currentPage) return;
        currentPage = page;
        render();
      });
    });
  }

  function render() {
    priceValue.textContent = Number(priceFilter.value).toLocaleString("vi-VN");
    let list = BOOKS.filter((b) => {
      return (!genreFilter.value || b.genre === genreFilter.value)
        && (!authorFilter.value || b.author === authorFilter.value)
        && (!publisherFilter.value || b.publisher === publisherFilter.value)
        && b.price <= Number(priceFilter.value)
        && b.rating >= Number(ratingFilter.value);
    });

    switch (sortFilter.value) {
      case "priceAsc": list.sort((a, b) => a.price - b.price); break;
      case "priceDesc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => b.year - a.year); break;
      default: list.sort((a, b) => b.sold - a.sold);
    }

    const start = (currentPage - 1) * pageSize;
    const pageList = list.slice(start, start + pageSize);
    container.innerHTML = pageList.map(bookCard).join("") || "<p>Không tìm thấy sách phù hợp.</p>";
    renderPagination(list.length);
  }

  [genreFilter, authorFilter, publisherFilter, priceFilter, ratingFilter, sortFilter]
    .forEach((el) => el.addEventListener("input", () => {
      currentPage = 1;
      render();
    }));

  document.querySelector("#gridBtn").addEventListener("click", () => {
    container.classList.remove("list-view");
  });
  document.querySelector("#listBtn").addEventListener("click", () => {
    container.classList.add("list-view");
  });

  render();
}

document.addEventListener("DOMContentLoaded", initCatalog);
