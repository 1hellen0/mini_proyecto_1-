(function(){

  if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark');
  }

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('form-error');
  const googleBtn = document.getElementById('google-btn');

  // ---------- Show / hide password ----------
  function setupPasswordToggle(button, input){
    if (!button || !input) return;
    const eyeOpen = button.querySelector('.eye-open');
    const eyeClosed = button.querySelector('.eye-closed');
    button.addEventListener('click', () => {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.setAttribute('aria-pressed', String(!showing));
      button.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
      eyeOpen.hidden = !showing ? false : true;
      eyeClosed.hidden = !showing ? true : false;
    });
  }

  setupPasswordToggle(
    document.getElementById('toggle-password'),
    document.getElementById('password')
  );
  setupPasswordToggle(
    document.getElementById('toggle-signup-password'),
    document.getElementById('signup-password')
  );
  setupPasswordToggle(
    document.getElementById('toggle-signup-confirm'),
    document.getElementById('signup-confirm')
  );

  // ---------- Basic front-end validation ----------
  function showError(message){
    errorMsg.textContent = message;
    errorMsg.hidden = false;
  }
  function clearError(){
    errorMsg.hidden = true;
    errorMsg.textContent = '';
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // ---------- Local storage ----------
  const USERS_KEY = 'quantum_users';

  function getUsers(){
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveUsers(users){
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e);
    }
  }
  function findUser(email){
    const users = getUsers();
    return users.find(u => u.email === email.toLowerCase());
  }

  function seedDefaultUser(){
    const users = getUsers();
    users.forEach(u => {
      if (!u.role) u.role = 'operador';
    });
    const seed = [
      { name: 'Admin Demo', email: 'admin@enterprise.io', password: 'admin123', role: 'admin' },
      { name: 'Usuario', email: 'tu@correo.com', password: 'clave123', role: 'admin' },
      { name: 'Hellen', email: 'hellen@correo.com', password: 'clave123', role: 'operador' },
      { name: 'Luis Mendez', email: 'luis.mendez@correo.com', password: 'clave123', role: 'admin' }
    ];
    let changed = false;
    seed.forEach(u => {
      const existing = users.find(x => x.email === u.email);
      if (!existing){
        users.push(u);
        changed = true;
      } else if (existing.role !== u.role){
        existing.role = u.role;
        changed = true;
      }
    });
    if (changed) saveUsers(users);
  }
  seedDefaultUser();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    emailInput.classList.remove('invalid');
    passwordInput.classList.remove('invalid');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !isValidEmail(email)){
      emailInput.classList.add('invalid');
      showError('Introduce un correo electrónico válido para continuar.');
      emailInput.focus();
      return;
    }

    if (!password || password.length < 6){
      passwordInput.classList.add('invalid');
      showError('La contraseña debe tener al menos 6 caracteres.');
      passwordInput.focus();
      return;
    }

    let user = findUser(email);
    if (!user){
      seedDefaultUser();
      user = findUser(email);
    }
    if (!user){
      emailInput.classList.add('invalid');
      showError('No se encontró ninguna cuenta con este correo. Solicita acceso para crear una.');
      emailInput.focus();
      return;
    }
    if (user.password !== password){
      emailInput.classList.add('invalid');
      showError('Contraseña incorrecta. Inténtalo de nuevo.');
      passwordInput.focus();
      return;
    }

    const remember = document.getElementById('remember').checked;
    localStorage.setItem('quantum_session', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role || 'operador',
      expires: remember ? Date.now() + (30 * 24 * 60 * 60 * 1000) : null
    }));

    showError('');
    errorMsg.hidden = true;
    window.location.href = 'admin.html';
  });

  googleBtn.addEventListener('click', () => {
    alert('Formulario de demostración: conecta este botón a tu flujo OAuth.');
  });

  // ---------- Toggle login / signup ----------
  const signupWrap = document.getElementById('signup-wrap');
  const formWrap = document.querySelector('.form-wrap');
  const toggleSignup = document.getElementById('toggle-signup');
  const toggleLogin = document.getElementById('toggle-login');
  const signupForm = document.getElementById('signup-form');
  const signupError = document.getElementById('signup-error');
  const signupEmail = document.getElementById('signup-email');

  function showSignup(show){
    formWrap.hidden = show;
    signupWrap.hidden = !show;
    signupError.hidden = true;
  }

  signupEmail.addEventListener('blur', () => {
    const email = signupEmail.value.trim();
    if (isValidEmail(email) && findUser(email)){
      signupError.textContent = 'Ya existe una cuenta con este correo electrónico.';
      signupError.hidden = false;
    } else {
      signupError.hidden = true;
      signupError.textContent = '';
    }
  });

  toggleSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignup(true);
  });

  toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showSignup(false);
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signupError.hidden = true;
    signupError.textContent = '';

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (!name){
      signupError.textContent = 'Introduce tu nombre completo para continuar.';
      signupError.hidden = false;
      return;
    }
    if (!isValidEmail(email)){
      signupError.textContent = 'Introduce un correo electrónico válido para continuar.';
      signupError.hidden = false;
      return;
    }
    if (password.length < 6){
      signupError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      signupError.hidden = false;
      return;
    }
    if (password !== confirm){
      signupError.textContent = 'Las contraseñas no coinciden.';
      signupError.hidden = false;
      return;
    }

    const users = getUsers();
    const emailKey = email.toLowerCase();
    if (users.some(u => u.email === emailKey)){
      signupError.textContent = 'Ya existe una cuenta con este correo electrónico.';
      signupError.hidden = false;
      return;
    }

    users.push({ name, email: emailKey, password, role: 'operador' });
    saveUsers(users);

    alert('Cuenta creada para ' + email);
    showSignup(false);
    emailInput.value = email;
    emailInput.focus();
  });

})();
