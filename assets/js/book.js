function initBookDetail() {
  const cover = document.querySelector("#bookCover");
  if (!cover) return;
  const id = Number(new URLSearchParams(location.search).get("id") || 1);
  const book = BOOKS.find((b) => b.id === id) || BOOKS[0];

  document.querySelector("#bookTitle").textContent = book.title;
  const breadcrumbTitle = document.querySelector("#breadcrumbTitle");
  if (breadcrumbTitle) breadcrumbTitle.textContent = book.title;
  document.querySelector("#bookMeta").textContent = `${book.author} • ${book.publisher} • ${book.year}`;
  document.querySelector("#bookDescription").textContent = book.description;
  document.querySelector("#bookRating").textContent = `${stars(book.rating)} ${book.rating}/5`;
  document.querySelector("#bookPrice").textContent = money(book.price);
  document.querySelector("#bookSold").textContent = book.sold.toLocaleString("vi-VN");
  document.querySelector("#bookPages").textContent = book.pages.toLocaleString("vi-VN");
  document.querySelector("#bookIsbn").textContent = book.isbn;
  cover.src = book.cover;
  const tags = document.querySelector("#bookTags");
  if (tags) {
    tags.innerHTML = `
      <span>${book.genre}</span>
      <span>Bestseller</span>
      <span>Giảm 10% khi nhập BOOK10</span>
    `;
  }

  document.querySelector("#bookSpecs").innerHTML = `
    <li>Tác giả: ${book.author}</li>
    <li>Nhà xuất bản: ${book.publisher}</li>
    <li>Năm xuất bản: ${book.year}</li>
    <li>Số trang: ${book.pages}</li>
    <li>ISBN: ${book.isbn}</li>
  `;

  document.querySelector("#addToCartBtn").addEventListener("click", () => addToCart(book.id));
  document.querySelector("#previewBtn").addEventListener("click", () => {
    alert("Bạn đang xem thử 5 trang đầu của sách (demo).");
  });

  document.querySelector("#bookComments").innerHTML = REVIEWS.map((r) => `
    <article><h4>${r.name}</h4><p class="stars">${"★".repeat(r.rating)}</p><p>${r.text}</p></article>
  `).join("");

  const sameGenre = BOOKS.filter((b) => b.genre === book.genre && b.id !== book.id);
  const fallback = [...BOOKS]
    .filter((b) => b.id !== book.id && !sameGenre.some((x) => x.id === b.id))
    .sort((a, b) => b.sold - a.sold);
  const related = [...sameGenre, ...fallback].slice(0, 4);
  document.querySelector("#relatedBooks").innerHTML = related.map(bookCard).join("");
}

document.addEventListener("DOMContentLoaded", initBookDetail);
