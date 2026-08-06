const menuToggle = document.getElementById("menuToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = dropdownMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = event.target.closest(".menu-wrapper");

  if (!clickedInsideMenu) {
    dropdownMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdownMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
