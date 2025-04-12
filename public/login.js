const form = document.getElementById("login-form");
const status = document.getElementById("login-status");
const apiBase = window.location.origin;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await fetch(`${apiBase}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("fartLoggedIn", "true");
      localStorage.setItem("fartCurrentUser", username);
      alert(`Welcome back, ${username}!`);
      window.location.href = "index.html";
    } else {
      status.innerText = "❌ " + (data.error || "Login failed");
    }
  } catch (err) {
    status.innerText = "❌ Could not connect to server.";
    console.error(err);
  }
});
