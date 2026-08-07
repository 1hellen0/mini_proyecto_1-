(function () {
  'use strict';

  function getSession() {
    try {
      var raw = localStorage.getItem('quantum_session');
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (s.expires && Date.now() > s.expires) {
        localStorage.removeItem('quantum_session');
        return null;
      }
      return s;
    } catch (e) {
      return null;
    }
  }

  function initials(name) {
    if (!name) return '--';
    return name.trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').toUpperCase().slice(0, 2);
  }

  var session = getSession();

  var nameEl = document.getElementById('userName');
  var avatarBtn = document.getElementById('userAvatar');
  var menu = document.getElementById('userMenu');
  var logoutBtn = document.getElementById('logoutBtn');

  if (nameEl) nameEl.textContent = session ? session.name : 'Invitado';
  if (avatarBtn) avatarBtn.textContent = session ? initials(session.name) : '--';

  if (avatarBtn && menu) {
    avatarBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('show');
      avatarBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.user-dropdown')) {
        menu.classList.remove('show');
        avatarBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.classList.remove('show');
        avatarBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('quantum_session');
      window.location.href = 'login.html';
    });
  }
})();
