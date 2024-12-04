
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}

const BASE_URL = "http://localhost:3000/users";


// Chuyển đổi giữa chế độ khách hàng và chủ cửa hàng
document.getElementById("customerBtn").onclick = function () {
  var customerLogin = document.querySelector(".customer-login");
  customerLogin.style.display = "block";
  document.querySelector(".confirm-btn").addEventListener("click", event => {
    alert('Login as Customer');
    window.location.href = 'index.html';
    localStorage.setItem("role", "CUSTOMER");
    localStorage.setItem("token", null);
  });
  document.querySelector(".owner-login").style.display = "none";
};
  
document.getElementById("ownerBtn").onclick = function () {
  document.querySelector(".owner-login").style.display = "block";
  document.querySelector(".customer-login").style.display = "none";
};
  
document.getElementById("ownerLoginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    //lấy thông tin người dùng từ jsonsever users
    const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const users = await response.json();

    if (users.length > 0) {
      // Lấy thông tin phản hồi mô phỏng từ /responses
      const responseMock = await fetch("http://localhost:3000/responses");
      const { login } = await responseMock.json();

      // Lưu token và vai trò vào Local Storage
      localStorage.setItem("token", login.jwt);
      localStorage.setItem("role", users[0].role); // Dùng role từ users

      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while logging in.");
  }
});

// Kiểm tra trạng thái đăng nhập
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role"); // Lấy vai trò từ localStorage
  const roleDisplay = document.getElementById("roleDisplay");
  const loginLink = document.getElementById("loginLink");

  if (role === "MANAGER") {
      roleDisplay.style.display = "inline"; // Hiển thị vai trò "Manager"
      loginLink.style.display = "none"; // Ẩn nút Login
  }
});

// xử lý đăng ký 

