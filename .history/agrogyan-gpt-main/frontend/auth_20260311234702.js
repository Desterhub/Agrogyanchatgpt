const API_URL = "http://127.0.0.1:8000";

function showMessage(message, isError = false) {
    const msg = document.getElementById("authMessage");
    msg.innerText = message;
    msg.style.color = isError ? "red" : "green";
}

// LOGIN
async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage("Please enter email and password", true);
        return;
    }

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.message === "Login successful!") {
        localStorage.setItem("user", data.user);
        localStorage.setItem("userId", data.user_id);
        window.location.href = "index.html";
    } else {
        showMessage(data.message, true);
    }
}

// REGISTER (simple prompt version)
async function showRegister() {

    const name = prompt("Enter your full name:");
    if (!name) return;

    const email = prompt("Enter your email:");
    if (!email) return;

    const password = prompt("Create a password (min 6 characters):");
    if (!password || password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.message === "Registration successful!") {
        alert("Registration successful! Now login.");
    } else {
        alert(data.message);
    }
}