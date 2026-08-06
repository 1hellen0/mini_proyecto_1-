const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

if (menuBtn && dropdownMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = dropdownMenu.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-wrapper')) {
      dropdownMenu.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
