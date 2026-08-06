(function(){

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');
  const eyeOpen = toggleBtn.querySelector('.eye-open');
  const eyeClosed = toggleBtn.querySelector('.eye-closed');
  const errorMsg = document.getElementById('form-error');
  const googleBtn = document.getElementById('google-btn');

  // ---------- Show / hide password ----------
  toggleBtn.addEventListener('click', () => {
    const showing = passwordInput.type === 'text';
    passwordInput.type = showing ? 'password' : 'text';
    toggleBtn.setAttribute('aria-pressed', String(!showing));
    toggleBtn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    eyeOpen.hidden = !showing ? false : true;
    eyeClosed.hidden = !showing ? true : false;
  });

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    emailInput.classList.remove('invalid');
    passwordInput.classList.remove('invalid');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !isValidEmail(email)){
      emailInput.classList.add('invalid');
      showError('Enter a valid email address to continue.');
      emailInput.focus();
      return;
    }

    if (!password || password.length < 6){
      passwordInput.classList.add('invalid');
      showError('Password must be at least 6 characters.');
      passwordInput.focus();
      return;
    }

    // Demo only — no real authentication is performed.
    showError('');
    errorMsg.hidden = true;
    alert('Demo form — no backend connected. Inputs passed validation.');
  });

  googleBtn.addEventListener('click', () => {
    alert('Demo form — connect this button to your OAuth flow.');
  });

  // ---------- Toggle login / signup ----------
  const signupWrap = document.getElementById('signup-wrap');
  const formWrap = document.querySelector('.form-wrap');
  const toggleSignup = document.getElementById('toggle-signup');
  const toggleLogin = document.getElementById('toggle-login');
  const signupForm = document.getElementById('signup-form');
  const signupError = document.getElementById('signup-error');

  function showSignup(show){
    formWrap.hidden = show;
    signupWrap.hidden = !show;
    signupError.hidden = true;
  }

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
      signupError.textContent = 'Enter your full name to continue.';
      signupError.hidden = false;
      return;
    }
    if (!isValidEmail(email)){
      signupError.textContent = 'Enter a valid email address to continue.';
      signupError.hidden = false;
      return;
    }
    if (password.length < 6){
      signupError.textContent = 'Password must be at least 6 characters.';
      signupError.hidden = false;
      return;
    }
    if (password !== confirm){
      signupError.textContent = 'Passwords do not match.';
      signupError.hidden = false;
      return;
    }

    alert('Demo form — account created for ' + email);
    showSignup(false);
    emailInput.value = email;
    emailInput.focus();
  });

})();
