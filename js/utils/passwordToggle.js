const toggles = document.querySelectorAll(".togglePassword");

toggles.forEach(toggle => {
  toggle.addEventListener("click", function() {
    const wrapper = this.closest('.password-wrapper');
    if (wrapper) {
      const input = wrapper.querySelector('input');
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
      }
    }
  });
});