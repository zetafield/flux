document.querySelectorAll(".nav-link").forEach((link) => {
  const href = link.getAttribute("href");

  if (window.location.pathname.includes(href.substring(1))) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
