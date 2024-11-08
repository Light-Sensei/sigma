// frontend/script.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const signupMessage = document.getElementById("signupMessage");
    const loginMessage = document.getElementById("loginMessage");
    const authButtons = document.getElementById("authButtons");
    const additionalLinks = document.getElementById("additionalLinks");

    const profilePage = document.querySelector(".profile-container");
    const compatibilityPage = document.querySelector(".compatibility-container");

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

            // Add additional links
            if (additionalLinks) {
                additionalLinks.innerHTML = `
                    <div class="additional-links">
                        <a href="profile.html" class="quiz-button">Your Profile</a>
                        <a href="compatibility.html" class="quiz-button">Compare with Friends</a>
                    </div>
                `;
            }
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="login-button" id="loginBtn">Login</a>
            `;

            // Remove additional links if not logged in
            if (additionalLinks) {
                additionalLinks.innerHTML = "";
            }
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

    // Handle Quiz Submission
    const freakQuizForm = document.getElementById("freakQuizForm");
    const quizMessage = document.getElementById("quizMessage");

    if (freakQuizForm) {
        freakQuizForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Collect quiz answers
            const formData = new FormData(freakQuizForm);
            let score = 0;
            for (let [key, value] of formData.entries()) {
                score += parseInt(value); // Assuming each answer has a numeric value
            }

            const token = localStorage.getItem("token");
            if (!token) {
                quizMessage.innerText = "You need to be logged in to submit the quiz.";
                quizMessage.style.color = "red";
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/quizzes/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quizType: "freakQuiz", score }),
                });

                const data = await response.json();

                if (response.ok) {
                    quizMessage.innerText = "Quiz submitted successfully!";
                    quizMessage.style.color = "green";
                    // Optionally, redirect or show results
                } else {
                    quizMessage.innerText = data.message || "Failed to submit quiz.";
                    quizMessage.style.color = "red";
                }
            } catch (err) {
                console.error(err);
                quizMessage.innerText = "An error occurred. Please try again.";
                quizMessage.style.color = "red";
            }
        });
    }

    // Handle Profile Page
    if (profilePage) {
        const userInfo = document.getElementById("userInfo");
        const quizScores = document.getElementById("quizScores");
        const friendsList = document.getElementById("friendsList");
        const addFriendForm = document.getElementById("addFriendForm");
        const addFriendMessage = document.getElementById("addFriendMessage");

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
        } else {
            // Fetch user profile
            fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Handle error (e.g., invalid token)
                    window.location.href = "login.html";
                } else {
                    // Display user info
                    userInfo.innerHTML = `
                        <p><strong>Username:</strong> ${data.username}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>User ID:</strong> ${data._id}</p>
                    `;

                    // Display quiz scores
                    quizScores.innerHTML = `
                        <p><strong>Freak Quiz:</strong> ${data.quizzes.freakQuiz}</p>
                        <p><strong>Brainrot Quiz:</strong> ${data.quizzes.brainrotQuiz}</p>
                        <p><strong>Rizz Quiz:</strong> ${data.quizzes.rizzQuiz}</p>
                    `;

                    // Display friends list
                    if (data.friends.length === 0) {
                        friendsList.innerHTML = `<p>You have no friends added yet.</p>`;
                    } else {
                        const friendsHTML = data.friends.map(friend => `
                            <p>${friend.username} (${friend.email})</p>
                        `).join('');
                        friendsList.innerHTML = friendsHTML;
                    }
                }
            })
            .catch(err => {
                console.error(err);
                window.location.href = "login.html";
            });
        }

        // Handle Add Friend Form Submission
        if (addFriendForm) {
            addFriendForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const friendId = document.getElementById("friendId").value.trim();
                if (!friendId) {
                    addFriendMessage.innerText = "Please enter a valid User ID.";
                    addFriendMessage.style.color = "red";
                    return;
                }

                try {
                    const response = await fetch("http://localhost:5000/api/quizzes/add-friend", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ friendId }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        addFriendMessage.innerText = "Friend added successfully!";
                        addFriendMessage.style.color = "green";
                        // Optionally, refresh the friends list
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        addFriendMessage.innerText = data.message || "Failed to add friend.";
                        addFriendMessage.style.color = "red";
                    }
                } catch (err) {
                    console.error(err);
                    addFriendMessage.innerText = "An error occurred. Please try again.";
                    addFriendMessage.style.color = "red";
                }
            });
        }
    }

    // Handle Compatibility Page
    if (compatibilityPage) {
        const compatibilityForm = document.getElementById("compatibilityForm");
        const friendSelect = document.getElementById("friendSelect");
        const compatibilityResult = document.getElementById("compatibilityResult");

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
        } else {
            // Fetch user profile to get friends
            fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Handle error (e.g., invalid token)
                    window.location.href = "login.html";
                } else {
                    if (data.friends.length === 0) {
                        friendSelect.innerHTML = `<option value="">No friends available</option>`;
                    } else {
                        const options = data.friends.map(friend => `
                            <option value="${friend._id}">${friend.username}</option>
                        `).join('');
                        friendSelect.innerHTML = `<option value="">Select a Friend</option>${options}`;
                    }
                }
            })
            .catch(err => {
                console.error(err);
                window.location.href = "login.html";
            });
        }

        // Handle Compatibility Form Submission
        if (compatibilityForm) {
            compatibilityForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const friendId = document.getElementById("friendSelect").value;
                if (!friendId) {
                    compatibilityResult.innerText = "Please select a friend.";
                    compatibilityResult.style.color = "red";
                    return;
                }

                try {
                    const response = await fetch("http://localhost:5000/api/quizzes/all", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const currentUser = JSON.parse(localStorage.getItem("user"));
                        const friend = data.find(user => user._id === friendId);

                        if (!friend) {
                            compatibilityResult.innerText = "Friend not found.";
                            compatibilityResult.style.color = "red";
                            return;
                        }

                        // Fetch current user's quizzes
                        const userProfileResponse = await fetch("http://localhost:5000/api/auth/me", {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        });
                        const userProfile = await userProfileResponse.json();

                        // Calculate compatibility based on quiz scores
                        let compatibilityScore = 0;
                        const quizzes = ["freakQuiz", "brainrotQuiz", "rizzQuiz"];
                        quizzes.forEach(quiz => {
                            const userScore = userProfile.quizzes[quiz];
                            const friendScore = friend.quizzes[quiz];
                            compatibilityScore += 100 - Math.abs(userScore - friendScore);
                        });
                        compatibilityScore = Math.round(compatibilityScore / quizzes.length);

                        compatibilityResult.innerHTML = `
                            <p>Your compatibility with <strong>${friend.username}</strong> is <strong>${compatibilityScore}%</strong>!</p>
                        `;
                        compatibilityResult.style.color = "#4f8a8b";
                    } else {
                        compatibilityResult.innerText = data.message || "Failed to fetch data.";
                        compatibilityResult.style.color = "red";
                    }
                } catch (err) {
                    console.error(err);
                    compatibilityResult.innerText = "An error occurred. Please try again.";
                    compatibilityResult.style.color = "red";
                }
            });
        }
    }
});
