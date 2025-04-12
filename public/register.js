const form = document.getElementById("register-form");
const status = document.getElementById("register-status");
const apiBase = window.location.origin;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!username || !password) {
    status.innerText = "❌ Username and password are required.";
    return;
  }

  try {
    const res = await fetch(`${apiBase}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("fartLoggedIn", "true");
      localStorage.setItem("fartCurrentUser", username);
      alert("✅ Registration complete! Welcome aboard.");
      window.location.href = "index.html";
    } else {
      status.innerText = "❌ " + (data.error || "Registration failed.");
    }
  } catch (err) {
    status.innerText = "❌ Could not connect to server.";
    console.error(err);
  }
});
