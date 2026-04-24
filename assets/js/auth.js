// auth.js - Xử lý chuyển đổi giữa form đăng nhập và đăng ký

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const switchToRegister = document.getElementById("switchToRegister");
  const switchToLogin = document.getElementById("switchToLogin");

  // Chuyển sang form đăng ký
  switchToRegister.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  });

  // Chuyển sang form đăng nhập
  switchToLogin.addEventListener("click", function (e) {
    e.preventDefault();
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  // Xử lý form đăng nhập (tạm thời chỉ log)
  document
    .querySelector("#loginForm form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const nameFromEmail = email.split("@")[0] || "Bạn đọc";
      const currentUser = {
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        email,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      alert("Đăng nhập thành công!");
      window.location.href = "account.html";
    });

  // Xử lý form đăng ký (tạm thời chỉ log)
  document
    .querySelector("#registerForm form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById(
        "registerConfirmPassword",
      ).value;

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      const currentUser = { name, email };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      alert("Đăng ký thành công!");
      window.location.href = "account.html";
    });
});
