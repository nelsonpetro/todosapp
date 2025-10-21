// Get current page
const currentPage = window.location.pathname;

// Handle login form (only on login.html)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await api.login({ username, password });
            
            if (response.status === 'success') {
                showNotification('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = '/todos.html';
                }, 500);
            } else {
                showNotification(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            showNotification('Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        }
    });
}

// Handle registration form (only on register.html)
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const name = document.getElementById('register-name').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await api.register({ username, email, name, password });
            
            if (response.status === 'success') {
                showNotification('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 1500);
            } else {
                showNotification(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showNotification('Registration failed. Please try again.', 'error');
            console.error('Registration error:', error);
        }
    });
}

// Handle logout button (only on todos.html)
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await api.logout();
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 500);
        } catch (error) {
            showNotification('Logout failed. Please try again.', 'error');
            console.error('Logout error:', error);
        }
    });
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        const isAuthenticated = data.status === 'success' && data.data;
        
        // Redirect logic based on current page
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            // If on auth pages and already logged in, redirect to todos
            if (isAuthenticated) {
                window.location.href = '/todos.html';
            }
        } else if (currentPage.includes('todos.html')) {
            // If on todos page and not logged in, redirect to login
            if (!isAuthenticated) {
                window.location.href = '/login.html';
            } else {
                // User is authenticated, initialize todos
                if (typeof initializeTodos === 'function') {
                    initializeTodos();
                }
            }
        }
    } catch (error) {
        console.error('Auth status check failed:', error);
        // On error, redirect to login if on todos page
        if (currentPage.includes('todos.html')) {
            window.location.href = '/login.html';
        }
    }
}

// Initialize auth check
checkAuthStatus();