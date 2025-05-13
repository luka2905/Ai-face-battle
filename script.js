const playerOneInput = document.getElementById('playerOneInput');
const playerTwoInput = document.getElementById('playerTwoInput');
const playerOnePreview = document.getElementById('playerOnePreview');
const playerTwoPreview = document.getElementById('playerTwoPreview');
const battleBtn = document.getElementById('battleBtn');
const resultDiv = document.getElementById('result');
const nicknameOverlay = document.getElementById('nicknameOverlay');
const welcomeText = document.getElementById('welcomeText');

let previousHash = null;
let previousResult = null;

// Nickname speichern
function saveNickname() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome, ${nickname}!`;
    gtag('event', 'set_nickname', { nickname });
    amplitude.track('Set Nickname', { nickname });
  }
}

// Nickname beim Laden anzeigen
window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome back, ${savedNickname}!`;
  }
});

// Bildvorschau anzeigen
function displayImagePreview(input, preview) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = 'block';
    checkBattleReady();
  };
  reader.readAsDataURL(file);
}

// Battle-Button aktivieren, wenn beide Bilder da sind
function checkBattleReady() {
  if (playerOneInput.files.length && playerTwoInput.files.length) {
    battleBtn.disabled = false;
  } else {
    battleBtn.disabled = true;
  }
}

// Bildvergleich (als Hash-Ersatz: Dateinamen vergleichen)
function getFileHash(file1, file2) {
  return `${file1.name}_${file2.name}_${file1.size}_${file2.size}`;
}

// Bilder gleich?
function areImagesEqual(file1, file2) {
  return new Promise((resolve, reject) => {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = () => {
      reader2.onload = () => {
        resolve(reader1.result === reader2.result);
      };
      reader2.onerror = reject;
      reader2.readAsDataURL(file2);
    };

    reader1.onerror = reject;
    reader1.readAsDataURL(file1);
  });
}

// Upload-Events
playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  amplitude.track('Upload Image', { slot: 'Image 1' });
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  amplitude.track('Upload Image', { slot: 'Image 2' });
});

// Battle starten
battleBtn.addEventListener('click', () => {
  const file1 = playerOneInput.files[0];
  const file2 = playerTwoInput.files[0];

  if (!file1 || !file2) {
    resultDiv.textContent = "Please upload both images.";
    return;
  }

  const hash = getFileHash(file1, file2);

  if (hash === previousHash) {
    resultDiv.textContent = previousResult;
    return;
  }

  amplitude.track('Battle Started');

  areImagesEqual(file1, file2).then(equal => {
    let resultText = equal
      ? "It's a tie! Both images are the same."
      : `${Math.random() < 0.5 ? "Image 1" : "Image 2"} looks better! 🎉`;

    resultDiv.textContent = resultText;
    previousHash = hash;
    previousResult = resultText;

    amplitude.track('Battle Result', { result: resultText });
  }).catch(err => {
    console.error("Comparison error:", err);
    resultDiv.textContent = "Error comparing images.";
  });
});

// Datenschutz anzeigen
document.getElementById("openPrivacyBtn").addEventListener("click", () => {
  document.getElementById("privacyOverlay").style.display = "flex";
});
document.getElementById("closePrivacyBtn").addEventListener("click", () => {
  document.getElementById("privacyOverlay").style.display = "none";
});
