const API_URL = window.AGRO_API_URL || "http://127.0.0.1:8000";
let pendingRegistration = null;

function showMessage(message, isError = false) {
    const msg = document.getElementById("authMessage");
    msg.innerText = message;
    msg.style.color = isError ? "red" : "green";
}

function isValidEmail(email) {
    // Simple validation suitable for UI feedback
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}

function setActionButtonState(buttonId, isLoading) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    const spinner = btn.querySelector(".btn-spinner");
    const text = btn.querySelector(".btn-text");

    btn.disabled = isLoading;
    if (spinner) spinner.classList.toggle("hidden", !isLoading);
    if (text) {
        if (isLoading) {
            if (buttonId === "loginButton") {
                text.textContent = typeof t === "function" ? t("loggingIn") : "Logging in...";
            } else if (buttonId === "sendOtpButton") {
                text.textContent = typeof t === "function" ? t("sendingOtp") : "Sending OTP...";
            } else {
                text.textContent = typeof t === "function" ? t("registering") : "Registering...";
            }
        } else {
            if (buttonId === "loginButton") {
                text.textContent = typeof t === "function" ? t("login") : "Login";
            } else if (buttonId === "sendOtpButton") {
                text.textContent = typeof t === "function" ? t("sendOtp") : "Send OTP";
            } else {
                text.textContent = typeof t === "function" ? t("verifyOtpRegister") : "Verify OTP & Register";
            }
        }
    }
}

function getUserStorageKey(baseKey, userId) {
    return userId ? `${baseKey}_${userId}` : baseKey;
}

function hydrateRecentRegistration() {
    const emailInput = document.getElementById("email");
    const recentEmail = localStorage.getItem("lastRegisteredEmail");
    if (emailInput && recentEmail && !emailInput.value) {
        emailInput.value = recentEmail;
    }
}

function collectRegistrationPayload() {
    return {
        name: document.getElementById("regName")?.value.trim(),
        email: document.getElementById("regEmail")?.value.trim(),
        password: document.getElementById("regPassword")?.value,
        mobile_number: document.getElementById("regMobile")?.value.trim(),
        date_of_birth: document.getElementById("regDob")?.value,
        state: document.getElementById("regState")?.value,
        district: document.getElementById("regDistrict")?.value,
        preferred_language: document.getElementById("regPreferredLanguage")?.value || "English",
        otp_channel: document.getElementById("regOtpChannel")?.value || "sms",
        role: document.getElementById("regRole")?.value || "farmer"
    };
}

function validateRegistrationPayload(payload) {
    if (!payload.name || !payload.email || !payload.password || !payload.mobile_number || !payload.date_of_birth || !payload.state || !payload.district) {
        return t("fillAllFields");
    }
    if (!isValidEmail(payload.email)) {
        return t("invalidEmail");
    }
    if (payload.password.length < 6) {
        return t("passwordTooShort");
    }
    if (!isValidMobile(payload.mobile_number)) {
        return typeof t === "function" ? t("validMobileNumber") : "Please enter a valid 10-digit mobile number";
    }
    return "";
}

// LOGIN
async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage(t("enterEmailPassword"), true);
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(t("invalidEmail"), true);
        return;
    }

    if (password.length < 6) {
        showMessage(t("passwordTooShort"), true);
        return;
    }

    setActionButtonState("loginButton", true);
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.message === "Login successful!") {
            localStorage.setItem("user", data.user);
            localStorage.setItem("userId", data.user_id);
            localStorage.setItem("userEmail", data.email || email);
            localStorage.setItem("userMobile", data.mobile_number || "");
            localStorage.setItem("userDob", data.date_of_birth || "");
            localStorage.setItem("userState", data.state || "");
            localStorage.setItem("userDistrict", data.district || "");
            localStorage.setItem("crop_name", data.crop_name || "");
            localStorage.setItem("land_size", data.land_size || "");
            localStorage.setItem("soil_type", data.soil_type || "");
            localStorage.setItem("season", data.season || "");
            localStorage.setItem("village", data.village || "");
            localStorage.setItem("preferred_language", data.preferred_language || "");
            localStorage.setItem("simple_mode", data.simple_mode || "off");
            localStorage.setItem("userRole", data.role || "farmer");
            localStorage.setItem("isAdmin", data.role === "admin" ? "yes" : "no");
            localStorage.setItem("phoneVerified", data.phone_verified ? "yes" : "no");
            const joinDateKey = getUserStorageKey("joinDate", data.user_id);
            if (!localStorage.getItem(joinDateKey)) {
                localStorage.setItem(joinDateKey, new Date().toISOString());
            }
            window.location.replace(data.role === "admin" ? "admin.html" : "index.html");
        } else {
            showMessage(data.message, true);
        }
    } catch (err) {
        showMessage(t("unableToLogin"), true);
        console.error("login error", err);
    } finally {
        setActionButtonState("loginButton", false);
    }
}

// REGISTER (modal form)
function showRegisterModal() {
    const modal = document.getElementById("registerModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    clearRegisterForm();
    setRegisterMessage("");
    const first = document.getElementById("regName");
    if (first) {
        first.focus();
    }
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
    const mobile = document.getElementById("regMobile");
    const dob = document.getElementById("regDob");
    const state = document.getElementById("regState");
    const district = document.getElementById("regDistrict");
    const otp = document.getElementById("regOtp");
    if (name) name.value = "";
    if (email) email.value = "";
    if (password) password.value = "";
    if (mobile) mobile.value = "";
    if (dob) dob.value = "";
    if (otp) otp.value = "";
    if (state) state.value = "";
    if (district) {
        district.innerHTML = '<option value="">Select district / city</option>';
        district.disabled = true;
    }
    pendingRegistration = null;
}

async function sendRegistrationOtp(isResend = false) {
    const payload = collectRegistrationPayload();
    const validationError = validateRegistrationPayload(payload);
    if (validationError) {
        setRegisterMessage(validationError, true);
        return;
    }

    setActionButtonState("sendOtpButton", true);

    try {
        const response = await fetch(`${API_URL}/auth/send-registration-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok && data.otp_session_id) {
            pendingRegistration = payload;
            localStorage.setItem("pendingRegistrationEmail", payload.email);
            localStorage.setItem("pendingRegistrationMobile", payload.mobile_number);
            const debugOtpNote = data.debug_otp ? ` Demo OTP: ${data.debug_otp}` : "";
            const resendText = isResend
                ? (typeof t === "function" ? t("otpResent") : "OTP resent.")
                : (typeof t === "function" ? t("otpSent") : "OTP sent.");
            const otpInstruction = typeof t === "function"
                ? t("otpInstruction")
                : "Check your phone and enter the 6-digit code.";
            setRegisterMessage(`${resendText} ${otpInstruction}${debugOtpNote}`);
            const otpInput = document.getElementById("regOtp");
            if (otpInput) otpInput.focus();
        } else {
            setRegisterMessage(data.message || (typeof t === "function" ? t("unableToSendOtp") : "Unable to send OTP right now."), true);
        }
    } catch (err) {
        setRegisterMessage(typeof t === "function" ? t("unableToSendOtp") : "Unable to send OTP right now.", true);
        console.error("sendRegistrationOtp error", err);
    } finally {
        setActionButtonState("sendOtpButton", false);
    }
}

async function registerUser() {
    const payload = collectRegistrationPayload();
    const validationError = validateRegistrationPayload(payload);
    if (validationError) {
        setRegisterMessage(validationError, true);
        return;
    }

    const otp = document.getElementById("regOtp")?.value.trim();
    if (!otp || otp.length !== 6) {
        setRegisterMessage(typeof t === "function" ? t("enterOtpPrompt") : "Enter the 6-digit OTP sent to your phone.", true);
        return;
    }

    setActionButtonState("registerButton", true);

    try {
        const response = await fetch(`${API_URL}/auth/verify-registration-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone_number: payload.mobile_number,
                email: payload.email,
                otp,
                otp_channel: payload.otp_channel
            })
        });

        const data = await response.json();

        if (data.message === "Registration successful!") {
            // Persist basic user info for profile
            localStorage.setItem("userEmail", payload.email);
            localStorage.setItem("userMobile", payload.mobile_number);
            localStorage.setItem("userDob", payload.date_of_birth);
            localStorage.setItem("userState", payload.state);
            localStorage.setItem("userDistrict", payload.district);
            localStorage.setItem("preferred_language", payload.preferred_language);
            localStorage.setItem("lastRegisteredEmail", payload.email);
            localStorage.setItem("userRole", payload.role);
            localStorage.setItem("phoneVerified", "yes");
            if (data.user_id) {
                localStorage.setItem(getUserStorageKey("joinDate", data.user_id), new Date().toISOString());
            }

            setRegisterMessage(t("registrationSuccess"));
            hideRegisterModal();
            const loginEmail = document.getElementById("email");
            if (loginEmail) {
                loginEmail.value = payload.email;
            }
            window.location.href = "login.html";
        } else {
            setRegisterMessage(data.message || t("registrationFailed"), true);
        }
    } catch (err) {
        setRegisterMessage(t("unableToRegister"), true);
        console.error("registerUser error", err);
    } finally {
        setActionButtonState("registerButton", false);
    }
}

document.addEventListener("DOMContentLoaded", hydrateRecentRegistration);
window.sendRegistrationOtp = sendRegistrationOtp;
