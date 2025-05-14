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
  amplitude.logEvent('Battle gestartet');

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
// Google Analytics
// Initialize Google Analytics with your tracking ID (replace with your actual GA ID)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TXZ4KQ5W8P'); // Google Analytics ID

// Amplitude
// Initialize Amplitude with your project ID and session replay plugin
(function(e, t){
  var n=e.amplitude||{_q:[],_iq:{}};
  var r=t.createElement("script");r.type="text/javascript";r.async=true;
  r.src="https://cdn.amplitude.com/libs/amplitude-2.16.1-min.js";
  r.onload=function(){e.amplitude.runQueuedFunctions()};
  var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i);
  var s=function(t,n){e.amplitude[t]=function(){e.amplitude._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}};
  var o=["add","append","clearAll","setUserId","setUserProperties","logEvent"];
  for(var a=0;a<o.length;a++){s(o[a])}
})(window, document);

// Initialize Amplitude with your project ID and session replay plugin
window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
window.amplitude.init('8c8d9e3d7080e5bfd91a608b6f703256', {
  fetchRemoteConfig: true,
  autocapture: true,
  serverZone: "EU" // If you are using the EU zone
});

// Track page load with Amplitude
window.amplitude.track('page_loaded');

// Example: Track when the user clicks the 'Battle Start' button
document.getElementById('battleBtn').addEventListener('click', function() {
  window.amplitude.track('battle_started', {
    playerOne: 'player1Data',
    playerTwo: 'player2Data'
  });
});

// Example: Track nickname input
document.getElementById('nicknameInput').addEventListener('input', function(event) {
  window.amplitude.logEvent('nickname_input', { nickname: event.target.value });
});
const db = firebase.firestore();
const userCountRef = db.collection('user_count').doc('active_users');

// Update the active user count
function updateUserCount(increment = true) {
  userCountRef.update({
    count: firebase.firestore.FieldValue.increment(increment ? 1 : -1)
  });
}

// Track user entering the site
window.addEventListener('load', () => {
  updateUserCount(true);
});

// Track user leaving the site
window.addEventListener('beforeunload', () => {
  updateUserCount(false);
});
// Track user activity every second
setInterval(() => {
  window.amplitude.logEvent('user_session_active', {
    'event_category': 'User Activity',
    'event_label': 'User is active on the website'
  });
}, 1000);  // Sends data every second to Amplitude

// Initialize Amplitude with your project ID
window.amplitude.init('8c8d9e3d7080e5bfd91a608b6f703256', {
  fetchRemoteConfig: true,
  autocapture: true,
  serverZone: "EU"  // Use EU server zone if necessary
});

