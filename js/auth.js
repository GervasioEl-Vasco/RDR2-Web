function toggleForm() {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Auth system initializing...');
    
    // --- Element References ---
    const authPage = document.getElementById('auth-page');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const loginSubmitForm = document.querySelector('form[name="loginForm"]') || document.getElementById('loginForm');
    const signupSubmitForm = document.querySelector('form[name="signupForm"]') || document.getElementById('signupForm');
    
    // Validasi email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Validasi input
    const validateInputs = (inputs) => {
        for (let input of inputs) {
            if (!input.value.trim()) {
                alert(`${input.placeholder || input.name} tidak boleh kosong!`);
                return false;
            }
        }
        return true;
    };
    
    // UI helper to show logged-in state
    const updateUiForLoggedIn = (user) => {
        console.log('Updating UI for logged in user:', user?.username);
        try { 
            localStorage.setItem('isLoggedIn', 'true');
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch(e) {
            console.error('LocalStorage error:', e);
        }
        
        // Sembunyikan halaman auth
        if (authPage) {
            authPage.style.display = 'none';
            console.log('Auth page hidden');
        }
        
        // Tampilkan user menu di header
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = 'block';
            console.log('User menu shown');
            
            // Update username display jika ada
            const usernameSpan = document.getElementById('username-display');
            if (usernameSpan && user) {
                usernameSpan.textContent = user.username;
            }
        }
        
        // Pastikan konten utama terlihat
        const contentContainer = document.getElementById('content-container');
        if (contentContainer) {
            contentContainer.style.display = 'block';
            console.log('Content container shown');
        }
        
        // Load home page
        if (typeof loadPageContent === 'function') {
            loadPageContent('home', false);
        } else if (typeof navigateToMainApp === 'function') {
            navigateToMainApp(0);
        }
        
        // Dispatch login event untuk module lain
        window.dispatchEvent(new CustomEvent('app:login', { 
            detail: user || { username: 'user' }
        }));
    };

    // Handle login berhasil
    const handleSuccessfulLogin = async (user = null) => {
        console.log('✅ Login successful, handling...');
        
        // Update UI immediately
        updateUiForLoggedIn(user);
        
        // Verify server session (background)
        try {
            const res = await API.checkAuth();
            if (res && res.success) {
                console.log('Server session verified:', res.user);
                // Update dengan data user dari server jika berbeda
                if (!user || user.username !== res.user.username) {
                    updateUiForLoggedIn(res.user);
                }
            }
        } catch (err) {
            console.warn('Server session check failed, using client state');
        }
        
        alert('Login berhasil!');
    };

    // --- Login Authentication Logic ---
    if (loginSubmitForm) {
        console.log('Setting up login form handler...');
        
        // Remove any existing listeners (prevent duplication)
        const newLoginForm = loginSubmitForm.cloneNode(true);
        loginSubmitForm.parentNode.replaceChild(newLoginForm, loginSubmitForm);
        
        newLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔐 Login form submitted');
            
            const usernameOrEmailInput = newLoginForm.querySelector('input[name="username_login"]');
            const passwordInput = newLoginForm.querySelector('input[name="password_login"]');
            const submitBtn = newLoginForm.querySelector('button[type="submit"]');
            
            // Validasi input
            if (!validateInputs([usernameOrEmailInput, passwordInput])) {
                return;
            }
            
            const usernameOrEmail = usernameOrEmailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Disable tombol submit
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sedang login...';

            try {
                console.log('Calling API.login...');
                const result = await API.login(usernameOrEmail, password);
                console.log('Login API response:', result);
                
                if (result.success) {
                    await handleSuccessfulLogin(result.user);
                } else {
                    alert("Login gagal: " + (result.message || 'Username/Email atau password salah'));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert("Terjadi kesalahan saat login. Silakan coba lagi.");
            } finally {
                // Re-enable tombol submit
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    } else {
        console.error('Login form not found!');
    }

    // --- Signup Logic ---
    if (signupSubmitForm) {
        console.log('Setting up signup form handler...');
        
        // Remove any existing listeners
        const newSignupForm = signupSubmitForm.cloneNode(true);
        signupSubmitForm.parentNode.replaceChild(newSignupForm, signupSubmitForm);
        
        newSignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📝 Signup form submitted');
            
            const usernameInput = newSignupForm.querySelector('input[name="username_signup"]');
            const emailInput = newSignupForm.querySelector('input[name="email_signup"]');
            const passwordInput = newSignupForm.querySelector('input[name="password_signup"]');
            const confirmPasswordInput = newSignupForm.querySelector('input[name="confirm_password_signup"]');
            const submitBtn = newSignupForm.querySelector('button[type="submit"]');
            
            // Validasi input
            if (!validateInputs([usernameInput, emailInput, passwordInput, confirmPasswordInput])) {
                return;
            }
            
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            
            // Validasi email format
            if (!validateEmail(email)) {
                alert("Format email tidak valid!");
                return;
            }
            
            // Validasi panjang password
            if (password.length < 6) {
                alert("Password minimal 6 karakter!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Password dan konfirmasi password tidak cocok!");
                return;
            }

            // Disable tombol submit
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sedang mendaftar...';

            try {
                console.log('Calling API.register...');
                const result = await API.register(username, email, password);
                console.log('Register API response:', result);
                
                if (result.success) {
                    alert("Pendaftaran berhasil! Silakan login.");
                    // Reset form
                    newSignupForm.reset();
                    // Switch ke form login
                    toggleForm();
                } else {
                    alert("Pendaftaran gagal: " + (result.message || 'Username atau email sudah terdaftar'));
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
            } finally {
                // Re-enable tombol submit
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // --- Logout Handler ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            console.log('🚪 Logout clicked');
            
            try {
                const result = await API.logout();
                console.log('Logout API response:', result);
            } catch (error) {
                console.error('Logout API error:', error);
            }
            
            // Clear localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            
            // Broadcast logout event
            window.dispatchEvent(new CustomEvent('app:logout'));

            // Sembunyikan user menu
            const userMenu = document.getElementById('user-menu');
            if (userMenu) {
                userMenu.style.display = 'none';
            }
            
            // Sembunyikan main content
            const contentContainer = document.getElementById('content-container');
            if (contentContainer) {
                contentContainer.style.display = 'none';
            }
            
            // Tampilkan auth page
            if (authPage) {
                authPage.style.display = 'flex';
            }
            
            // Reset forms
            const loginForm = document.querySelector('.login-form form');
            const signupForm = document.querySelector('.signup-form form');
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            
            // Reset ke login form
            const loginFormDiv = document.querySelector('.login-form');
            const signupFormDiv = document.querySelector('.signup-form');
            if (loginFormDiv && signupFormDiv) {
                loginFormDiv.style.display = 'block';
                signupFormDiv.style.display = 'none';
            }
            
            alert("Logout berhasil!");
        });
    }

    // --- Check if user already logged in ---
    console.log('Checking auth status...');
    API.checkAuth().then(res => {
        console.log('Auth check response:', res);
        if (res && res.success) {
            updateUiForLoggedIn(res.user);
        } else if (localStorage.getItem('isLoggedIn') === 'true') {
            // fallback to local state
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            updateUiForLoggedIn(user);
        }
    }).catch((error) => {
        console.error('Auth check failed:', error);
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            updateUiForLoggedIn(user);
        }
    });
});
