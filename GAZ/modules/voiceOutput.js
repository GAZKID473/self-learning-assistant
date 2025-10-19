export default function voiceOutput() {
  const text = document.getElementById("output").textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
  document.getElementById("avatar").textContent = "🔊";
}
