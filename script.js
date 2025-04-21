// Hole die Eingabefelder und das Button-Element
const playerOneInput = document.getElementById('playerOneInput');
const playerTwoInput = document.getElementById('playerTwoInput');
const playerOnePreview = document.getElementById('playerOnePreview');
const playerTwoPreview = document.getElementById('playerTwoPreview');
const battleBtn = document.getElementById('battleBtn');
const resultDiv = document.getElementById('result');

// Funktion, um das Bild anzuzeigen, wenn es hochgeladen wird
function displayImagePreview(input, preview) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    preview.style.display = 'block'; // Zeige das Bild an
    checkBattleReady();
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Funktion, um den Button zu aktivieren, wenn beide Spieler Bilder hochgeladen haben
function checkBattleReady() {
  if (playerOneInput.files.length > 0 && playerTwoInput.files.length > 0) {
    battleBtn.disabled = false;
  } else {
    battleBtn.disabled = true;
  }
}

// Event-Listener, um das Bild anzuzeigen, wenn die Eingabe verändert wird
playerOneInput.addEventListener('change', function () {
  displayImagePreview(playerOneInput, playerOnePreview);
});
playerTwoInput.addEventListener('change', function () {
  displayImagePreview(playerTwoInput, playerTwoPreview);
});

// Funktion für den "Battle starten"-Button
battleBtn.addEventListener('click', function () {
  // Hier kannst du die Logik für das "Battle" einfügen (z.B. Vergleiche der Bilder oder AI-Entscheidungen)
  resultDiv.innerHTML = "Das Battle hat begonnen!";

  // Beispielhafte Ausgabe - Du könntest auch eine künstliche Intelligenz verwenden, um das Ergebnis zu bestimmen
  setTimeout(function () {
    resultDiv.innerHTML = "Spieler 1 gewinnt!";
  }, 2000);
});
