document.getElementById("theme-toggle").addEventListener("click", () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  html.setAttribute("data-theme", currentTheme === "dark" ? "" : "dark");

  // Save preference
  localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (
  savedTheme === "dark" ||
  (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.setAttribute("data-theme", "dark");
}
