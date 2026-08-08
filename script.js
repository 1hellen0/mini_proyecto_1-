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

const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');let currentSlide = 0;
let autoPlayInterval;

function goToSlide(index) {
  const totalSlides = track ? track.children.length : 0;
  if (totalSlides === 0) return;
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

function updateDots() {
  [...dotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function restartAutoPlay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 2000);
}

if (track && dotsContainer) {
  [...track.children].forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
      restartAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
  updateDots();
  restartAutoPlay();
}
