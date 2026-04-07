const AGRO_API_URL = window.AGRO_API_URL || "http://127.0.0.1:8000";
let latestFarmerPageData = null;

const PAGE_COPY = {
    English: {
        weatherGuidance: "Weather guidance will appear here.",
        rainWatch: "Rain watch",
        spraySafe: "Spray safe",
        marketPricesSoon: "Market prices will appear here.",
        active: "Active",
        stable: "Stable",
        todayTasksFallback: "Your daily AI tasks will appear here.",
        noWeatherAlerts: "No weather alerts right now.",
        completeFarmSetup: "Complete your farm setup to improve personalization.",
        weekPlanner: "This week's planner",
        plannerWillAppear: "Your planner will appear here.",
        relevantSchemes: "Relevant schemes will appear here.",
        noLiveFieldAlerts: "No live field alerts yet.",
        nearbyContext: "Nearby context",
        nearbyContextSoon: "Nearby context will appear here.",
        complete: "Complete",
        inProgress: "In progress",
        useMoreForMemory: "Use AgroGyanGPT more to build memory.",
        noUrgentAlerts: "No urgent field alerts right now.",
        watchThisWeek: "Watch this week",
        predictionSoon: "Prediction insight will appear here.",
        noMarketAlerts: "No weather-linked market alerts right now.",
        todayAiTitle: "What should I do today?",
        todayAiSummary: "Top actions for your farm today",
        voiceTitle: "Voice-first chatbot",
        voiceHelp: "Tap the large mic button and ask in your own language.",
        voicePromptOne: "Ask: What should I spray today?",
        voicePromptTwo: "Ask: Should I sell now or wait?",
        voicePromptThree: "Ask: My crop has yellow leaves, what do I do?",
        startVoiceMode: "Start voice mode",
        cropCalendarTitle: "Crop calendar",
        remindersTitle: "Reminders",
        marketTrendTitle: "Price trend",
        sellDecisionTitle: "Sell now or wait?",
        schemeEligibilityTitle: "Scheme eligibility",
        documentChecklistTitle: "Document checklist",
        saveFarmSuccess: "Farm setup saved successfully.",
        saveFarmFallback: "Saved locally. Backend sync will retry when available.",
        strongStreak: "Strong streak. Your dashboard is learning your field rhythm.",
        buildStreak: "Keep checking in daily to unlock a stronger farm guidance streak.",
        stagePrep: "Preparation",
        stageSowing: "Sowing",
        stageGrowth: "Growth",
        stageProtection: "Protection",
        stageHarvest: "Harvest",
        reminderWeather: "Check rain and wind before spraying or irrigation.",
        reminderMarket: "Review mandi rates before making a bulk sale.",
        reminderCrop: "Inspect the field today for pest or disease early signs.",
        eligible: "Likely eligible",
        maybeEligible: "Check documents",
        notEnoughProfile: "Complete your farm profile for better eligibility matching.",
        docAadhaar: "Aadhaar card",
        docBank: "Bank passbook",
        docLand: "Land record / 7-12 extract",
        docMobile: "Registered mobile number",
        docCrop: "Crop details and sowing record",
        sellWait: "Wait a little",
        sellNow: "Good time to sell",
        sellMixed: "Sell partially",
        trendUp: "Price trend is rising",
        trendDown: "Price trend is soft",
        trendFlat: "Price trend is stable",
        voiceReady: "Voice farmer mode ready"
    },
    Hindi: {
        weatherGuidance: "मौसम मार्गदर्शन यहाँ दिखाई देगा।",
        rainWatch: "बारिश पर नज़र",
        spraySafe: "स्प्रे सुरक्षित",
        marketPricesSoon: "बाज़ार भाव यहाँ दिखाई देंगे।",
        active: "सक्रिय",
        stable: "स्थिर",
        todayTasksFallback: "आज के एआई कार्य यहाँ दिखाई देंगे।",
        noWeatherAlerts: "अभी कोई मौसम चेतावनी नहीं है।",
        completeFarmSetup: "बेहतर सुझावों के लिए अपना खेत सेटअप पूरा करें।",
        weekPlanner: "इस सप्ताह की योजना",
        plannerWillAppear: "आपकी योजना यहाँ दिखाई देगी।",
        relevantSchemes: "संबंधित योजनाएँ यहाँ दिखाई देंगी।",
        noLiveFieldAlerts: "अभी कोई लाइव फील्ड अलर्ट नहीं है।",
        nearbyContext: "नज़दीकी संदर्भ",
        nearbyContextSoon: "नज़दीकी संदर्भ यहाँ दिखाई देगा।",
        complete: "पूरा",
        inProgress: "प्रगति में",
        useMoreForMemory: "मेमोरी बनाने के लिए AgroGyanGPT का अधिक उपयोग करें।",
        noUrgentAlerts: "अभी कोई तात्कालिक चेतावनी नहीं है।",
        watchThisWeek: "इस सप्ताह नज़र रखें",
        predictionSoon: "पूर्वानुमान यहाँ दिखाई देगा।",
        noMarketAlerts: "अभी कोई मौसम-आधारित बाज़ार चेतावनी नहीं है।",
        todayAiTitle: "आज मुझे क्या करना चाहिए?",
        todayAiSummary: "आज आपके खेत के लिए सबसे ज़रूरी काम",
        voiceTitle: "वॉइस-फर्स्ट चैटबॉट",
        voiceHelp: "बड़े माइक बटन पर टैप करें और अपनी भाषा में पूछें।",
        voicePromptOne: "पूछें: आज क्या स्प्रे करूँ?",
        voicePromptTwo: "पूछें: अभी बेचूँ या रुकूँ?",
        voicePromptThree: "पूछें: मेरी फसल की पत्तियाँ पीली हैं, क्या करूँ?",
        startVoiceMode: "वॉइस मोड शुरू करें",
        cropCalendarTitle: "फसल कैलेंडर",
        remindersTitle: "रिमाइंडर",
        marketTrendTitle: "कीमत रुझान",
        sellDecisionTitle: "अभी बेचें या इंतज़ार करें?",
        schemeEligibilityTitle: "योजना पात्रता",
        documentChecklistTitle: "दस्तावेज़ चेकलिस्ट",
        saveFarmSuccess: "खेत सेटअप सफलतापूर्वक सेव हो गया।",
        saveFarmFallback: "लोकल में सेव हो गया। बैकएंड उपलब्ध होने पर सिंक होगा।",
        strongStreak: "बहुत अच्छा। आपका डैशबोर्ड आपके खेत की आदत सीख रहा है।",
        buildStreak: "रोज़ उपयोग करें ताकि आपका फार्म गाइडेंस और मज़बूत हो।",
        stagePrep: "तैयारी",
        stageSowing: "बुवाई",
        stageGrowth: "विकास",
        stageProtection: "सुरक्षा",
        stageHarvest: "कटाई",
        reminderWeather: "स्प्रे या सिंचाई से पहले बारिश और हवा जाँचें।",
        reminderMarket: "थोक बिक्री से पहले मंडी भाव देखें।",
        reminderCrop: "आज खेत में कीट या रोग के शुरुआती संकेत देखें।",
        eligible: "संभावित रूप से पात्र",
        maybeEligible: "दस्तावेज़ जाँचें",
        notEnoughProfile: "बेहतर मिलान के लिए खेत प्रोफ़ाइल पूरी करें।",
        docAadhaar: "आधार कार्ड",
        docBank: "बैंक पासबुक",
        docLand: "भूमि रिकॉर्ड / 7-12",
        docMobile: "पंजीकृत मोबाइल नंबर",
        docCrop: "फसल विवरण और बुवाई रिकॉर्ड",
        sellWait: "थोड़ा इंतज़ार करें",
        sellNow: "बेचने का अच्छा समय",
        sellMixed: "आंशिक बिक्री करें",
        trendUp: "कीमत ऊपर जा रही है",
        trendDown: "कीमत नरम है",
        trendFlat: "कीमत स्थिर है",
        voiceReady: "वॉइस किसान मोड तैयार है"
    },
    Marathi: {
        weatherGuidance: "हवामान मार्गदर्शन येथे दिसेल.",
        rainWatch: "पावसावर लक्ष",
        spraySafe: "फवारणी सुरक्षित",
        marketPricesSoon: "बाजारभाव येथे दिसतील.",
        active: "सक्रिय",
        stable: "स्थिर",
        todayTasksFallback: "आजचे एआय काम येथे दिसेल.",
        noWeatherAlerts: "सध्या हवामान इशारा नाही.",
        completeFarmSetup: "चांगल्या सल्ल्यासाठी शेत सेटअप पूर्ण करा.",
        weekPlanner: "या आठवड्याची योजना",
        plannerWillAppear: "तुमची योजना येथे दिसेल.",
        relevantSchemes: "संबंधित योजना येथे दिसतील.",
        noLiveFieldAlerts: "सध्या कोणतेही लाईव्ह फील्ड अलर्ट नाहीत.",
        nearbyContext: "जवळचा संदर्भ",
        nearbyContextSoon: "जवळचा संदर्भ येथे दिसेल.",
        complete: "पूर्ण",
        inProgress: "प्रगतीत",
        useMoreForMemory: "मेमरी तयार होण्यासाठी AgroGyanGPT अधिक वापरा.",
        noUrgentAlerts: "सध्या तातडीचे अलर्ट नाहीत.",
        watchThisWeek: "या आठवड्यात लक्ष ठेवा",
        predictionSoon: "अंदाज येथे दिसेल.",
        noMarketAlerts: "सध्या हवामानाशी संबंधित बाजार इशारे नाहीत.",
        todayAiTitle: "आज मला काय करायला हवे?",
        todayAiSummary: "आज तुमच्या शेतासाठी महत्त्वाचे काम",
        voiceTitle: "व्हॉइस-फर्स्ट चॅटबॉट",
        voiceHelp: "मोठ्या माइक बटणावर टॅप करा आणि आपल्या भाषेत विचारा.",
        voicePromptOne: "विचारा: आज काय फवारू?",
        voicePromptTwo: "विचारा: आता विकू की थांबू?",
        voicePromptThree: "विचारा: पानं पिवळी होत आहेत, काय करू?",
        startVoiceMode: "व्हॉइस मोड सुरू करा",
        cropCalendarTitle: "पीक कॅलेंडर",
        remindersTitle: "रिमाइंडर",
        marketTrendTitle: "भावाचा ट्रेंड",
        sellDecisionTitle: "आता विकायचे की थांबायचे?",
        schemeEligibilityTitle: "योजना पात्रता",
        documentChecklistTitle: "दस्तऐवज तपासणी यादी",
        saveFarmSuccess: "शेत सेटअप यशस्वीरित्या सेव्ह झाले.",
        saveFarmFallback: "लोकलमध्ये सेव्ह झाले. बॅकएंड नंतर सिंक होईल.",
        strongStreak: "छान. तुमचा डॅशबोर्ड तुमच्या शेताची सवय शिकत आहे.",
        buildStreak: "दररोज वापरा म्हणजे तुमचे मार्गदर्शन अधिक मजबूत होईल.",
        stagePrep: "तयारी",
        stageSowing: "पेरणी",
        stageGrowth: "वाढ",
        stageProtection: "संरक्षण",
        stageHarvest: "कापणी",
        reminderWeather: "फवारणी किंवा पाण्यापूर्वी पाऊस आणि वारा तपासा.",
        reminderMarket: "मोठी विक्री करण्यापूर्वी मंडी भाव तपासा.",
        reminderCrop: "आज कीड किंवा रोगाची सुरुवातीची लक्षणे तपासा.",
        eligible: "बहुधा पात्र",
        maybeEligible: "कागदपत्रे तपासा",
        notEnoughProfile: "चांगल्या पात्रतेसाठी शेत प्रोफाइल पूर्ण करा.",
        docAadhaar: "आधार कार्ड",
        docBank: "बँक पासबुक",
        docLand: "जमिनीचा उतारा / 7-12",
        docMobile: "नोंदणीकृत मोबाईल नंबर",
        docCrop: "पीक तपशील आणि पेरणी नोंद",
        sellWait: "थोडे थांबा",
        sellNow: "विक्रीसाठी चांगला वेळ",
        sellMixed: "थोडे विकून थोडे थांबा",
        trendUp: "भाव वाढत आहेत",
        trendDown: "भाव नरम आहेत",
        trendFlat: "भाव स्थिर आहेत",
        voiceReady: "व्हॉइस शेतकरी मोड तयार आहे"
    }
};

function fc(key) {
    const lang = typeof getUILanguage === "function" ? getUILanguage() : "English";
    return PAGE_COPY[lang]?.[key] || PAGE_COPY.English[key] || key;
}

function getCurrentTheme() {
    return localStorage.getItem("theme") || "light";
}

function setTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);
    const themeButton = document.getElementById("themeButton");
    if (themeButton) themeButton.innerText = theme === "dark"
        ? (typeof t === "function" ? t("light") : "Light")
        : (typeof t === "function" ? t("dark") : "Dark");
}

function toggleTheme() {
    setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
}

function updateAuthState() {
    const user = localStorage.getItem("user");
    const authButton = document.getElementById("authButton");
    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser && user) {
        welcomeUser.innerText = `${typeof t === "function" ? t("welcomeUserPrefix") : "Welcome, "}${user}`;
    }
    if (!authButton) return;

    if (user) {
        authButton.innerText = typeof t === "function" ? t("logout") : "Logout";
        authButton.onclick = () => {
            if (!window.confirm(typeof t === "function" ? t("confirmLogout") : "Are you sure you want to logout?")) return;
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            window.location.href = "login.html";
        };
    } else {
        authButton.innerText = typeof t === "function" ? t("login") : "Login";
        authButton.onclick = () => {
            window.location.href = "login.html";
        };
    }
}

function applySavedLanguage() {
    const preferred = typeof getUILanguage === "function"
        ? getUILanguage()
        : (localStorage.getItem("preferred_language") || "English");
    const uiLanguage = document.getElementById("uiLanguage");
    const answerLanguage = document.getElementById("language");
    if (uiLanguage) uiLanguage.value = preferred;
    if (answerLanguage) answerLanguage.value = preferred;
}

function getLocationLabel() {
    const district = localStorage.getItem("userDistrict") || "Pune";
    const state = localStorage.getItem("userState") || "Maharashtra";
    return `${district}, ${state}`;
}

function setHeaderMeta() {
    const locationLabel = getLocationLabel();
    const heroLocation = document.getElementById("heroLocationLabel");
    const weatherLocation = document.getElementById("weatherLocationLabel");
    const liveDate = document.getElementById("liveDateTicker");
    if (heroLocation) heroLocation.innerText = locationLabel;
    if (weatherLocation) weatherLocation.innerText = locationLabel;
    if (liveDate) {
        liveDate.innerText = new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }
}

function createTimelineItems(items, emptyText = "No information available yet.") {
    if (!Array.isArray(items) || !items.length) {
        return `<div class="timeline-item"><p>${emptyText}</p></div>`;
    }
    return items.map((item) => {
        if (typeof item === "string") {
            return `<div class="timeline-item"><p>${item}</p></div>`;
        }
        return `<div class="timeline-item"><h4>${item.title || item.name || "Update"}</h4><p>${item.body || item.reason || item.task || item.insight || ""}</p></div>`;
    }).join("");
}

function getTodayActionItems(data) {
    const tasks = [];
    if ((data.live_alerts || []).length) {
        tasks.push(data.live_alerts[0].body || data.live_alerts[0].title);
    }
    tasks.push(fc("reminderWeather"));
    tasks.push(fc("reminderMarket"));
    tasks.push(fc("reminderCrop"));
    return tasks.slice(0, 3);
}

function buildCropCalendar(crop, season) {
    const normalizedCrop = String(crop || "Wheat");
    const normalizedSeason = String(season || "Rabi");
    const lang = typeof getUILanguage === "function" ? getUILanguage() : "English";
    const bodies = {
        English: [
            `${normalizedSeason}: land preparation, seed choice, and input planning.`,
            "Use the first safe weather window for sowing and keep seed spacing uniform.",
            "Track water, nutrient demand, and leaf color changes during active growth.",
            "Inspect the crop twice a week for pests, weeds, and disease spread.",
            "Watch maturity, market movement, and drying/storage readiness before harvest."
        ],
        Hindi: [
            `${normalizedSeason}: खेत की तैयारी, बीज चयन और इनपुट योजना बनाइए।`,
            "पहले सुरक्षित मौसम विंडो में बुवाई करें और बीज दूरी समान रखें।",
            "विकास अवस्था में पानी, पोषण और पत्तियों के रंग पर नज़र रखें।",
            "कीट, खरपतवार और रोग फैलाव के लिए सप्ताह में दो बार निरीक्षण करें।",
            "कटाई से पहले पकाव, बाज़ार और सुखाने/भंडारण की तैयारी देखें।"
        ],
        Marathi: [
            `${normalizedSeason}: जमीन तयारी, बियाणे निवड आणि इनपुट योजना करा.`,
            "सुरक्षित हवामान विंडो मिळताच पेरणी करा आणि अंतर समान ठेवा.",
            "वाढीच्या टप्प्यात पाणी, पोषण आणि पानांच्या रंगावर लक्ष ठेवा.",
            "आठवड्यातून दोनदा कीड, तण आणि रोगासाठी तपासणी करा.",
            "कापणीपूर्वी पक्वता, बाजार आणि वाळवण/साठवण तयारी पाहा."
        }
    };
    const selectedBodies = bodies[lang] || bodies.English;
    return [
        { title: `${fc("stagePrep")} - ${normalizedCrop}`, body: selectedBodies[0] },
        { title: fc("stageSowing"), body: selectedBodies[1] },
        { title: fc("stageGrowth"), body: selectedBodies[2] },
        { title: fc("stageProtection"), body: selectedBodies[3] },
        { title: fc("stageHarvest"), body: selectedBodies[4] }
    ];
}

function buildReminderItems(data) {
    const reminders = [fc("reminderWeather"), fc("reminderCrop"), fc("reminderMarket")];
    if (data.weather?.condition) {
        reminders.unshift(`${data.weather.condition}: ${data.weather.advice || fc("weatherGuidance")}`);
    }
    return reminders.slice(0, 4);
}

function buildMarketTrend(data) {
    const markets = data.markets || [];
    const top = markets[0];
    if (!top) {
        return {
            label: fc("trendFlat"),
            series: [62, 64, 63, 65, 64, 64, 65],
            suggestion: fc("sellMixed"),
            note: fc("predictionSoon")
        };
    }

    const numericPrice = Number(String(top.price || "").replace(/[^\d]/g, "")) || 2400;
    const trendUp = /up|positive|stable|steady/i.test(top.trend || "");
    const series = trendUp
        ? [0.94, 0.95, 0.97, 0.99, 1.0, 1.03, 1.04].map((item) => Math.round((numericPrice / 100) * item))
        : [1.04, 1.02, 1.0, 0.99, 0.98, 0.97, 0.96].map((item) => Math.round((numericPrice / 100) * item));
    const weatherRisk = /rain|humid/i.test(data.weather?.condition || "");
    return {
        label: trendUp ? fc("trendUp") : fc("trendDown"),
        series,
        suggestion: trendUp && !weatherRisk ? fc("sellNow") : weatherRisk ? fc("sellMixed") : fc("sellWait"),
        note: top.trend
    };
}

function buildSchemeEligibility(profile) {
    const items = [];
    if (profile.crop_name) items.push(`PM-KISAN: ${fc("eligible")}`);
    if (profile.land_size) items.push(`Kisan Credit Card: ${fc("eligible")}`);
    if (profile.crop_name && profile.season) items.push(`PM Fasal Bima Yojana: ${fc("eligible")}`);
    if (!items.length) items.push(fc("notEnoughProfile"));
    return items;
}

function buildDocumentChecklist() {
    return [fc("docAadhaar"), fc("docBank"), fc("docLand"), fc("docMobile"), fc("docCrop")];
}

async function fetchDashboardOverview() {
    const userId = localStorage.getItem("userId");
    const url = userId ? `${AGRO_API_URL}/dashboard-overview?user_id=${userId}` : `${AGRO_API_URL}/dashboard-overview`;
    const fallback = {
        weather: { temp: "28&deg;C", condition: "Partly sunny", advice: "Good conditions for normal field work in the first half of the day.", humidity: "Humidity 68%", wind: "Wind 10 km/h" },
        markets: [
            { crop: "Wheat", price: "Rs 2425", trend: "Stable arrivals and steady buyer interest" },
            { crop: "Paddy", price: "Rs 2180", trend: "Moisture quality affecting premium lots" },
            { crop: "Cotton", price: "Rs 6940", trend: "Mild upside support from mill demand" }
        ],
        daily_briefing: {
            headline: "Today, focus on field inspection, weather timing, and mandi movement.",
            top_tasks: ["Check leaves for early pest signals before irrigation.", "Use the chatbot for crop-specific questions before spending on input."]
        },
        farm_plan: { title: "This week's planner", tasks: [{ stage: "Field", task: "Inspect crop health and remove damaged foliage." }, { stage: "Water", task: "Align irrigation with weather outlook." }] },
        scheme_matches: [{ name: "PM-KISAN", reason: "Income support often relevant for active farmers." }],
        market_prediction: { sell_window: "Watch the next 3-5 days", trend: "Stable to slightly positive", insight: "Keep watching local mandi rates before making a bulk sale." },
        pest_risk: { risk: "Medium", likely_issue: "Leaf spot monitoring", reason: "Humidity and local conditions can trigger spread if ignored." },
        chat_memory: { summary: "Building your farm memory", preferences: ["Language and crop choices will appear here as you use the app."] },
        map_context: { title: "Nearby agri context", nearby_layers: ["Mandis, fertilizer shops, and farm support points can be explored here."] },
        live_alerts: [{ title: "Weather signal", body: "Watch for afternoon wind before spraying." }],
        farm_profile: {
            farm_name: localStorage.getItem("farm_name") || "",
            primary_crop: localStorage.getItem("crop_name") || "Wheat",
            irrigation_type: localStorage.getItem("farm_irrigation") || "",
            taluka: localStorage.getItem("farm_taluka") || ""
        }
    };

    try {
        const response = await fetch(url);
        if (!response.ok) return fallback;
        return await response.json();
    } catch (error) {
        console.error("dashboard overview error", error);
        return fallback;
    }
}

function renderWeatherBlock(weather = {}) {
    const temp = weather.temp || "28&deg;C";
    const condition = weather.condition || "Partly sunny";
    const advice = weather.advice || fc("weatherGuidance");
    const humidity = weather.humidity || "Humidity 68%";
    const wind = weather.wind || "Wind 10 km/h";
    const badge = /rain|humid/i.test(condition) ? fc("rainWatch") : fc("spraySafe");
    const weatherState = /rain|humid/i.test(condition) ? "rain" : /cloud/i.test(condition) ? "cloudy" : "sunny";

    const ids = {
        weatherTemp: temp,
        weatherCondition: condition,
        weatherAdvice: advice,
        weatherHumidity: humidity,
        weatherWind: wind,
        weatherTempCard: temp,
        weatherConditionCard: condition,
        weatherHumidityCard: humidity.replace("Humidity ", ""),
        weatherWindCard: wind.replace("Wind ", "")
    };

    Object.entries(ids).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (!element) return;
        if (String(value).includes("&deg;")) element.innerHTML = value;
        else element.innerText = value;
    });

    const badgeElement = document.getElementById("weatherBadge");
    if (badgeElement) badgeElement.innerText = badge;
    const heroWeatherCard = document.getElementById("heroWeatherCard");
    if (heroWeatherCard) heroWeatherCard.dataset.weatherState = weatherState;
}

function renderMarketBoard(markets = []) {
    const marketGrid = document.getElementById("marketGrid");
    if (marketGrid) {
        marketGrid.innerHTML = markets.map((item) => `
            <div class="market-row">
                <div><div class="market-crop">${item.crop}</div><div class="market-trend">${item.trend}</div></div>
                <div class="market-price-compact">${item.price}${String(item.price).includes("/qtl") ? "" : "/qtl"}</div>
            </div>
        `).join("") || `<div class="timeline-item"><p>${fc("marketPricesSoon")}</p></div>`;
    }

    const firstCrop = markets[0]?.crop || localStorage.getItem("crop_name") || "Wheat";
    ["topCropValue", "topCropCard", "farmPrimaryCropBadge"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.innerText = firstCrop;
    });
    ["marketMoodValue", "marketMoodCard"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.innerText = markets.length >= 3 ? fc("active") : fc("stable");
    });
}

function renderGamification() {
    const visits = JSON.parse(localStorage.getItem("agroVisitLog") || "[]");
    const today = new Date().toISOString().slice(0, 10);
    const updatedVisits = visits.includes(today) ? visits : [today, ...visits].slice(0, 30);
    localStorage.setItem("agroVisitLog", JSON.stringify(updatedVisits));

    let streak = 0;
    const dateCursor = new Date();
    for (let i = 0; i < 30; i += 1) {
        const key = dateCursor.toISOString().slice(0, 10);
        if (updatedVisits.includes(key)) {
            streak += 1;
            dateCursor.setDate(dateCursor.getDate() - 1);
        } else {
            break;
        }
    }

    const historyCount = typeof window.getPersonalHistory === "function"
        ? window.getPersonalHistory().length
        : 0;
    const percent = Math.min(100, 20 + streak * 16 + Math.min(historyCount, 10) * 4);
    const streakDays = document.getElementById("streakDays");
    const streakRing = document.getElementById("streakRing");
    const streakMessage = document.getElementById("streakMessage");
    const badgeRow = document.getElementById("badgeRow");

    if (streakDays) streakDays.innerText = `${streak}`;
    if (streakRing) streakRing.style.setProperty("--ring-progress", `${percent}%`);
    if (streakMessage) {
        streakMessage.innerText = streak >= 4
            ? fc("strongStreak")
            : fc("buildStreak");
    }

    if (badgeRow) {
        const badges = [
            { label: "Starter", active: historyCount >= 1 },
            { label: "Voice", active: localStorage.getItem("voiceUsed") === "yes" },
            { label: "Crop Doctor", active: localStorage.getItem("cropDoctorUsed") === "yes" },
            { label: "Planner", active: !!localStorage.getItem("crop_name") }
        ];
        badgeRow.innerHTML = badges.map((item) => `<span class="badge-chip ${item.active ? "active" : ""}">${item.label}</span>`).join("");
    }
}

function renderHomePage(data) {
    renderWeatherBlock(data.weather);
    renderMarketBoard(data.markets || []);
    const alertsList = document.getElementById("weatherAlertsList");
    if (alertsList) alertsList.innerHTML = createTimelineItems((data.live_alerts || []).map((item) => `${item.title}: ${item.body}`), fc("noWeatherAlerts"));
    const headline = document.getElementById("briefingHeadline");
    if (headline) headline.innerText = data.daily_briefing?.headline || "Daily AI briefing";
    const briefingTasks = document.getElementById("briefingTasks");
    if (briefingTasks) briefingTasks.innerHTML = createTimelineItems(data.daily_briefing?.top_tasks, fc("todayTasksFallback"));
    const todayActionBody = document.getElementById("todayActionBody");
    if (todayActionBody) todayActionBody.innerHTML = createTimelineItems(getTodayActionItems(data), fc("todayTasksFallback"));
    const voicePromptList = document.getElementById("voicePromptList");
    if (voicePromptList) voicePromptList.innerHTML = createTimelineItems([fc("voicePromptOne"), fc("voicePromptTwo"), fc("voicePromptThree")], fc("voiceHelp"));
    const voiceLeadText = document.getElementById("voiceLeadText");
    if (voiceLeadText) voiceLeadText.innerText = fc("voiceHelp");
    const voiceHeroButton = document.getElementById("voiceHeroButton");
    if (voiceHeroButton) voiceHeroButton.innerText = fc("startVoiceMode");
    const voicePill = document.getElementById("voicePill");
    if (voicePill) voicePill.innerText = fc("voiceReady");
    if (typeof window.renderGamification === "function") window.renderGamification();
    if (typeof window.renderHistory === "function") window.renderHistory();
}

function fillMyFarmForm(data) {
    const farmProfile = data.farm_profile || {};
    const formValues = {
        farmCrop: localStorage.getItem("crop_name") || farmProfile.primary_crop || "Wheat",
        farmLand: localStorage.getItem("land_size") || "",
        farmSoil: localStorage.getItem("soil_type") || "Loamy",
        farmSeason: localStorage.getItem("season") || "Rabi",
        farmVillage: localStorage.getItem("village") || "",
        farmLanguage: localStorage.getItem("preferred_language") || "English",
        farmIrrigation: farmProfile.irrigation_type || localStorage.getItem("farm_irrigation") || "",
        farmTaluka: farmProfile.taluka || localStorage.getItem("farm_taluka") || "",
        farmName: farmProfile.farm_name || localStorage.getItem("farm_name") || ""
    };

    Object.entries(formValues).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });

    const landBadge = document.getElementById("farmLandBadge");
    const districtBadge = document.getElementById("farmDistrictBadge");
    if (landBadge) landBadge.innerText = formValues.farmLand || "-";
    if (districtBadge) districtBadge.innerText = localStorage.getItem("userDistrict") || "-";
}

function renderMyFarmPage(data) {
    fillMyFarmForm(data);
    const farmProfile = data.farm_profile || {};
    const farmProfileBody = document.getElementById("farmProfileBody");
    const profileItems = [
        farmProfile.farm_name ? `Farm: ${farmProfile.farm_name}` : null,
        farmProfile.primary_crop ? `Primary crop: ${farmProfile.primary_crop}` : `Primary crop: ${localStorage.getItem("crop_name") || "Wheat"}`,
        farmProfile.irrigation_type ? `Irrigation: ${farmProfile.irrigation_type}` : null,
        farmProfile.taluka ? `Taluka: ${farmProfile.taluka}` : null,
        localStorage.getItem("soil_type") ? `Soil: ${localStorage.getItem("soil_type")}` : null,
        localStorage.getItem("season") ? `Season: ${localStorage.getItem("season")}` : null
    ].filter(Boolean);
    if (farmProfileBody) farmProfileBody.innerHTML = createTimelineItems(profileItems, fc("completeFarmSetup"));

    const plannerTitle = document.getElementById("plannerTitle");
    if (plannerTitle) plannerTitle.innerText = data.farm_plan?.title || fc("weekPlanner");
    const plannerTasks = document.getElementById("plannerTasks");
    if (plannerTasks) plannerTasks.innerHTML = (data.farm_plan?.tasks || []).map((item) => `<div class="timeline-item"><h4>${item.stage}</h4><p>${item.task}</p></div>`).join("") || `<div class="timeline-item"><p>${fc("plannerWillAppear")}</p></div>`;
    const schemeMatches = document.getElementById("schemeMatches");
    if (schemeMatches) schemeMatches.innerHTML = (data.scheme_matches || []).map((item) => `<div class="timeline-item"><h4>${item.name}</h4><p>${item.reason}</p></div>`).join("") || `<div class="timeline-item"><p>${fc("relevantSchemes")}</p></div>`;
    const liveAlertsBody = document.getElementById("liveAlertsBody");
    if (liveAlertsBody) liveAlertsBody.innerHTML = createTimelineItems(data.live_alerts, fc("noLiveFieldAlerts"));
    const mapTitle = document.getElementById("mapTitle");
    if (mapTitle) mapTitle.innerText = data.map_context?.title || fc("nearbyContext");
    const mapLayers = document.getElementById("mapLayers");
    if (mapLayers) mapLayers.innerHTML = createTimelineItems(data.map_context?.nearby_layers, fc("nearbyContextSoon"));
    const status = document.getElementById("farmSetupStatus");
    if (status) status.innerText = profileItems.length >= 4 ? fc("complete") : fc("inProgress");
    const cropCalendarList = document.getElementById("cropCalendarList");
    if (cropCalendarList) cropCalendarList.innerHTML = createTimelineItems(buildCropCalendar(localStorage.getItem("crop_name"), localStorage.getItem("season")));
    const reminderList = document.getElementById("reminderList");
    if (reminderList) reminderList.innerHTML = createTimelineItems(buildReminderItems(data));
}

function renderCropCarePage(data) {
    const pestRiskTitle = document.getElementById("pestRiskTitle");
    if (pestRiskTitle) pestRiskTitle.innerText = `${data.pest_risk?.risk || "Medium"} risk`;
    const pestRiskBody = document.getElementById("pestRiskBody");
    if (pestRiskBody) pestRiskBody.innerHTML = createTimelineItems([{ title: data.pest_risk?.likely_issue || "Crop watch", body: data.pest_risk?.reason || "Risk reasons will appear here." }]);
    const memoryTitle = document.getElementById("memoryTitle");
    if (memoryTitle) memoryTitle.innerText = data.chat_memory?.summary || "Learning";
    const memoryBody = document.getElementById("memoryBody");
    if (memoryBody) memoryBody.innerHTML = createTimelineItems(data.chat_memory?.preferences, fc("useMoreForMemory"));
    const liveAlertsBody = document.getElementById("liveAlertsBody");
    if (liveAlertsBody) liveAlertsBody.innerHTML = createTimelineItems(data.live_alerts, fc("noUrgentAlerts"));
    if (typeof window.runDecisionEngine === "function") window.runDecisionEngine();
    if (typeof window.runCompareDecisions === "function") window.runCompareDecisions();
}

function renderMarketPage(data) {
    renderMarketBoard(data.markets || []);
    const predictionTitle = document.getElementById("marketPredictionTitle");
    if (predictionTitle) predictionTitle.innerText = data.market_prediction?.sell_window || fc("watchThisWeek");
    const predictionBody = document.getElementById("marketPredictionBody");
    if (predictionBody) predictionBody.innerHTML = createTimelineItems([{ title: data.market_prediction?.trend || fc("stable"), body: data.market_prediction?.insight || fc("predictionSoon") }]);
    const alertsList = document.getElementById("weatherAlertsList");
    if (alertsList) alertsList.innerHTML = createTimelineItems((data.live_alerts || []).map((item) => `${item.title}: ${item.body}`), fc("noMarketAlerts"));
    if (typeof populateIndiaLocationSelectors === "function") populateIndiaLocationSelectors("mapState", "mapDistrict");
    if (typeof window.runProfitCalculator === "function") window.runProfitCalculator();
    const marketTrend = buildMarketTrend(data);
    const marketTrendBody = document.getElementById("marketTrendBody");
    const sellDecisionBody = document.getElementById("sellDecisionBody");
    if (marketTrendBody) {
        marketTrendBody.innerHTML = createTimelineItems([
            { title: marketTrend.label, body: `${marketTrend.series.join(" → ")}` },
            { title: fc("marketTrendTitle"), body: marketTrend.note }
        ]);
    }
    if (sellDecisionBody) {
        sellDecisionBody.innerHTML = createTimelineItems([
            { title: marketTrend.suggestion, body: `${marketTrend.label}. ${marketTrend.note}` }
        ]);
    }
}

async function saveMyFarmSetup() {
    const saveMessage = document.getElementById("farmSaveMessage");
    const userId = parseInt(localStorage.getItem("userId") || "0", 10);
    const preferencePayload = {
        user_id: userId,
        crop_name: document.getElementById("farmCrop")?.value || "",
        land_size: document.getElementById("farmLand")?.value.trim() || "",
        soil_type: document.getElementById("farmSoil")?.value || "",
        season: document.getElementById("farmSeason")?.value || "",
        village: document.getElementById("farmVillage")?.value.trim() || "",
        preferred_language: document.getElementById("farmLanguage")?.value || "English"
    };

    Object.entries(preferencePayload).forEach(([key, value]) => {
        if (key !== "user_id") localStorage.setItem(key, value);
    });
    localStorage.setItem("farm_name", document.getElementById("farmName")?.value.trim() || "");
    localStorage.setItem("farm_irrigation", document.getElementById("farmIrrigation")?.value.trim() || "");
    localStorage.setItem("farm_taluka", document.getElementById("farmTaluka")?.value.trim() || "");

    try {
        if (userId) {
            await fetch(`${AGRO_API_URL}/profile/preferences`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preferencePayload)
            });
            await fetch(`${AGRO_API_URL}/farm-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    farm_name: document.getElementById("farmName")?.value.trim() || "",
                    primary_crop: preferencePayload.crop_name,
                    irrigation_type: document.getElementById("farmIrrigation")?.value.trim() || "",
                    taluka: document.getElementById("farmTaluka")?.value.trim() || ""
                })
            });
        }
        if (saveMessage) saveMessage.innerText = fc("saveFarmSuccess");
    } catch (error) {
        console.error("save farm setup error", error);
        if (saveMessage) saveMessage.innerText = fc("saveFarmFallback");
    }
}

async function initFarmerPage() {
    if (typeof initI18n === "function") initI18n();
    setTheme(getCurrentTheme());
    applySavedLanguage();
    updateAuthState();
    setHeaderMeta();

    latestFarmerPageData = await fetchDashboardOverview();
    rerenderCurrentPage();
}

function rerenderCurrentPage() {
    if (!latestFarmerPageData) return;
    const page = document.body.dataset.page;
    if (page === "home") renderHomePage(latestFarmerPageData);
    if (page === "my-farm") renderMyFarmPage(latestFarmerPageData);
    if (page === "crop-care") renderCropCarePage(latestFarmerPageData);
    if (page === "market") renderMarketPage(latestFarmerPageData);
}

window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.saveMyFarmSetup = saveMyFarmSetup;
window.renderGamification = renderGamification;
window.fc = fc;

document.addEventListener("DOMContentLoaded", initFarmerPage);
window.addEventListener("ui-language-changed", () => {
    setTheme(getCurrentTheme());
    updateAuthState();
    setHeaderMeta();
    rerenderCurrentPage();
});
