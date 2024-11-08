// script.js

// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Quiz buttons with hover animations and console log actions
    const quizButtons = document.querySelectorAll(".quiz-button");

    quizButtons.forEach(button => {
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05)";
        });
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
        });
        button.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(`Navigating to ${button.getAttribute('href')}`);
            setTimeout(() => {
                window.location.href = button.getAttribute("href");
            }, 200);
        });
    });

    // Optional: Display console messages for debugging or analytics
    console.log("Home page loaded with interactive quiz buttons!");
});
