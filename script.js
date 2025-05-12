// Elemente
const playerOneInput = document.getElementById("playerOneInput");
const playerTwoInput = document.getElementById("playerTwoInput");
const playerOnePreview = document.getElementById("playerOnePreview");
const playerTwoPreview = document.getElementById("playerTwoPreview");
const battleBtn = document.getElementById("battleBtn");
const resultDiv = document.getElementById("result");
const nicknameInput = document.getElementById("nicknameInput");
const nicknameOverlay = document.getElementById("nicknameOverlay");
const welcomeText = document.getElementById("welcomeText");
const startButton = document.getElementById("startButton");

// Bildervorschau laden
playerOneInput.addEventListener("change", () => {
  const file = playerOneInput.files[0];
  if (file) {
    playerOnePreview.src = URL.createObjectURL(file);
  }
  checkReady();
});

playerTwoInput.addEventListener("change", () => {
  const file = playerTwoInput.files[0];
  if (file) {
    playerTwoPreview.src = URL.createObjectURL(file);
  }
  checkReady();
});

// Button aktivieren, wenn beide Bilder vorhanden
function checkReady() {
  if (playerOneInput.files.length > 0 && playerTwoInput.files.length > 0) {
    battleBtn.disabled = false;
  }
}

// „Battle starten“-Button Logik
battleBtn.addEventListener("click", () => {
  const nickname = localStorage.getItem("nickname") || "Unknown";
  const winner = Math.random() < 0.5 ? "Picture 1" : "Picture 2";
  resultDiv.innerHTML = `<h2>${winner} wins! 🏆</h2><p>Nickname: ${nickname}</p>`;
});

// Nickname speichern
startButton.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();
  if (nickname) {
    localStorage.setItem("nickname", nickname);
    nicknameOverlay.style.display = "none";
    welcomeText.style.display = "block";
    welcomeText.querySelector("h2").textContent = `Welcome, ${nickname}!`;
  }
});

// Zeige Nickname-Overlay nur beim ersten Besuch
window.addEventListener("load", () => {
  const savedNickname = localStorage.getItem("nickname");
  if (savedNickname) {
    nicknameOverlay.style.display = "none";
    welcomeText.style.display = "block";
    welcomeText.querySelector("h2").textContent = `Welcome back, ${savedNickname}!`;
  }
});

// Privacy Overlay
const openPrivacyBtn = document.getElementById("openPrivacyBtn");
const closePrivacyBtn = document.getElementById("closePrivacyBtn");
const privacyOverlay = document.getElementById("privacyOverlay");

openPrivacyBtn.addEventListener("click", () => {
  privacyOverlay.style.display = "block";
});

closePrivacyBtn.addEventListener("click", () => {
  privacyOverlay.style.display = "none";
});
