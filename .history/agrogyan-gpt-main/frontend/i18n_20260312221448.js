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
        schemesSubtitle: "Explore important agricultural schemes",

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
        welcomeUserPrefix: "Hi ",
        communityTitle: "Farmer Community",
        communityPostPlaceholder: "Ask something to the community...",
        communitySearchPlaceholder: "Search community posts...",
        communityPostButton: "Post",
        communitySearchButton: "Search",
        communityLoadMore: "Load more",
        communityNewPost: "+ New post",
        communityRefresh: "↻ Refresh",
        tourWelcome: "Welcome!",
        tourText: "Let's walk through the community features.",
        tourStep1Title: "Welcome to your community",
        tourStep1Text: "This is the place to share ideas, ask questions, and help other farmers. Let us show you around.",
        tourStep2Title: "Create a post",
        tourStep2Text: "Start a discussion by typing in the box at the top and tapping Post. Your fellow farmers will see it instantly.",
        tourStep3Title: "React & reply",
        tourStep3Text: "Use emoji reactions or reply to posts to keep the conversation going. You can even edit or delete your own posts.",
        tourStep4Title: "Search & explore",
        tourStep4Text: "Use the search box to quickly find posts, and tap Load more to see older discussions.",
        tourNext: "Next",
        tourSkip: "Skip",
        confirmLogout: "Are you sure you want to logout?",
        pleaseEnterQuestion: "Please enter a question.",
        enterEmailPassword: "Please enter email and password",
        invalidEmail: "Please enter a valid email address",
        passwordTooShort: "Password must be at least 6 characters",
        fillAllFields: "Please fill out all fields.",
        unableToLogin: "Unable to login. Please try again.",
        unableToRegister: "Unable to register. Please try again.",
        registrationSuccess: "Registration successful! Redirecting to login...",
        registrationFailed: "Registration failed.",
        pleaseSelectImage: "Please select an image.",
        backendNotReachable: "Backend not reachable.",
        extractingImage: "Extracting text from image...",
        errorUploadingImage: "Error uploading image.",
        speechNotSupported: "Speech not supported in this browser.",
        speechRecognitionNotSupported: "Speech recognition not supported in this browser.",

        writeSomethingFirst: "Write something first",
        postedSuccess: "Posted! Your post is now live.",
        unableToPost: "Unable to post. Check your backend.",
        unableToLoadPosts: "Unable to load posts. Is the backend running?",
        noPostsYet: "No posts yet — be the first to share!",
        unableToRenderPosts: "Unable to display posts. Please refresh.",
        reactedWithEmoji: "Reacted with {emoji}",
        unableToReact: "Unable to react. Check your backend.",
        liked: "Liked 👍",
        unableToLike: "Unable to like. Check your backend.",
        disliked: "Disliked 👎",
        unableToDislike: "Unable to dislike. Check your backend.",
        repliedToPost: "Replied to the post.",
        unableToAddComment: "Unable to add comment. Check your backend.",
        editPostPrompt: "Edit your post:",
        postUpdated: "Post updated!",
        deletePostConfirm: "Delete this post?",
        postRemoved: "Post removed.",
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
        schemesSubtitle: "महत्वपूर्ण कृषि योजनाओं का अन्वेषण करें",

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
        welcomeUserPrefix: "नमस्ते ",
        communityTitle: "किसान समुदाय",
        communityPostPlaceholder: "समुदाय से कुछ पूछें...",
        communitySearchPlaceholder: "समुदाय पोस्ट खोजें...",
        communityPostButton: "पोस्ट",
        communitySearchButton: "खोजें",
        communityLoadMore: "और दिखाएं",
        communityNewPost: "+ नया पोस्ट",
        communityRefresh: "↻ रीफ्रेश",
        tourWelcome: "स्वागत है!",
        tourText: "आइए समुदाय की विशेषताओं के बारे में जानें।",
        tourStep1Title: "आपके समुदाय में आपका स्वागत है",
        tourStep1Text: "यह विचार साझा करने, प्रश्न पूछने और अन्य किसानों की मदद करने का स्थान है। आइए आपको मार्गदर्शन करें।",
        tourStep2Title: "एक पोस्ट बनाएं",
        tourStep2Text: "ऊपर बॉक्स में टाइप करके और पोस्ट पर टैप करके चर्चा शुरू करें। आपके साथी किसान इसे तुरंत देखेंगे।",
        tourStep3Title: "प्रतिक्रिया दें और उत्तर दें",
        tourStep3Text: "इमोजी प्रतिक्रियाओं का उपयोग करें या पोस्टों पर उत्तर दें ताकि बातचीत जारी रहे। आप अपने पोस्ट को संपादित या हटा भी सकते हैं।",
        tourStep4Title: "खोजें और अन्वेषण करें",
        tourStep4Text: "पोस्ट खोजने के लिए खोज बॉक्स का उपयोग करें, और पुराने चर्चाओं को देखने के लिए लोड मोर पर टैप करें।",
        tourNext: "अगला",
        tourSkip: "छोड़ें",

        confirmLogout: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
        pleaseEnterQuestion: "कृपया एक प्रश्न दर्ज करें।",
        enterEmailPassword: "कृपया ईमेल और पासवर्ड दर्ज करें",
        invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें",
        passwordTooShort: "पासवर्ड कम से कम 6 वर्ण का होना चाहिए",
        fillAllFields: "कृपया सभी फ़ील्ड भरें।",
        unableToLogin: "लॉगिन करने में असमर्थ। कृपया पुनः प्रयास करें।",
        unableToRegister: "रजिस्टर करने में असमर्थ। कृपया पुनः प्रयास करें।",
        registrationSuccess: "पंजीकरण सफल! लॉगिन पर पुनर्निर्देशित किया जा रहा है...",
        registrationFailed: "पंजीकरण विफल हुआ।",
        pleaseSelectImage: "कृपया एक छवि चुनें।",
        backendNotReachable: "बैकएंड उपलब्ध नहीं है।",
        extractingImage: "छवि से पाठ निकाल रहा है...",
        errorUploadingImage: "छवि अपलोड करने में त्रुटि।",
        speechNotSupported: "यह ब्राउज़र भाषण का समर्थन नहीं करता है।",
        speechRecognitionNotSupported: "यह ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता।",

        writeSomethingFirst: "पहले कुछ लिखें",
        postedSuccess: "सफलतापूर्वक पोस्ट किया गया! आपकी पोस्ट अब लाइव है।",
        unableToPost: "पोस्ट करने में असमर्थ। कृपया बैकएंड जांचें।",
        unableToLoadPosts: "पोस्ट लोड करने में असमर्थ। क्या बैकएंड चल रहा है?",
        noPostsYet: "कोई पोस्ट नहीं है — पहला शेयर करें!",
        unableToRenderPosts: "पोस्ट प्रदर्शित करने में असमर्थ। कृपया रिफ्रेश करें।",
        reactedWithEmoji: "${emoji} के साथ प्रतिक्रिया दी गई",
        unableToReact: "प्रतिक्रिया करने में असमर्थ। कृपया बैकएंड जांचें।",
        liked: "लाइक किया 👍",
        unableToLike: "लाइक करने में असमर्थ। कृपया बैकएंड जांचें।",
        disliked: "अनफॉलो किया 👎",
        unableToDislike: "अनफॉलो करने में असमर्थ। कृपया बैकएंड जांचें।",
        repliedToPost: "पोस्ट का उत्तर दिया गया।",
        unableToAddComment: "टिप्पणी जोड़ने में असमर्थ। कृपया बैकएंड जांचें।",
        editPostPrompt: "अपनी पोस्ट संपादित करें:",
        postUpdated: "पोस्ट अपडेट की गई!",
        deletePostConfirm: "इस पोस्ट को हटाएं?",
        postRemoved: "पोस्ट हटा दी गई।",
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
        schemesSubtitle: "महत्वाचे कृषी योजनांचे अन्वेषण करा",

        ask: "विचारा",
        questionPlaceholder: "शेतीचा प्रश्न टाइप करा किंवा बोला...",
        answerTitle: "उत्तर",
        answerWaiting: "आपल्या प्रश्नाची प्रतीक्षा...",
        confidence: "विश्वास:",
        noHistory: "कोणतेही इतिहास नाही. सुरू करण्यासाठी प्रश्न विचारा.",
        yourHistory: "तुमचा इतिहास",
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
        welcomeUserPrefix: "हाय ",
        communityTitle: "किसान समुदाय",
        communityPostPlaceholder: "समुदायाला काही विचारा...",
        communitySearchPlaceholder: "समुदाय पोस्ट शोधा...",
        communityPostButton: "पोस्ट",
        communitySearchButton: "शोधा",
        communityLoadMore: "अधिक दाखवा",
        communityNewPost: "+ नवीन पोस्ट",
        communityRefresh: "↻ रिफ्रेश",
        tourWelcome: "स्वागत आहे!",
        tourText: "समुदाय वैशिष्ट्यांबद्दल जाणून घेऊ या.",
        tourStep1Title: "आपल्या समुदायात आपले स्वागत आहे",
        tourStep1Text: "यथे विचार सामायिक करा, प्रश्न विचारा आणि इतर शेतकऱ्यांना मदत करा. चला आपणास मार्गदर्शन करूया.",
        tourStep2Title: "पोस्ट तयार करा",
        tourStep2Text: "वरच्या बॉक्समध्ये टाइप करून आणि पोस्टवर टॅप करून चर्चा सुरू करा. आपले सहकारी शेतकरी ते लगेच पाहतील.",
        tourStep3Title: "प्रतिक्रिया द्या आणि उत्तर द्या",
        tourStep3Text: "संवाद चालू ठेवण्यासाठी इमोजी प्रतिक्रियांचा वापर करा किंवा पोस्टवर उत्तर द्या. आपण आपल्या पोस्टचे संपादन किंवा हटवू शकता.",
        tourStep4Title: "शोध आणि एक्सप्लोर करा",
        tourStep4Text: "पोस्ट शोधण्यासाठी शोध बॉक्स वापरा, आणि जुनी चर्चा पाहण्यासाठी लोड मोअरवर टॅप करा.",
        tourNext: "पुढे",
        tourSkip: "वगळा",

        confirmLogout: "आपण नक्की लॉग आउट करायचे आहे का?",
        pleaseEnterQuestion: "कृपया एक प्रश्न प्रविष्ट करा.",
        enterEmailPassword: "कृपया ईमेल आणि पासवर्ड प्रविष्ट करा",
        invalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
        passwordTooShort: "पासवर्ड किमान 6 अक्षरांचा असावा",
        fillAllFields: "कृपया सर्व फील्ड भरा.",
        unableToLogin: "लॉगिन करण्यात अक्षम. कृपया पुन्हा प्रयत्न करा.",
        unableToRegister: "नोंदणी करण्यात अक्षम. कृपया पुन्हा प्रयत्न करा.",
        registrationSuccess: "नोंदणी यशस्वी! लॉगिनवर पुनर्निर्देशित केले जात आहे...",
        registrationFailed: "नोंदणी अयशस्वी.",
        pleaseSelectImage: "कृपया एक प्रतिमा निवडा.",
        backendNotReachable: "बॅकएंड पोहोचू शकत नाही.",
        extractingImage: "प्रतिमेतून मजकूर काढत आहे...",
        errorUploadingImage: "प्रतिमा अपलोड करताना त्रुटी.",
        speechNotSupported: "हा ब्राउझर भाषणाला समर्थन करत नाही.",
        speechRecognitionNotSupported: "हा ब्राउझर स्पीच मान्यता समर्थन करत नाही.",

        writeSomethingFirst: "काहीतरी प्रथम लिहा",
        postedSuccess: "पोस्ट केली! तुमची पोस्ट आता लाइव्ह आहे.",
        unableToPost: "पोस्ट करणे शक्य नाही. कृपया बॅकएंड तपासा.",
        unableToLoadPosts: "पोस्ट लोड करण्यास अक्षम. बॅकएंड चालू आहे का?",
        noPostsYet: "अजून पोस्ट नाही — पहिले सामायिक करा!",
        reactedWithEmoji: "{emoji} सह प्रतिक्रिया दिली",
        unableToReact: "प्रतिक्रिया देणे शक्य नाही. कृपया बॅकएंड तपासा.",
        liked: "लाईक केले 👍",
        unableToLike: "लाईक करणे शक्य नाही. कृपया बॅकएंड तपासा.",
        disliked: "डिसलाईक केले 👎",
        unableToDislike: "डिसलाईक करणे शक्य नाही. कृपया बॅकएंड तपासा.",
        repliedToPost: "पोस्टला उत्तर देण्यात आले.",
        unableToAddComment: "टिप्पणी जोडणे शक्य नाही. कृपया बॅकएंड तपासा.",
        editPostPrompt: "तुमची पोस्ट संपादित करा:",
        postUpdated: "पोस्ट अद्यतनित केली!",
        deletePostConfirm: "ही पोस्ट हटवायची?",
        postRemoved: "पोस्ट काढून टाकले.",
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
