// Get the input elements, preview images, battle button, and result field
const playerOneInput = document.getElementById('playerOneInput');
const playerTwoInput = document.getElementById('playerTwoInput');
const playerOnePreview = document.getElementById('playerOnePreview');
const playerTwoPreview = document.getElementById('playerTwoPreview');
const battleBtn = document.getElementById('battleBtn');
const resultDiv = document.getElementById('result');
const nicknameOverlay = document.getElementById('nicknameOverlay');
const welcomeText = document.getElementById('welcomeText');

// Track previous image comparison hash
let previousHash = null;
let previousResult = null;

// Save nickname function
function saveNickname() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome, ${nickname}!`;

    amplitude.getInstance().setUserId(nickname); // Amplitude
    gtag('event', 'set_nickname', { nickname }); // GA
  }
}

// Show nickname if already saved
window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome back, ${savedNickname}!`;
    amplitude.getInstance().setUserId(savedNickname);
  }

  document.querySelector("#nicknameOverlay button")?.addEventListener("click", saveNickname);
});

// Show image preview
function displayImagePreview(input, preview) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    preview.src = reader.result;
    preview.style.display = 'block';
    checkBattleReady();
  };
  reader.readAsDataURL(file);
}

// Enable battle button only if both images are uploaded
function checkBattleReady() {
  battleBtn.disabled = !(playerOneInput.files.length > 0 && playerTwoInput.files.length > 0);
}

// Image upload event listeners
playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  gtag('event', 'upload_image', {
    event_category: 'Image 1',
    event_label: 'Image Uploaded'
  });
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  gtag('event', 'upload_image', {
    event_category: 'Image 2',
    event_label: 'Image Uploaded'
  });
});

// Simple hash using file names
function getFileHash(file1, file2) {
  return file1.name + '_' + file2.name;
}

// Battle logic
battleBtn.addEventListener('click', () => {
  const file1 = playerOneInput.files[0];
  const file2 = playerTwoInput.files[0];

  if (!file1 || !file2) {
    resultDiv.textContent = "Both players must upload images!";
    return;
  }

  const currentHash = getFileHash(file1, file2);
  if (currentHash === previousHash) {
    resultDiv.textContent = previousResult;
    return;
  }

  gtag('event', 'start', {
    event_category: 'Game',
    event_label: 'Generate Started'
  });

  const reader1 = new FileReader();
  const reader2 = new FileReader();

  reader1.onload = () => {
    const imgData1 = reader1.result;

    reader2.onload = () => {
      const imgData2 = reader2.result;

      let resultText;
      if (imgData1 === imgData2) {
        resultText = "It's a tie! Both images are the same.";
      } else {
        const winner = Math.random() < 0.5 ? "Image 1" : "Image 2";
        resultText = `${winner} looks better! 🎉`;
      }

      resultDiv.textContent = resultText;
      previousHash = currentHash;
      previousResult = resultText;

      gtag('event', 'battle_result', {
        event_category: 'Game',
        event_label: resultText
      });

      amplitude.getInstance().logEvent('battle_result', { result: resultText });
    };

    reader2.onerror = () => {
      resultDiv.textContent = "Error reading second image.";
    };

    reader2.readAsDataURL(file2);
  };

  reader1.onerror = () => {
    resultDiv.textContent = "Error reading first image.";
  };

  reader1.readAsDataURL(file1);
});
document.querySelector("#nicknameOverlay button")?.addEventListener("click", saveNickname);

