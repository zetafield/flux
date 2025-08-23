// Mobile menu toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("show");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenuButton.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        mobileMenu.classList.remove("show");
      }
    });

    // Close mobile menu when window resizes to desktop size
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) {
        mobileMenu.classList.remove("show");
      }
    });
  }
});
