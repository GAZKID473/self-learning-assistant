import moodTracker from './modules/moodTracker.js';
import voiceInput from './modules/voiceInput.js';
import voiceOutput from './modules/voiceOutput.js';
import translator from './modules/translator.js';

let currentModule = moodTracker;

let memory = {
  favoriteColor: "teal",
  tone: "playful",
  avatarStyle: "expressive",
  usedModules: [],
};

function updateMemory(key, value) {
  memory[key] = value;
  console.log("Memory updated:", memory);
}

function respondWithPersonality(text) {
  const tone = memory.tone;
  if (tone === "playful") {
    return `✨ Here's a fun thought: ${text} 😄`;
  } else if (tone === "supportive") {
    return `💬 You’ve got this: ${text}`;
  } else {
    return text;
  }
}

function getSuggestions() {
  const suggestions = [];

  if (!memory.usedModules.includes("translator")) {
    suggestions.push("Try translating a phrase: 'Translate hello to Japanese'");
  }
  if (memory.tone !== "supportive") {
    suggestions.push("Want me to be more supportive? Say 'Set tone to supportive'");
  }
  if (!memory.favoriteColor) {
    suggestions.push("Tell me your favorite color so I can match my vibe");
  }
  if (!memory.usedModules.includes("voiceInput")) {
    suggestions.push("Try voice input: 'Voice input'");
  }
  suggestions.push("Edit a module: 'Edit mood tracker'");

  return suggestions;
}

function showSuggestions() {
  const ideas = getSuggestions();
  if (ideas.length > 0) {
    addChatMessage("Assistant", "💡 Suggestions:\n" + ideas.map(s => `• ${s}`).join("\n"));
  }
}

window.runModule = () => {
  const userState = { mood: "curious" };
  const result = currentModule(userState);
  document.getElementById("output").textContent = result;
  document.getElementById("avatar").textContent = memory.avatarStyle === "expressive" ? "😄" : "🤖";
  memory.usedModules.push("moodTracker");
};

window.openEditor = () => {
  document.getElementById("editorPanel").style.display = "block";
  fetch('./modules/moodTracker.js')
    .then(res => res.text())
    .then(code => {
      document.getElementById("editor").value = code;
    });
};

window.saveModule = () => {
  const newCode = document.getElementById("editor").value;
  try {
    currentModule = new Function("userState", newCode);
    runModule();
    alert("Module updated!");
  } catch (err) {
    alert("Error: " + err.message);
  }
};

window.runVoiceInput = () => {
  voiceInput();
  memory.usedModules.push("voiceInput");
};

window.runVoiceOutput = voiceOutput;
window.runTranslator = () => {
  translator();
  memory.usedModules.push("translator");
};

function addChatMessage(sender, text) {
  const log = document.getElementById("chatLog");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
}

async function queryLLM(message) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": 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, // Replace with your actual key
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

window.handleChat = async () => {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  addChatMessage("You", message);
  input.value = "";

  if (message.toLowerCase().includes("mood")) {
    runModule();
    addChatMessage("Assistant", respondWithPersonality(document.getElementById("output").textContent));
  } else if (message.toLowerCase().startsWith("say ")) {
    const toSay = message.slice(4);
    document.getElementById("output").textContent = toSay;
    runVoiceOutput();
    addChatMessage("Assistant", respondWithPersonality(`Speaking: "${toSay}"`));
  } else if (message.toLowerCase().includes("translate")) {
    runTranslator();
    setTimeout(() => {
      addChatMessage("Assistant", respondWithPersonality(document.getElementById("output").textContent));
      showSuggestions();
    }, 1500);
  } else if (message.toLowerCase().includes("edit")) {
    openEditor();
    addChatMessage("Assistant", respondWithPersonality("Opening the module editor..."));
  } else if (message.toLowerCase().includes("voice input")) {
    runVoiceInput();
    addChatMessage("Assistant", respondWithPersonality("Listening..."));
  } else if (message.toLowerCase().includes("set tone to supportive")) {
    updateMemory("tone", "supportive");
    addChatMessage("Assistant", "Tone set to supportive.");
  } else if (message.toLowerCase().includes("set tone to playful")) {
    updateMemory("tone", "playful");
    addChatMessage("Assistant", "Tone set to playful.");
  } else if (message.toLowerCase().includes("make avatar expressive")) {
    updateMemory("avatarStyle", "expressive");
    addChatMessage("Assistant", "Avatar style set to expressive.");
  } else if (message.toLowerCase().includes("remember my favorite color is")) {
    const color = message.split("remember my favorite color is")[1].trim();
    updateMemory("favoriteColor", color);
    addChatMessage("Assistant", `Got it! I'll remember your favorite color is ${color}.`);
  } else if (message.toLowerCase().includes("what modules have i used")) {
    addChatMessage("Assistant", `You've used: ${memory.usedModules.join(", ")}`);
  } else {
    const response = await queryLLM(message);
    addChatMessage("Assistant", respondWithPersonality(response));
  }

  showSuggestions();
};
