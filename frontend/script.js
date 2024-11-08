// frontend/script.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const signupMessage = document.getElementById("signupMessage");
    const loginMessage = document.getElementById("loginMessage");
    const authButtons = document.getElementById("authButtons");

    // Function to check authentication status
    const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (token) {
            authButtons.innerHTML = `
                <a href="#" class="login-button" id="logoutBtn">Logout</a>
            `;
            document.getElementById("logoutBtn").addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "index.html";
            });
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="login-button" id="loginBtn">Login</a>
            `;
        }
    };

    checkAuth();

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("http://localhost:5000/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Save token and user info
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // Redirect to home page
                    window.location.href = "index.html";
                } else {
                    signupMessage.innerText = data.message || "Signup failed.";
                    signupMessage.style.color = "red";
                }
            } catch (err) {
                console.error(err);
                signupMessage.innerText = "An error occurred. Please try again.";
                signupMessage.style.color = "red";
            }
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Save token and user info
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // Redirect to home page
                    window.location.href = "index.html";
                } else {
                    loginMessage.innerText = data.message || "Login failed.";
                    loginMessage.style.color = "red";
                }
            } catch (err) {
                console.error(err);
                loginMessage.innerText = "An error occurred. Please try again.";
                loginMessage.style.color = "red";
            }
        });
    }
});
