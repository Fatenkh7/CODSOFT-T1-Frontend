function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
        sidebar.style.display = 'block';
        content.style.marginLeft = '262px';
        toggleBtn.innerText = 'Close Sidebar';

    } else {
        sidebar.style.display = 'none';
        content.style.marginLeft = '0';
        toggleBtn.innerText = 'Open Sidebar';
    }
}

async function checkAuthentication() {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        window.location.href = "access-denied.html";
        return;
    }

    function logout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-id");
        window.location.href = "../../index.html";
    }

    document.getElementById("logout-btn").addEventListener("click", logout);
}


// Run the authentication check when the page loads
window.onload = checkAuthentication;

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const authToken = localStorage.getItem("auth-token");
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            var firstName = document.getElementById("firstName-c").value.trim();
            var lastName = document.getElementById("lastName-c").value.trim();
            var email = document.getElementById("email-c").value.trim();
            var message = document.getElementById("message-c").value.trim();

            if (!email || !message || !firstName || !lastName) {
                alert("Please fill in all fields.");
                return;
            }

            const response = await fetch("https://blog-backend-6b5y.onrender.com/contact/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
                body: JSON.stringify({ email, message, firstName, lastName }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit the form");
            }

            const result = await response.json();

            if (result) {
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert("Message submission failed.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            alert("An error occurred while submitting the form.");
        }
    });
});
