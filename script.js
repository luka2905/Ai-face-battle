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

    // Track nickname with Google Analytics
    gtag('event', 'set_nickname', {
      nickname: nickname
    });

    // Send to Amplitude
    amplitude.logEvent('set_nickname', { nickname: nickname });
  }
}

// Show nickname if already saved
window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome back, ${savedNickname}!`;
  }

  // Add event listener for the Start button in the nickname overlay
  const startButton = document.querySelector("button");
  startButton.addEventListener("click", saveNickname);
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

// Handle image uploads with GA and Amplitude events
playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  gtag('event', 'upload_image', {
    'event_category': 'Image 1',
    'event_label': 'Image Uploaded'
  });
  amplitude.logEvent('upload_image_1');
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  gtag('event', 'upload_image', {
    'event_category': 'Image 2',
    'event_label': 'Image Uploaded'
  });
  amplitude.logEvent('upload_image_2');
});

// Compare two images with error handling
function areImagesEqual(file1, file2) {
  return new Promise((resolve, reject) => {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function () {
      reader2.onload = function () {
        resolve(reader1.result === reader2.result);
      };
      reader2.onerror = () => reject('Error reading file 2');
      reader2.readAsDataURL(file2);
    };

    reader1.onerror = () => reject('Error reading file 1');
    reader1.readAsDataURL(file1);
  });
}

// Create simple hash based on file names
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

  // Use cached result if already compared
  if (currentHash === previousHash) {
    resultDiv.textContent = previousResult;
    return;
  }

  // Track game start
  gtag('event', 'start', {
    'event_category': 'Game',
    'event_label': 'Generate Started'
  });
  amplitude.logEvent('Battle starten');

  // Compare images
  areImagesEqual(file1, file2).then(equal => {
    let resultText;
    if (equal) {
      resultText = "It's a tie! Both images are the same.";
    } else {
      const winner = Math.random() < 0.5 ? "Image 1" : "Image 2";
      resultText = `${winner} looks better! 🎉`;
    }

    resultDiv.textContent = resultText;

    // Save result for this pair
    previousHash = currentHash;
    previousResult = resultText;

    // Track result
    gtag('event', 'battle_result', {
      'event_category': 'Game',
      'event_label': resultText
    });
    amplitude.logEvent('battle_result', { result: resultText });

  }).catch(err => {
    console.error("Image comparison error:", err);
    resultDiv.textContent = `Error comparing images: ${err}`;
  });
});

// Privacy Policy button logic
const openPrivacyBtn = document.getElementById("openPrivacyBtn");
const privacyOverlay = document.getElementById("privacyOverlay");
const closePrivacyBtn = document.getElementById("closePrivacyBtn");

openPrivacyBtn.addEventListener("click", () => {
  privacyOverlay.style.display = "flex";
});

closePrivacyBtn.addEventListener("click", () => {
  privacyOverlay.style.display = "none";
});
let battleImages = [null, null];

function previewBattleImage(event, index) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      battleImages[index] = e.target.result;
      document.getElementById('battleImg' + index).src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
}

function startBattle() {
  if (!battleImages[0] || !battleImages[1]) {
    alert("Bitte lade zwei Bilder hoch.");
    return;
  }

  // Zufällige Auswahl – später durch AI ersetzen
  const winner = Math.random() < 0.5 ? 0 : 1;

  // Rahmen anzeigen
  for (let i = 0; i < 2; i++) {
    const faceDiv = document.getElementById('face' + i);
    faceDiv.style.border = i === winner ? "3px solid #00ff99" : "3px solid transparent";
  }
}
document.getElementById('generateHugBtn').addEventListener('click', async () => {
    const file1 = document.getElementById('imageOneInput').files[0];
    const file2 = document.getElementById('imageTwoInput').files[0];

    if (!file1 || !file2) {
        alert("Bitte lade zwei Bilder hoch.");
        return;
    }

    const formData = new FormData();
    formData.append('image_one', file1);
    formData.append('image_two', file2);

    // Replace with your Replicate API key and model version ID
    const apiKey = "YOUR_REPLICATE_API_KEY";
    const modelVersionId = "YOUR_MODEL_VERSION_ID";

    try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: modelVersionId,
                input: {
                    image_one: file1,
                    image_two: file2
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            alert('Fehler beim Generieren der Umarmung!');
        } else {
            document.getElementById('hugImage').src = data.output[0]; // The generated hug image
            document.getElementById('hugResult').style.display = 'block';
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Umarmung:', error);
        alert('Es gab ein Problem beim Erzeugen der Umarmung.');
    }
});
const storageRef = firebase.storage().ref();

function uploadImage(file) {
    const fileRef = storageRef.child('uploads/' + file.name);
    return fileRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
}

document.getElementById('generateHugBtn').addEventListener('click', async () => {
    const file1 = document.getElementById('imageOneInput').files[0];
    const file2 = document.getElementById('imageTwoInput').files[0];

    if (!file1 || !file2) {
        alert("Bitte lade zwei Bilder hoch.");
        return;
    }

    try {
        // Upload images to Firebase Storage
        const imageUrl1 = await uploadImage(file1);
        const imageUrl2 = await uploadImage(file2);

        // Now send the URLs to Replicate API
        const apiKey = "YOUR_REPLICATE_API_KEY";
        const modelVersionId = "YOUR_MODEL_VERSION_ID";

        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: modelVersionId,
                input: {
                    image_one: imageUrl1,
                    image_two: imageUrl2
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            alert('Fehler beim Generieren der Umarmung!');
        } else {
            document.getElementById('hugImage').src = data.output[0]; // The generated hug image
            document.getElementById('hugResult').style.display = 'block';
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Umarmung:', error);
        alert('Es gab ein Problem beim Erzeugen der Umarmung.');
    }
});
