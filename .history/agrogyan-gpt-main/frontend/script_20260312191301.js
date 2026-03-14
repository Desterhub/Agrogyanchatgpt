// ===============================
// FORCE VOICE LOADING
// ===============================
window.speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};

// ===============================
// ASK QUESTION (MAIN FUNCTION)
// ===============================
async function askQuestion() {
    const question = document.getElementById("question").value;
    const language = document.getElementById("language").value;
    const answerBox = document.getElementById("answer");
    const confidenceBox = document.getElementById("confidence");

    if (!question.trim()) {
        alert("Please enter a question.");
        return;
    }

    answerBox.innerText = "Thinking...";
    if (confidenceBox) confidenceBox.innerText = "";

    try {
        const response = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question,
                language: language
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            answerBox.innerText = "Error: " + (errorText || response.statusText);
            return;
        }

        const data = await response.json();

        // Backend might return an answer or a fallback message
        answerBox.innerText = data.answer || "No answer found.";

        if (data.confidence !== undefined && confidenceBox) {
            confidenceBox.innerText = "Confidence: " + (data.confidence * 100).toFixed(0) + "%";
        }

        // Save to history (local storage)
        saveHistoryEntry({
            question,
            answer: data.answer || "No answer found.",
            language,
            ts: Date.now(),
        });

        // Speak the answer
        speakText(data.answer, language);

    } catch (error) {
        answerBox.innerText = "Backend not reachable.";
        console.error(error);
    }
}

function getHistory() {
    return JSON.parse(localStorage.getItem("agroHistory") || "[]");
}

function saveHistoryEntry(entry) {
    const history = getHistory();
    history.unshift(entry);
    localStorage.setItem("agroHistory", JSON.stringify(history.slice(0, 30)));
    renderHistory();
}

function clearHistory() {
    localStorage.removeItem("agroHistory");
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;

    const history = getHistory();

    if (history.length === 0) {
        list.innerHTML = "<p style='color:rgba(27,61,31,0.65);'>No history yet. Ask a question to start.</p>";
        return;
    }

    list.innerHTML = history.map(item => {
        const time = new Date(item.ts).toLocaleString();
        return `
        <div class="history-item">
            <h4>${item.question}</h4>
            <p><strong>Answer:</strong> ${item.answer}</p>
            <small>${time}</small>
            <button class="nav-btn" onclick='replayHistory(${item.ts})'>Ask again</button>
        </div>
        `;
    }).join("");
}

function replayHistory(ts) {
    const history = getHistory();
    const item = history.find(h => h.ts === ts);
    if (!item) return;

    document.getElementById("question").value = item.question;
    document.getElementById("language").value = item.language || "English";
    askQuestion();
}

// Render history on load
window.addEventListener("DOMContentLoaded", renderHistory);

// ===============================
// TEXT TO SPEECH (OUTPUT VOICE)
// ===============================
function speakText(text, language) {
    if (!window.speechSynthesis) {
        alert("Speech not supported in this browser.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Make voice sound natural
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    let langCode = "en-US";

    if (language === "Hindi") {
        langCode = "hi-IN";
    } else if (language === "Marathi") {
        langCode = "mr-IN";
    }

    const voices = speechSynthesis.getVoices();

    // Prefer Google voices (they sound best)
    let selectedVoice = voices.find(v =>
        v.lang === langCode && v.name.toLowerCase().includes("google")
    );

    // Fallback if Google voice not found
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === langCode);
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.lang = langCode;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// ===============================
// VOICE INPUT (MIC)
// ===============================
function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech Recognition not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const language = document.getElementById("language").value;

    if (language === "Hindi") {
        recognition.lang = "hi-IN";
    } else if (language === "Marathi") {
        recognition.lang = "mr-IN";
    } else {
        recognition.lang = "en-US";
    }

    document.getElementById("question").placeholder = "Listening... 🎤";

    recognition.start();

    recognition.onresult = function (event) {
        const text = event.results[0][0].transcript;
        document.getElementById("question").value = text;
        document.getElementById("question").placeholder = "Type or speak your agriculture question...";
    };

    recognition.onerror = function (event) {
        alert("Mic error: " + event.error);
    };
}

// ===============================
// IMAGE OCR UPLOAD
// ===============================
async function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const answerBox = document.getElementById("answer");
    answerBox.innerText = "Extracting text from image...";

    try {
        const response = await fetch("http://127.0.0.1:8000/upload-image/", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        // Auto-fill extracted text into question box
        document.getElementById("question").value = data.extracted_text;

        // Show LLM response
        answerBox.innerText = data.llm_response;

    } catch (error) {
        answerBox.innerText = "Error uploading image.";
        console.error(error);
    }
}