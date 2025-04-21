const playerOneInput = document.getElementById("playerOneInput");
const playerTwoInput = document.getElementById("playerTwoInput");
const battleBtn = document.getElementById("battleBtn");
const resultDiv = document.getElementById("result");

let playerOneReady = false;
let playerTwoReady = false;

playerOneInput.addEventListener("change", () => {
  playerOneReady = playerOneInput.files.length > 0;
  checkReady();
});

playerTwoInput.addEventListener("change", () => {
  playerTwoReady = playerTwoInput.files.length > 0;
  checkReady();
});

function checkReady() {
  battleBtn.disabled = !(playerOneReady && playerTwoReady);
}

battleBtn.addEventListener("click", () => {
  const winner = Math.random() > 0.5 ? "Spieler 1" : "Spieler 2";
  resultDiv.textContent = `${winner} sieht laut KI besser aus!`;
});
