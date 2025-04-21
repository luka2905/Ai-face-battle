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
  document.getElementById("battleBtn").addEventListener("click", function () {
  const playerOneInput = document.getElementById("playerOneInput");
  const playerTwoInput = document.getElementById("playerTwoInput");
  const playerOnePreview = document.getElementById("playerOnePreview");
  const playerTwoPreview = document.getElementById("playerTwoPreview");

  const resultElement = document.getElementById("result");

  // Wenn keine Bilder ausgewählt wurden
  if (!playerOneInput.files[0] || !playerTwoInput.files[0]) {
    resultElement.textContent = "Beide Spieler müssen Bilder hochladen!";
    return;
  }

  // Bilder der Spieler anzeigen
  playerOnePreview.src = URL.createObjectURL(playerOneInput.files[0]);
  playerTwoPreview.src = URL.createObjectURL(playerTwoInput.files[0]);
  playerOnePreview.style.display = "block";
  playerTwoPreview.style.display = "block";

  // Wenn die Bilder gleich sind (Verhindern der Veränderung des Ergebnisses)
  areImagesEqual(playerOneInput.files[0], playerTwoInput.files[0])
    .then((equal) => {
      if (equal) {
        resultElement.textContent = "Es ist ein Unentschieden! Die Bilder sind gleich.";
      } else {
        // Hier kannst du die Logik für den Gewinner einfügen
        const winner = Math.random() < 0.5 ? "Image1" : "Image 2";
        resultElement.textContent = `${winner} hat gewonnen!`;
      }
    })
    .catch((error) => {
      console.error("Fehler beim Bildvergleich:", error);
      resultElement.textContent = "Fehler beim Vergleichen der Bilder.";
    });
});

// Funktion zum Vergleichen von Bildern
function areImagesEqual(file1, file2) {
  return new Promise((resolve, reject) => {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function () {
      reader2.onload = function () {
        const image1 = new Image();
        const image2 = new Image();

        image1.onload = function () {
          image2.onload = function () {
            // Vergleich der Bilder als Base64-Strings
            resolve(reader1.result === reader2.result);
          };
          image2.src = reader2.result;
        };
        image1.src = reader1.result;
      };
      reader2.readAsDataURL(file2);
    };
    reader1.readAsDataURL(file1);
  });
}

  setTimeout(function () {
    resultDiv.innerHTML = "Image 1 gewinnt!";
  }, 2000);
});
