import { useEffect, useState } from "react";
import "../styles/theme-toggle.css";

function ThemeToggle({ detached = false }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button 
      className={`theme-toggle-btn ${detached ? 'detached' : ''}`} 
      onClick={toggle} 
      title="Toggle Theme"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default ThemeToggle;
