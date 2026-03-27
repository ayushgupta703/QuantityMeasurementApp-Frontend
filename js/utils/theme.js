document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Default to system preference if no localStorage theme
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
  }
  
  // Apply initial theme
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (toggleBtn) toggleBtn.innerHTML = '☀️ Light Mode';
  } else {
    if (toggleBtn) toggleBtn.innerHTML = '🌙 Dark Mode';
  }

  // Bind toggle logic
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      let theme = 'light';
      if (document.body.classList.contains('dark-theme')) {
        theme = 'dark';
        toggleBtn.innerHTML = '☀️ Light Mode';
      } else {
        toggleBtn.innerHTML = '🌙 Dark Mode';
      }
      
      localStorage.setItem('theme', theme);
    });
  }
});
