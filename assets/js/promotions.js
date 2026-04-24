const PROMO_CODES = [
  { code: "BOOK10", desc: "Giảm 10% tối đa 80.000đ", condition: "Đơn từ 300.000đ" },
  { code: "SALE50K", desc: "Giảm trực tiếp 50.000đ", condition: "Đơn từ 500.000đ" },
  { code: "FREESHIP", desc: "Miễn phí vận chuyển", condition: "Đơn từ 199.000đ" },
];

function initPromotions() {
  const codeWrap = document.querySelector("#promoCodes");
  const flashWrap = document.querySelector("#flashSaleBooks");
  const comboWrap = document.querySelector("#comboBooks");
  if (!codeWrap || !flashWrap || !comboWrap) return;

  codeWrap.innerHTML = PROMO_CODES.map(
    (c) => `
      <article class="promo-code-item">
        <h3>${c.code}</h3>
        <p>${c.desc}</p>
        <small>${c.condition}</small>
      </article>
    `,
  ).join("");

  const flashBooks = [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 6);
  flashWrap.innerHTML = flashBooks.map((b) => bookCard(b)).join("");

  const comboBooks = [...BOOKS].sort((a, b) => b.sold - a.sold).slice(3, 9);
  comboWrap.innerHTML = comboBooks.map((b) => bookCard(b)).join("");
}

document.addEventListener("DOMContentLoaded", initPromotions);
