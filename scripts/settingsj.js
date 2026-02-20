/* ========================================
   GLOBAL THEME HANDLER
   Works on ALL pages
======================================== */

document.addEventListener("DOMContentLoaded", function () {

  const root = document.body;
  const themeToggle = document.getElementById("theme-toggle");

  /* Apply Theme */
  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }

  /* Load saved theme */
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  /* If toggle exists (settings page only) */
  if (themeToggle) {

    themeToggle.value = savedTheme;

    themeToggle.addEventListener("change", function () {
      const selectedTheme = this.value;

      localStorage.setItem("theme", selectedTheme);
      applyTheme(selectedTheme);
    });

  }

});