function initBlog() {
  const wrap = document.querySelector("#blogPosts");
  if (!wrap) return;
  wrap.innerHTML = BLOG_POSTS.map((p) => `
    <article class="card">
      <small>${p.tag} • ${p.date}</small>
      <h3>${p.title}</h3>
      <p>Nội dung chuyên sâu, tối ưu SEO, giúp tăng traffic và giữ chân độc giả.</p>
      <a class="btn small" href="#">Đọc tiếp</a>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", initBlog);
