// Inputs, previews, button & result field
const playerOneInput = document.getElementById('playerOneInput');
const playerTwoInput = document.getElementById('playerTwoInput');
const playerOnePreview = document.getElementById('playerOnePreview');
const playerTwoPreview = document.getElementById('playerTwoPreview');
const battleBtn = document.getElementById('battleBtn');
const resultDiv = document.getElementById('result');

// Track previous image comparison hash
let previousHash = null;
let previousResult = null;

// Save nickname
function saveNickname() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    document.getElementById('nicknameOverlay').style.display = 'none';
    document.getElementById('welcomeText').textContent = `Welcome, ${nickname}!`;

    // Send nickname to Amplitude as a user property
    window.amplitude.getInstance().setUserProperties({
      'username': nickname
    });

    // Log nickname event in Google Analytics
    gtag('event', 'set_nickname', {
      nickname: nickname
    });
  }
}

// Show nickname if already saved
window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    document.getElementById('nicknameOverlay').style.display = 'none';
    document.getElementById('welcomeText').textContent = `Welcome back, ${savedNickname}!`;
  }
});

// Display image preview
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

// Enable battle button only if both images are uploaded
function checkBattleReady() {
  battleBtn.disabled = !(playerOneInput.files.length > 0 && playerTwoInput.files.length > 0);
}

// Handle image uploads with GA event
playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  const nickname = localStorage.getItem('nickname');
  
  // Send the upload event to Amplitude with the user's nickname
  window.amplitude.getInstance().logEvent('upload_image', {
    'event_category': 'Image 1',
    'event_label': 'Image Uploaded',
    'username': nickname // Send the nickname as event property
  });

  gtag('event', 'upload_image', {
    'event_category': 'Image 1',
    'event_label': 'Image Uploaded'
  });
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  const nickname = localStorage.getItem('nickname');
  
  // Send the upload event to Amplitude with the user's nickname
  window.amplitude.getInstance().logEvent('upload_image', {
    'event_category': 'Image 2',
    'event_label': 'Image Uploaded',
    'username': nickname // Send the nickname as event property
  });

  gtag('event', 'upload_image', {
    'event_category': 'Image 2',
    'event_label': 'Image Uploaded'
  });
});

// Compare two images
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

// Simple hash from file names to prevent switching results
function getFileHash(file1, file2) {
  return file1.name + '_' + file2.name;
}

// Battle logic
battleBtn.addEventListener('click', () => {
  const file1 = playerOneInput.files[0];
  const file2 = playerTwoInput.files[0];
  const nickname = localStorage.getItem('nickname');

  if (!file1 || !file2) {
    resultDiv.textContent = "Both players must upload images!";
    return;
  }

  const currentHash = getFileHash(file1, file2);

  // If same pair was already compared, show same result
  if (currentHash === previousHash) {
    resultDiv.textContent = previousResult;
    return;
  }

  gtag('event', 'start', {
    'event_category': 'Game',
    'event_label': 'Generate Started'
  });

  areImagesEqual(file1, file2).then(equal => {
    let resultText;
    if (equal) {
      resultText = "It's a tie! Both images are the same.";
    } else {
      const winner = Math.random() < 0.5 ? "Image 1" : "Image 2";
      resultText = `${winner} looks better! 🎉`;
    }

    resultDiv.textContent = resultText;

    // Send Battle result to Amplitude with username
    window.amplitude.getInstance().logEvent('image_battle_result', {
      'result': resultText,
      'username': nickname // Send the nickname as event property
    });

    // Save hash and result to prevent flipping
    previousHash = currentHash;
    previousResult = resultText;
  }).catch(err => {
    console.error("Image comparison error:", err);
    resultDiv.textContent = "Error comparing images.";
  });
});
