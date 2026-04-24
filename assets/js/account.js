function initAccount() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const greeting = document.querySelector("#userGreeting");
  if (greeting) greeting.textContent = `Xin chào, ${user.name}`;

  const timeline = document.querySelector("#orderTimeline");
  if (!timeline) return;
  const wishlist = getWishlist();
  const wWrap = document.querySelector("#wishlistBooks");
  wWrap.innerHTML = BOOKS.filter((b) => wishlist.includes(b.id)).map(bookCard).join("");

  const tracking = JSON.parse(localStorage.getItem("tracking") || "null");
  if (!tracking) {
    timeline.innerHTML = "<p>Chưa có đơn hàng nào gần đây.</p>";
    return;
  }

  const renderTracking = () => {
    timeline.innerHTML = ORDER_STEPS.map((s, i) => `
      <div class="timeline-item">
        <strong>${i <= tracking.step ? "✅" : "⏳"} ${s}</strong>
      </div>
    `).join("");
  };
  renderTracking();

  const interval = setInterval(() => {
    if (tracking.step >= ORDER_STEPS.length - 1) {
      clearInterval(interval);
      return;
    }
    tracking.step += 1;
    localStorage.setItem("tracking", JSON.stringify(tracking));
    renderTracking();
  }, 4000);
}

document.addEventListener("DOMContentLoaded", initAccount);
