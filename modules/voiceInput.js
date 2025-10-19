export default function voiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.start();
  document.getElementById("output").textContent = "🎙️ Listening...";

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("output").textContent = `You said: "${transcript}"`;
    document.getElementById("avatar").textContent = "🗣️";

    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: transcript })
    });

    const data = await res.json();
    const reply = data.reply || "Sorry, I couldn't generate a response.";
    document.getElementById("output").textContent = reply;

    const log = document.getElementById("chatLog");
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>Assistant:</strong> ${reply}`;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  recognition.onerror = (event) => {
    document.getElementById("output").textContent = "Voice input error: " + event.error;
  };
}
