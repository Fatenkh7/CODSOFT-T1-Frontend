function showLoginForm() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signUp-form").style.display = "none";
}

function showSignUpForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signUp-form").style.display = "block";
}

async function validateLoginForm(event) {
    event.preventDefault();

    try {
        var email = document.getElementById("email-l").value.trim();
        var password = document.getElementById("password-l").value.trim();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const response = await fetch("https://blog-backend-6b5y.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const responseData = await response.json();
            const message = responseData.message;
            const additionalInfo = "Welcome, " + responseData.user.firstName + " " + responseData.user.firstName + "!";
            const fullMessage = message + "\n" + additionalInfo;

            window.alert(fullMessage);
            window.location.href = "../sideBar/homePage/index.html";
        } else {
            window.alert("Login failed");
        }
    } catch (error) {
        alert(error.message);
    }
}
