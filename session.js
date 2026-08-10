(function () {
  'use strict';

  if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark');
  }

  var darkModeBtn = document.getElementById('darkModeBtn');
  if (darkModeBtn) {
    darkModeBtn.setAttribute('aria-pressed', String(document.body.classList.contains('dark')));
    darkModeBtn.addEventListener('click', function () {
      var enabled = !document.body.classList.contains('dark');
      document.body.classList.toggle('dark', enabled);
      localStorage.setItem('darkMode', enabled ? '1' : '0');
      darkModeBtn.setAttribute('aria-pressed', String(enabled));
    });
  }

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

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  window.QUANTUM_ROLE = session.role || 'operador';
  window.QUANTUM_USER = session;

  var nameEl = document.getElementById('userName');
  var avatarBtn = document.getElementById('userAvatar');
  var menu = document.getElementById('userMenu');
  var logoutBtn = document.getElementById('logoutBtn');
  var roleEl = document.querySelector('.user-role');

  if (nameEl) nameEl.textContent = session.name;
  if (avatarBtn) avatarBtn.textContent = initials(session.name);
  if (roleEl) roleEl.textContent = window.QUANTUM_ROLE === 'admin' ? 'Administrador' : 'Operador';

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
