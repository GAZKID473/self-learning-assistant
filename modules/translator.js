export default async function translator() {
  const phrase = prompt("Enter phrase to translate:");
  const targetLang = prompt("Translate to (e.g., es, fr, zh):");

  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(phrase)}&langpair=en|${targetLang}`);
  const data = await res.json();
  const translated = data.responseData.translatedText;

  document.getElementById("output").textContent = `Translated: ${translated}`;
  document.getElementById("avatar").textContent = "🌍";
}
