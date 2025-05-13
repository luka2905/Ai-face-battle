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

function saveNickname() {
  const nickname = document.getElementById('nicknameInput').value.trim();
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome, ${nickname}!`;

    gtag('event', 'set_nickname', { nickname });
    amplitude.getInstance().setUserId(nickname);
    amplitude.getInstance().logEvent("nickname_set", { nickname });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const savedNickname = localStorage.getItem('nickname');
  if (savedNickname) {
    nicknameOverlay.style.display = 'none';
    welcomeText.textContent = `Welcome back, ${savedNickname}!`;
    amplitude.getInstance().setUserId(savedNickname);
  }

  document.querySelector("#nicknameOverlay button").addEventListener("click", saveNickname);
});

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

function checkBattleReady() {
  battleBtn.disabled = !(playerOneInput.files.length > 0 && playerTwoInput.files.length > 0);
}

playerOneInput.addEventListener('change', () => {
  displayImagePreview(playerOneInput, playerOnePreview);
  gtag('event', 'upload_image', { image: '1' });
  amplitude.getInstance().logEvent("upload_image", { image: '1' });
});

playerTwoInput.addEventListener('change', () => {
  displayImagePreview(playerTwoInput, playerTwoPreview);
  gtag('event', 'upload_image', { image: '2' });
  amplitude.getInstance().logEvent("upload_image", { image: '2' });
});

function getFileHash(file1, file2) {
  return file1.name + '_' + file2.name;
}

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

  gtag('event', 'start_battle');
  amplitude.getInstance().logEvent("battle_start");

  areImagesEqual(file1, file2).then(equal => {
    let resultText;
    if (equal) {
      resultText = "It's a tie! Both images are the same.";
    } else {
      const winner = Math.random() < 0.5 ? "Image 1" : "Image 2";
      resultText = `${winner} looks better! 🎉`;
    }

    resultDiv.textContent = resultText;
    previousHash = currentHash;
    previousResult = resultText;

    gtag('event', 'battle_result', { result: resultText });
    amplitude.getInstance().logEvent("battle_result", { result: resultText });
  }).catch(err => {
    console.error("Image comparison error:", err);
    resultDiv.textContent = `Error comparing images: ${err}`;
  });
});

document.getElementById("openPrivacyBtn").addEventListener("click", () => {
  document.getElementById("privacyOverlay").style.display = "flex";
});

document.getElementById("closePrivacyBtn").addEventListener("click", () => {
  document.getElementById("privacyOverlay").style.display = "none";
});
