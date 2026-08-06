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

})();
