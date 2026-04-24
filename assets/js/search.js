function initSearchPage() {
  const input = document.querySelector("#searchPageInput");
  const sort = document.querySelector("#searchSort");
  const results = document.querySelector("#searchResults");
  const meta = document.querySelector("#searchResultMeta");
  if (!input || !sort || !results || !meta) return;

  const params = new URLSearchParams(location.search);
  input.value = params.get("q") || "";

  const scoreBook = (book, q) => {
    const query = q.toLowerCase();
    let score = 0;
    if (book.title.toLowerCase().includes(query)) score += 5;
    if (book.author.toLowerCase().includes(query)) score += 3;
    if (book.genre.toLowerCase().includes(query)) score += 2;
    if (book.isbn.toLowerCase().includes(query)) score += 4;
    return score;
  };

  const levenshtein = (a, b) => {
    const s = a.toLowerCase();
    const t = b.toLowerCase();
    const rows = s.length + 1;
    const cols = t.length + 1;
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i += 1) dp[i][0] = i;
    for (let j = 0; j < cols; j += 1) dp[0][j] = j;
    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = s[i - 1] === t[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost,
        );
      }
    }
    return dp[s.length][t.length];
  };

  const fuzzyScore = (book, q) => {
    const query = q.toLowerCase();
    const fields = [book.title, book.author, book.genre, book.isbn].map((v) =>
      v.toLowerCase(),
    );
    let best = 0;
    fields.forEach((field) => {
      if (field.includes(query)) {
        best = Math.max(best, 1);
        return;
      }
      if (query.length < 3) return;
      const words = field.split(/[\s,:-]+/).filter(Boolean);
      words.forEach((word) => {
        const distance = levenshtein(word, query);
        if (distance <= 2) best = Math.max(best, 1 - distance / query.length);
      });
    });
    return best;
  };

  const suggestionKeywords = (q, limit = 3) => {
    if (!q || q.length < 2) return [];
    const keywords = [...new Set(BOOKS.flatMap((b) => [b.title, b.author, b.genre]))];
    return keywords
      .map((word) => ({ word, distance: levenshtein(word.toLowerCase(), q.toLowerCase()) }))
      .sort((a, b) => a.distance - b.distance)
      .filter((item) => item.distance <= Math.max(2, Math.floor(q.length * 0.45)))
      .slice(0, limit)
      .map((item) => item.word);
  };

  const render = () => {
    const q = input.value.trim();
    let list = BOOKS;
    let usedFuzzy = false;
    if (q) {
      list = BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(q.toLowerCase()) ||
          b.author.toLowerCase().includes(q.toLowerCase()) ||
          b.genre.toLowerCase().includes(q.toLowerCase()) ||
          b.isbn.toLowerCase().includes(q.toLowerCase()),
      );
      if (!list.length) {
        list = BOOKS.filter((b) => fuzzyScore(b, q) >= 0.45);
        usedFuzzy = list.length > 0;
      }
    }

    switch (sort.value) {
      case "popular":
        list = [...list].sort((a, b) => b.sold - a.sold);
        break;
      case "priceAsc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        list = [...list].sort((a, b) => scoreBook(b, q) - scoreBook(a, q));
    }

    if (!q) {
      meta.textContent = `Hiển thị toàn bộ ${list.length} đầu sách.`;
    } else if (usedFuzzy) {
      meta.textContent = `Không có kết quả khớp chính xác cho "${q}", hiển thị ${list.length} kết quả gần đúng.`;
    } else {
      meta.textContent = `Tìm thấy ${list.length} kết quả cho "${q}".`;
    }

    if (list.length) {
      results.innerHTML = list.map((book) => bookCard(book)).join("");
      return;
    }
    const suggestions = suggestionKeywords(q);
    const suggestHtml = suggestions.length
      ? `<p>Gợi ý: ${suggestions.map((word) => `<button class="btn small" data-suggest="${word}">${word}</button>`).join(" ")}</p>`
      : "";
    results.innerHTML = `<p>Không tìm thấy sách phù hợp. Thử từ khóa khác nhé.</p>${suggestHtml}`;
    results.querySelectorAll("[data-suggest]").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.getAttribute("data-suggest") || "";
        history.replaceState(
          null,
          "",
          `search.html?q=${encodeURIComponent(input.value.trim())}`,
        );
        render();
      });
    });
  };

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = input.value.trim();
    history.replaceState(null, "", `search.html${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    render();
  });

  sort.addEventListener("change", render);
  render();
}

document.addEventListener("DOMContentLoaded", initSearchPage);
