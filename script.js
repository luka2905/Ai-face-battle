const playerOneInput = document.getElementById("playerOneInput");
const playerTwoInput = document.getElementById("playerTwoInput");
const battleBtn = document.getElementById("battleBtn");
const resultDiv = document.getElementById("result");
const playerOnePreview = document.getElementById("playerOnePreview");
const playerTwoPreview = document.getElementById("playerTwoPreview");

let playerOneReady = false;
let playerTwoReady = false;

playerOneInput.addEventListener("change", () => {
  const file = playerOneInput.files[0];
  if (file) {
    playerOneReady = true;
    playerOnePreview.src = URL.createObjectURL(file);
  } else {
    playerOneReady = false;
    playerOnePreview.src = "";
  }
  checkReady();
});

playerTwoInput.addEventListener("change", () => {
  const file = playerTwoInput.files[0];
  if (file) {
    playerTwoReady = true;
    playerTwoPreview.src = URL.createObjectURL(file);
  } else {
    playerTwoReady = false;
    playerTwoPreview.src = "";
  }
  checkReady();
});

function checkReady() {
  battleBtn.disabled = !(playerOneReady && playerTwoReady);
}

battleBtn.addEventListener("click", () => {
  const winner = Math.random() > 0.5 ? "Spieler 1" : "Spieler 2";
  resultDiv.textContent = `${winner} sieht laut KI besser aus!`;
});
