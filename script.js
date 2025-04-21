function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "test@example.com" && password === "123456") {
    document.getElementById("message").innerText = "Login erfolgreich!";
  } else {
    document.getElementById("message").innerText = "Login fehlgeschlagen.";
  }
}
