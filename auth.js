const BACKEND = 'http://127.0.0.1:8000';

// SIGNUP
document.getElementById('signup-btn')?.addEventListener('click', async function() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const errorDiv = document.getElementById('signup-error');

  if (!name || !email || !password) {
    errorDiv.textContent = 'Sab fields bharo!';
    return;
  }

  try {
    const res = await fetch(`${BACKEND}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      window.location.href = 'login.html';
    } else {
      errorDiv.textContent = data.detail || 'Signup failed!';
    }
  } catch {
    errorDiv.textContent = 'Server se connect nahi ho pa raha!';
  }
});

// LOGIN
document.getElementById('login-btn')?.addEventListener('click', async function() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');

  if (!email || !password) {
    errorDiv.textContent = 'Email aur password dono bharo!';
    return;
  }

  try {
    const res = await fetch(`${BACKEND}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      // Token save karo
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      // Main app pe bhejo
      window.location.href = 'index.html';
    } else {
      errorDiv.textContent = data.detail || 'Login failed!';
    }
  } catch {
    errorDiv.textContent = 'Server se connect nahi ho pa raha!';
  }
});