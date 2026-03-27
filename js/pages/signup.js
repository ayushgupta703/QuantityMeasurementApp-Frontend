import { registerUser } from "../services/authService.js";

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("signupName").value,
      email: document.getElementById("signupEmail").value,
      password: document.getElementById("signupPassword").value,
      mobile: document.getElementById("signupMobile").value
    };

    try {
      await registerUser(user);
      alert("Signup successful");
      if (window.toggleAuth) {
        window.toggleAuth('login');
      } else {
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      alert(err.message);
    }
  });
}