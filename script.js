// Eingabefelder, Previews, Button & Ergebnisfeld
const playerOneInput = document.getElementById('playerOneInput');
const playerTwoInput = document.getElementById('playerTwoInput');
const playerOnePreview = document.getElementById('playerOnePreview');
const playerTwoPreview = document.getElementById('playerTwoPreview');
const battleBtn = document.getElementById('battleBtn');
const resultDiv = document.getElementById('result');

// Nickname-Funktion
function saveNickname() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    document.getElementById('nicknameOverlay').style.display = 'none';
    document.getElementById('welcomeText').textContent = `Welcome, ${nickname}!`;

    // Google Analytics Event
    gtag('event', 'set_nickname', {
      nickname: nickname
    });
  }
}

// Nickname anzeigen wenn schon gespeichert
window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    document.getElementById('nicknameOverlay').style.display = 'none';
    document.getElementById('welcomeText').textContent = `Welcome back, ${savedNickname}!`;
  }
});

// Bildvorschau anzeigen
function displayImagePreview(input, preview) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    preview.style.display = 'block';
    checkBattleReady();
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Button aktivieren wenn beide Bilder da
function checkBattleReady() {
  battleBtn.disabled = !(playerOneInput.files.length > 0 && playerTwoInput.files.length > 0);
}

// Event Listener für Dateiänderung
playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  gtag('event', 'upload_image', {
    'event_category': 'Image 1',
    'event_label': 'Image Uploaded'
  });
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  gtag('event', 'upload_image', {
    'event_category': 'Image 2',
    'event_label': 'Image Uploaded'
  });
});

// Funktion zum Vergleichen der Bilder
function areImagesEqual(file1, file2) {
  return new Promise((resolve, reject) => {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function () {
      reader2.onload = function () {
        resolve(reader1.result === reader2.result);
      };
      reader2.readAsDataURL(file2);
    };
    reader1.readAsDataURL(file1);
  });
}

// Battle-Button Logik
battleBtn.addEventListener('click', () => {
  const file1 = playerOneInput.files[0];
  const file2 = playerTwoInput.files[0];

  if (!file1 || !file2) {
    resultDiv.textContent = "Beide Spieler müssen ein Bild hochladen!";
    return;
  }

  // Google Analytics Event
  gtag('event', 'start', {
    'event_category': 'Game',
    'event_label': 'Generate Started'
  });

  areImagesEqual(file1, file2).then(equal => {
    if (equal) {
      resultDiv.textContent = "Unentschieden! Beide Bilder sind gleich.";
    } else {
      const winner = Math.random() < 0.5 ? "Bild 1" : "Bild 2";
      resultDiv.textContent = `${winner} sieht besser aus! 🎉`;
    }
  }).catch(err => {
    console.error("Fehler beim Bildvergleich:", err);
    resultDiv.textContent = "Fehler beim Vergleich.";
  });
});

