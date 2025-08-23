import "./js/main.js";

document.querySelectorAll(".nav-link").forEach((link) => {
  const href = link.getAttribute("href");
  console.log("href", href);
  console.log(href.substring(1));
  console.log(window.location.pathname);
  if (window.location.pathname.includes(href.substring(1))) {
    link.classList.add("bg-indigo-600", "text-white");
  } else {
    link.classList.add("text-gray-500", "hover:text-gray-700");
  }
});
