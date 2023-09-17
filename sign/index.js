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

        if (response) {
            // Access the Authorization header to get the token
            const authHeader = response.headers.get("Authorization");
            if (authHeader) {
                const token = authHeader.split(" ")[1];

                // Save the token in local storage
                localStorage.setItem("auth-token", token);

                const responseData = await response.json();

                const message = responseData.message;
                const additionalInfo = "Welcome, " + responseData.user.firstName + " " + responseData.user.lastName + "!";
                const fullMessage = message + "\n" + additionalInfo;

                window.alert(fullMessage);

                window.location.href = "../sideBar/index.html";
            }
        } else {
            // Handle the case where the login request failed
            window.alert("Login failed");
        }
    } catch (error) {
        alert(error.message);
    }
}


async function validateSignUpForm(event) {
    event.preventDefault();

    try {
        var firstName = await document.getElementById("firstName-sUp").value.trim();
        var lastName = await document.getElementById("lastName-sUp").value.trim();
        var email = await document.getElementById("email-sUp").value.trim();
        var phone = await document.getElementById("phone-sUp").value.trim();
        var userName = await document.getElementById("userName-sUp").value.trim();
        var password = await document.getElementById("password-sUp").value.trim();

        if (!email || !password || !firstName || !lastName || !phone || !userName) {
            alert("Please fill in all fields.");
            return;
        }

        const response = await fetch("https://blog-backend-6b5y.onrender.com/user/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, phone, userName, email, password }),
        });

        if (response) {
            const authHeader = response.headers.get("Authorization");
            if (authHeader) {
                const token = authHeader.split(" ")[1];

                // Save the token in local storage
                localStorage.setItem("auth-token", token);

                const responseData = await response.json();
                const message = responseData.message;
                const additionalInfo = "Welcome, " + responseData.newUser.firstName + " " + responseData.newUser.lastName + "!";
                const fullMessage = message + "\n" + additionalInfo;

                window.alert(fullMessage);
                window.location.href = "../sideBar/index.html";
            }
        } else {
            const errorResponseData = await response.json();
            if (errorResponseData && errorResponseData.message) {
                alert(errorResponseData.message);
            } else {
                window.alert("Registration failed");
            }
        }
    } catch (error) {
        window.alert(error.message);
    }
}

