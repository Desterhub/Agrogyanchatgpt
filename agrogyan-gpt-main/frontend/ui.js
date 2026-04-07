const INDIA_LOCATIONS = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Kadapa", "Kakinada", "Kurnool", "Nellore", "Rajahmundry", "Tirupati", "Visakhapatnam", "Vijayawada"],
    "Arunachal Pradesh": ["Bomdila", "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
    "Assam": ["Dibrugarh", "Guwahati", "Jorhat", "Nagaon", "Silchar", "Tezpur"],
    "Bihar": ["Bhagalpur", "Darbhanga", "Gaya", "Muzaffarpur", "Patna", "Purnia"],
    "Chhattisgarh": ["Bilaspur", "Durg", "Jagdalpur", "Korba", "Raigarh", "Raipur"],
    "Goa": ["Bicholim", "Madgaon", "Mapusa", "Panaji", "Ponda", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Bhavnagar", "Gandhinagar", "Jamnagar", "Rajkot", "Surat", "Vadodara"],
    "Haryana": ["Ambala", "Faridabad", "Gurugram", "Hisar", "Karnal", "Panipat", "Rohtak"],
    "Himachal Pradesh": ["Dharamshala", "Hamirpur", "Kullu", "Mandi", "Shimla", "Solan"],
    "Jharkhand": ["Bokaro", "Deoghar", "Dhanbad", "Hazaribagh", "Jamshedpur", "Ranchi"],
    "Karnataka": ["Belagavi", "Bengaluru", "Davanagere", "Hubballi", "Kalaburagi", "Mangaluru", "Mysuru", "Shivamogga"],
    "Kerala": ["Alappuzha", "Ernakulam", "Kannur", "Kochi", "Kollam", "Kozhikode", "Palakkad", "Thiruvananthapuram", "Thrissur"],
    "Madhya Pradesh": ["Bhopal", "Gwalior", "Indore", "Jabalpur", "Ratlam", "Rewa", "Sagar", "Ujjain"],
    "Maharashtra": ["Ahmednagar", "Amravati", "Aurangabad", "Kolhapur", "Nagpur", "Nashik", "Pune", "Sangli", "Satara", "Solapur", "Thane"],
    "Manipur": ["Bishnupur", "Churachandpur", "Imphal", "Kakching", "Senapati", "Thoubal"],
    "Meghalaya": ["Jowai", "Nongpoh", "Shillong", "Tura", "Williamnagar"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lunglei", "Saiha"],
    "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Tuensang", "Wokha"],
    "Odisha": ["Balasore", "Berhampur", "Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur"],
    "Punjab": ["Amritsar", "Bathinda", "Jalandhar", "Ludhiana", "Mohali", "Patiala"],
    "Rajasthan": ["Ajmer", "Alwar", "Bikaner", "Jaipur", "Jodhpur", "Kota", "Sikar", "Udaipur"],
    "Sikkim": ["Gangtok", "Geyzing", "Mangan", "Namchi", "Pakyong"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Erode", "Madurai", "Salem", "Thanjavur", "Tiruchirappalli", "Tirunelveli", "Vellore"],
    "Telangana": ["Hyderabad", "Karimnagar", "Khammam", "Nalgonda", "Nizamabad", "Warangal"],
    "Tripura": ["Agartala", "Belonia", "Dharmanagar", "Kailashahar", "Udaipur"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Bareilly", "Ghaziabad", "Gorakhpur", "Jhansi", "Kanpur", "Lucknow", "Meerut", "Noida", "Prayagraj", "Varanasi"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Kashipur", "Nainital", "Roorkee"],
    "West Bengal": ["Asansol", "Durgapur", "Howrah", "Kharagpur", "Kolkata", "Malda", "Siliguri"],
    "Andaman and Nicobar Islands": ["Car Nicobar", "Diglipur", "Mayabunder", "Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi": ["Central Delhi", "Dwarka", "New Delhi", "North Delhi", "Rohini", "South Delhi"],
    "Jammu and Kashmir": ["Anantnag", "Baramulla", "Jammu", "Pulwama", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh", "Nubra", "Zanskar"],
    "Lakshadweep": ["Agatti", "Amini", "Kavaratti", "Minicoy"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};
const ADMIN_EMAIL = "harsh@07gmail.com";

function isAdminUser() {
    const currentUser = localStorage.getItem("user");
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    const email = (localStorage.getItem("userEmail") || "").toLowerCase();
    return Boolean(currentUser) && (role === "admin" || email === ADMIN_EMAIL);
}

function goToAdminPanel() {
    if (!isAdminUser()) {
        window.location.replace("login.html");
        return;
    }
    window.location.href = "admin.html";
}

function injectAdminNavButton() {
    if (!isAdminUser()) return;
    if (window.location.pathname.toLowerCase().endsWith("admin.html")) return;

    const topActions = document.querySelector(".top-actions");
    const topBar = document.querySelector(".top-bar");
    if (!topActions || document.getElementById("adminNavButton")) return;

    const button = document.createElement("button");
    button.id = "adminNavButton";
    button.className = "nav-btn";
    button.type = "button";
    button.innerText = "Admin Panel";
    button.addEventListener("click", goToAdminPanel);

    const authButton = document.getElementById("authButton");
    if (authButton) {
        topActions.insertBefore(button, authButton);
    } else {
        topActions.appendChild(button);
    }

    topActions.classList.add("admin-actions-row");
    if (topBar) {
        topBar.classList.add("with-admin-nav");
    }
}

function prefetchCorePages() {
    ["index.html", "my-farm.html", "crop-care.html", "market.html", "community.html", "profile.html", "schemes.html", "admin.html"].forEach((href) => {
        if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        document.head.appendChild(link);
    });
}

function populateIndiaLocationSelectors(stateId = "regState", districtId = "regDistrict") {
    const stateSelect = document.getElementById(stateId);
    const districtSelect = document.getElementById(districtId);

    if (!stateSelect || !districtSelect) return;

    const stateNames = Object.keys(INDIA_LOCATIONS);

    if (!stateSelect.dataset.loaded) {
        const selectStateText = typeof t === "function" ? t("selectState") : "Select state";
        stateSelect.innerHTML = `<option value="">${selectStateText}</option>` + stateNames.map(state => `<option value="${state}">${state}</option>`).join("");
        stateSelect.dataset.loaded = "1";
    }

    const fillDistricts = (selectedState) => {
        const districts = INDIA_LOCATIONS[selectedState] || [];
        const selectDistrictText = typeof t === "function" ? t("selectDistrictCity") : "Select district / city";
        districtSelect.innerHTML = `<option value="">${selectDistrictText}</option>` + districts.map(place => `<option value="${place}">${place}</option>`).join("");
        districtSelect.disabled = !selectedState;
    };

    stateSelect.addEventListener("change", () => fillDistricts(stateSelect.value));
    fillDistricts(stateSelect.value);
}

function injectFarmBot() {
    if (document.getElementById("farmBot")) return;

    const bot = document.createElement("div");
    bot.id = "farmBot";
    bot.className = "farm-bot";
    bot.setAttribute("aria-hidden", "true");
    bot.innerHTML = `
        <div class="farm-bot-shadow"></div>
        <div class="farm-bot-frame"></div>
        <div class="farm-bot-backdrop"></div>
        <div class="farm-bot-leaf leaf-a"></div>
        <div class="farm-bot-leaf leaf-b"></div>
        <div class="farm-bot-hat">
            <span class="hat-band"></span>
        </div>
        <div class="farm-bot-head">
            <div class="farm-bot-face">
                <span class="farm-bot-eye left"></span>
                <span class="farm-bot-eye right"></span>
                <span class="farm-bot-heart"></span>
                <span class="farm-bot-mouth"></span>
            </div>
        </div>
        <div class="farm-bot-neck"></div>
        <div class="farm-bot-body">
            <span class="farm-bot-shirt"></span>
            <span class="farm-bot-strap left"></span>
            <span class="farm-bot-strap right"></span>
            <span class="farm-bot-pocket"></span>
        </div>
        <div class="farm-bot-arm left"></div>
        <div class="farm-bot-arm right"></div>
        <div class="farm-bot-bag">
            <span class="bag-seed seed-a"></span>
            <span class="bag-seed seed-b"></span>
            <span class="bag-seed seed-c"></span>
        </div>
        <div class="farm-bot-leg left"></div>
        <div class="farm-bot-leg right"></div>
        <div class="farm-bot-foot left"></div>
        <div class="farm-bot-foot right"></div>
    `;

    document.body.appendChild(bot);
}

function getSeasonTheme() {
    const storedSeason = (localStorage.getItem("season") || "").toLowerCase();
    if (storedSeason === "kharif") return "monsoon";
    if (storedSeason === "harvest") return "harvest";
    if (storedSeason === "summer") return "summer";
    if (storedSeason === "rabi") return "winter";

    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 9) return "monsoon";
    if (month >= 10 && month <= 11) return "harvest";
    if (month >= 3 && month <= 5) return "summer";
    return "winter";
}

function getDayPhase() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return "phase-dawn";
    if (hour >= 8 && hour < 17) return "phase-day";
    if (hour >= 17 && hour < 20) return "phase-dusk";
    return "phase-night";
}

function applyAmbientTheme() {
    const body = document.body;
    if (!body) return;

    body.classList.remove("phase-dawn", "phase-day", "phase-dusk", "phase-night");
    body.classList.remove("season-monsoon", "season-harvest", "season-summer", "season-winter");
    body.classList.add(getDayPhase());
    body.classList.add(`season-${getSeasonTheme()}`);
}

function injectAssistantOrb() {
    if (document.body.classList.contains("login-page")) return;
    if (document.getElementById("assistantOrb")) return;

    const orb = document.createElement("button");
    orb.id = "assistantOrb";
    orb.className = "assistant-orb";
    orb.type = "button";
    orb.innerHTML = `
        <span class="assistant-orb-core"></span>
        <span class="assistant-orb-ring ring-a"></span>
        <span class="assistant-orb-ring ring-b"></span>
        <span class="assistant-orb-label">AI</span>
    `;

    orb.addEventListener("click", () => {
        const hub = document.getElementById("assistantHub");
        if (hub) {
            hub.scrollIntoView({ behavior: "auto", block: "start" });
            const question = document.getElementById("question");
            if (question) question.focus();
        } else {
            window.location.href = "index.html#assistantHub";
        }
    });

    document.body.appendChild(orb);
}

function initLoginIntro() {
    const body = document.body;
    const intro = document.getElementById("loginIntro");
    if (!body || !body.classList.contains("login-page") || !intro) return;

    intro.classList.add("is-hidden");
    intro.setAttribute("aria-hidden", "true");
    intro.style.display = "none";
    body.classList.remove("intro-active");
    body.classList.add("intro-complete");
    intro.querySelectorAll("video").forEach((video) => {
        try {
            video.pause();
            video.removeAttribute("src");
            video.load();
        } catch (error) {
            console.error("intro video cleanup error", error);
        }
    });
    return;

    const skipButton = document.getElementById("skipIntroButton");
    const introDurationMs = 15000;
    const introFadeMs = 850;
    let endTimer = null;
    let cleanupTimer = null;

    const closeIntro = () => {
        if (intro.classList.contains("is-hidden")) return;
        intro.classList.add("is-hidden");
        body.classList.remove("intro-active");
        body.classList.add("intro-complete");
        intro.setAttribute("aria-hidden", "true");
        intro.querySelectorAll("video").forEach((video) => {
            try {
                video.pause();
            } catch (error) {
                console.error("intro video pause error", error);
            }
        });

        if (endTimer) {
            clearTimeout(endTimer);
            endTimer = null;
        }

        if (cleanupTimer) {
            clearTimeout(cleanupTimer);
        }
        cleanupTimer = window.setTimeout(() => {
            intro.style.display = "none";
        }, introFadeMs);
    };

    intro.setAttribute("aria-hidden", "false");
    intro.classList.remove("is-hidden");
    intro.style.display = "";
    body.classList.remove("intro-complete");
    body.classList.add("intro-active");
    endTimer = window.setTimeout(closeIntro, introDurationMs);

    if (skipButton) {
        skipButton.addEventListener("click", closeIntro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateIndiaLocationSelectors();
    initLoginIntro();
    injectAssistantOrb();
    applyAmbientTheme();
    injectAdminNavButton();
    prefetchCorePages();
});

window.INDIA_LOCATIONS = INDIA_LOCATIONS;
window.populateIndiaLocationSelectors = populateIndiaLocationSelectors;
window.applyAmbientTheme = applyAmbientTheme;
window.initLoginIntro = initLoginIntro;
window.isAdminUser = isAdminUser;
window.goToAdminPanel = goToAdminPanel;
