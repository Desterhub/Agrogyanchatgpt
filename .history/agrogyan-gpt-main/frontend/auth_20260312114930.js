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

// REGISTER (modal form)
function showRegisterModal() {
    const modal = document.getElementById("registerModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    clearRegisterForm();
    setRegisterMessage("");
}

function hideRegisterModal() {
    const modal = document.getElementById("registerModal");
    if (!modal) return;
    modal.classList.add("hidden");
    setRegisterMessage("");
}

function setRegisterMessage(message, isError = false) {
    const msg = document.getElementById("registerMessage");
    if (!msg) return;
    msg.innerText = message;
    msg.style.color = isError ? "red" : "green";
}

function clearRegisterForm() {
    const name = document.getElementById("regName");
    const email = document.getElementById("regEmail");
    const password = document.getElementById("regPassword");
    if (name) name.value = "";
    if (email) email.value = "";
    if (password) password.value = "";
}

async function registerUser() {
    const name = document.getElementById("regName")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const password = document.getElementById("regPassword")?.value;

    if (!name || !email || !password) {
        setRegisterMessage("Please fill out all fields.", true);
        return;
    }

    if (password.length < 6) {
        setRegisterMessage("Password must be at least 6 characters.", true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.message === "Registration successful!") {
            setRegisterMessage("Registration successful! Redirecting to login...");
            setTimeout(() => {
                hideRegisterModal();
                window.location.href = "login.html";
            }, 1200);
        } else {
            setRegisterMessage(data.message || "Registration failed.", true);
        }
    } catch (err) {
        setRegisterMessage("Unable to register. Please try again.", true);
        console.error("registerUser error", err);
    }
}
