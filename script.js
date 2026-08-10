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

const darkModeBtn = document.getElementById('darkModeBtn');

function applyDarkMode(enabled) {
  document.body.classList.toggle('dark', enabled);
  if (darkModeBtn) {
    darkModeBtn.setAttribute('aria-pressed', String(enabled));
  }
  localStorage.setItem('darkMode', enabled ? '1' : '0');
}

if (darkModeBtn) {
  applyDarkMode(localStorage.getItem('darkMode') === '1');
  darkModeBtn.addEventListener('click', () => {
    applyDarkMode(!document.body.classList.contains('dark'));
  });
}

const translatorBtn = document.getElementById('translatorBtn');
const languageMenu = document.getElementById('languageMenu');

function googleTranslateElementInit() {
  if (window.google && google.translate) {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'es,en,fr,de,pt',
      autoDisplay: false
    }, 'google_translate_element');
  }
}

function setLanguage(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

if (translatorBtn && languageMenu) {
  translatorBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = languageMenu.classList.toggle('show');
    translatorBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.translator-wrapper')) {
      languageMenu.classList.remove('show');
      translatorBtn.setAttribute('aria-expanded', 'false');
    }
  });

  languageMenu.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-lang]');
    if (!btn) return;
    languageMenu.classList.remove('show');
    translatorBtn.setAttribute('aria-expanded', 'false');
    const lang = btn.dataset.lang;
    if (lang === 'es') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      location.reload();
    } else {
      setLanguage(lang);
    }
  });
}
