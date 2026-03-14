// UI translation support (English / Hindi / Marathi)
// Usage: Add data-i18n="key" attributes to text elements.
//        Add data-i18n-placeholder="key" for input placeholders.
//        Add data-i18n-title="key" for title/tooltips.

const UI_TRANSLATIONS = {
    English: {
        // Core labels
        appName: "AgroGyanGPT",
        welcomeTitle: "Welcome to AgroGyanGPT",
        welcomeTagline: "Where innovation meets agriculture",
        welcomeDescription: "Harvest answers from trusted agricultural knowledge.",
        getGrowing: "Get Growing",
        tapToContinue: "Tap anywhere to continue",

        // Navigation
        home: "Home",
        connectFarmers: "Connect Farmers",
        schemes: "Government Schemes",
        profile: "Profile",
        login: "Login",
        logout: "Logout",
        speak: "Speak",
        clearHistory: "Clear",

        // Chat
        ask: "Ask",
        questionPlaceholder: "Type or speak your agriculture question...",
        answerTitle: "Answer",
        answerWaiting: "Waiting for your question...",
        confidence: "Confidence:",
        noHistory: "No history yet. Ask a question to start.",
        yourHistory: "Your History",
        noSchemes: "No schemes found.",

        // Auth
        loginTitle: "Login",
        loginSubtitle: "Secure Access Portal",
        emailPlaceholder: "Email Address",
        passwordPlaceholder: "Password",
        register: "Register",
        registerTitle: "Create an account",
        fullNamePlaceholder: "Full name",
        hasAccountPrompt: "Already have an account?",
        notRegisteredPrompt: "Not registered?",
        registerHere: "Register here",
        backToLogin: "Back to login",

        // Profile
        yourProfile: "Your Profile",
        accountInfo: "Account Info",
        nameLabel: "Name:",
        emailLabel: "Email:",
        joinedLabel: "Joined:",
        savedSchemes: "Saved Schemes",
        savedPosts: "Saved Posts",
        questionHistory: "Question History",
        noFavorites: "No favorites yet.",
        noPostsSaved: "No posts saved yet.",
        noQuestions: "No questions asked yet.",

        // Misc
        confirmLogout: "Are you sure you want to logout?",
        pleaseEnterQuestion: "Please enter a question.",
        pleaseSelectImage: "Please select an image.",
        backendNotReachable: "Backend not reachable.",
        errorUploadingImage: "Error uploading image.",
    },
    Hindi: {
        appName: "अग्रोज्ञानजीपीटी",
        welcomeTitle: "अग्रोज्ञानजीपीटी में आपका स्वागत है",
        welcomeTagline: "जहाँ नवाचार मिलता है कृषि से",
        welcomeDescription: "विश्वसनीय कृषि ज्ञान से उत्तर प्राप्त करें।",
        getGrowing: "शुरू करें",
        tapToContinue: "जारी रखने के लिए कहीं भी टैप करें",

        home: "मुख पृष्ठ",
        connectFarmers: "किसानों से जुड़ें",
        schemes: "सरकारी योजनाएँ",
        profile: "प्रोफ़ाइल",
        login: "लॉगिन",
        logout: "लॉग आउट",
        speak: "बोलें",
        clearHistory: "साफ करें",

        ask: "पूछें",
        questionPlaceholder: "कृषि प्रश्न टाइप करें या बोलें...",
        answerTitle: "उत्तर",
        answerWaiting: "आपके प्रश्न की प्रतीक्षा...",
        confidence: "विश्वास:",
        noHistory: "कोई इतिहास नहीं। शुरुआत करने के लिए एक प्रश्न पूछें।",
        yourHistory: "आपका इतिहास",
        noSchemes: "कोई योजना नहीं मिली।",

        loginTitle: "लॉगिन",
        loginSubtitle: "सुरक्षित पहुँच पोर्टल",
        emailPlaceholder: "ईमेल पता",
        passwordPlaceholder: "पासवर्ड",
        register: "रजिस्टर करें",
        registerTitle: "एक खाता बनाएं",
        fullNamePlaceholder: "पूरा नाम",
        hasAccountPrompt: "पहले से खाता है?",
        notRegisteredPrompt: "पंजीकृत नहीं?",
        registerHere: "यहाँ रजिस्टर करें",
        backToLogin: "वापस लॉगिन पर",

        yourProfile: "आपकी प्रोफ़ाइल",
        accountInfo: "खाता जानकारी",
        nameLabel: "नाम:",
        emailLabel: "ईमेल:",
        joinedLabel: "जुड़ा:",
        savedSchemes: "सहेजी गई योजनाएँ",
        savedPosts: "सहेजे गए पोस्ट",
        questionHistory: "प्रश्न इतिहास",
        noFavorites: "अभी कोई पसंदीदा नहीं।",
        noPostsSaved: "अभी कोई पोस्ट सहेजा नहीं गया।",
        noQuestions: "अभी तक कोई प्रश्न नहीं पूछा गया।",

        confirmLogout: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
        pleaseEnterQuestion: "कृपया एक प्रश्न दर्ज करें।",
        pleaseSelectImage: "कृपया एक छवि चुनें।",
        backendNotReachable: "बैकएंड उपलब्ध नहीं है।",
        errorUploadingImage: "छवि अपलोड करने में त्रुटि।",
    },
    Marathi: {
        appName: "अ‍ॅग्रोज्ञानजीपीटी",
        welcomeTitle: "अ‍ॅग्रोज्ञानजीपीटी मध्ये आपले स्वागत आहे",
        welcomeTagline: "इनोव्हेशन शेतीशी भेटते",
        welcomeDescription: "विश्वसनीय कृषी ज्ञानातून उत्तरे मिळवा.",
        getGrowing: "सुरू करूया",
        tapToContinue: "सुरू करण्यासाठी कुठेही टॅप करा",

        home: "मुख्य",
        connectFarmers: "शेतकर्‍यांशी जोडा",
        schemes: "सरकारी योजना",
        profile: "प्रोफाइल",
        login: "लॉगिन",
        logout: "लॉग आउट",
        speak: "बोल",
        clearHistory: "काढा",

        ask: "विचारा",
        questionPlaceholder: "शेतीचा प्रश्न टाइप करा किंवा बोला...",
        answerTitle: "उत्तर",
        answerWaiting: "आपल्या प्रश्नाची प्रतीक्षा...",
        confidence: "विश्वास:",
        noHistory: "कोणतेही इतिहास नाही. सुरू करण्यासाठी प्रश्न विचारा.",
        noSchemes: "कोणतीही योजना सापडली नाही.",

        loginTitle: "लॉगिन",
        loginSubtitle: "सुरक्षित प्रवेश पोर्टल",
        emailPlaceholder: "ईमेल पत्ता",
        passwordPlaceholder: "पासवर्ड",
        register: "नोंदणी करा",
        registerTitle: "खाते तयार करा",
        fullNamePlaceholder: "पूर्ण नाव",
        hasAccountPrompt: "आधीच खाते आहे?",
        notRegisteredPrompt: "नोंदणी नाही?",
        registerHere: "इथे नोंदणी करा",
        backToLogin: "लॉगिनवर परत जा",

        yourProfile: "आपले प्रोफाइल",
        accountInfo: "खाते माहिती",
        nameLabel: "नाव:",
        emailLabel: "ईमेल:",
        joinedLabel: "जोडले गेले:",
        savedSchemes: "जतन केलेल्या योजना",
        savedPosts: "जतन केलेले पोस्ट",
        questionHistory: "प्रश्न इतिहास",
        noFavorites: "अजून कोणतेही आवडते नाहीत.",
        noPostsSaved: "अजून कोणतेही पोस्ट जतन केलेले नाही.",
        noQuestions: "अजून प्रश्न विचारले नाहीत.",

        confirmLogout: "आपण नक्की लॉग आउट करायचे आहे का?",
        pleaseEnterQuestion: "कृपया एक प्रश्न प्रविष्ट करा.",
        pleaseSelectImage: "कृपया एक प्रतिमा निवडा.",
        backendNotReachable: "बॅकएंड पोहोचू शकत नाही.",
        errorUploadingImage: "प्रतिमा अपलोड करताना त्रुटी."
    }
};

function getUILanguage() {
    return localStorage.getItem("uiLanguage") || "English";
}

function setUILanguage(lang) {
    localStorage.setItem("uiLanguage", lang);
    applyTranslations();
}

function t(key) {
    const lang = getUILanguage();
    const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.English;
    return dict[key] || UI_TRANSLATIONS.English[key] || key;
}

function applyTranslations() {
    const lang = getUILanguage();
    const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.English;

    // Simple innerText translation
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    // Placeholder translation
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key]) {
            el.placeholder = dict[key];
        }
    });

    // Title/tooltip translation
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        if (dict[key]) {
            el.title = dict[key];
        }
    });

    // Value translation (for button values etc.)
    document.querySelectorAll("[data-i18n-value]").forEach(el => {
        const key = el.getAttribute("data-i18n-value");
        if (dict[key]) {
            el.value = dict[key];
        }
    });

    // Sync language selector
    const selector = document.getElementById("uiLanguage");
    if (selector) {
        selector.value = lang;
    }
}

function initI18n() {
    const selector = document.getElementById("uiLanguage");
    if (selector) {
        selector.value = getUILanguage();
        selector.addEventListener("change", (e) => setUILanguage(e.target.value));
    }
    applyTranslations();
}

// Expose helpers globally for other scripts
window.getUILanguage = getUILanguage;
window.setUILanguage = setUILanguage;
window.t = t;
window.initI18n = initI18n;
