document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  // Testdaten – später durch Backend ersetzbar
  const dummyEmail = "test@example.com";
  const dummyPassword = "123456";

  if (email === dummyEmail && password === dummyPassword) {
    message.textContent = "✅ Erfolgreich eingeloggt!";
    message.style.color = "lightgreen";
    // z.B. später Weiterleitung: window.location.href = "game.html";
  } else {
    message.textContent = "❌ Falsche E-Mail oder Passwort!";
    message.style.color = "red";
  }
});
