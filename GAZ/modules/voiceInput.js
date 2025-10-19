export default function voiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("output").textContent = `You said: "${transcript}"`;
    document.getElementById("avatar").textContent = "🗣️";
  };

  recognition.onerror = (event) => {
    document.getElementById("output").textContent = "Voice input error: " + event.error;
  };
}
