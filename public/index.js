const greetingDiv = document.getElementById('user-greeting');
const profileDisplay = document.getElementById('user-profile-display');
const user = localStorage.getItem('fartCurrentUser');
const isLoggedIn = localStorage.getItem('fartLoggedIn') === 'true';

// 👤 Show greeting and profile pic
if (isLoggedIn && user) {
  greetingDiv.innerHTML = `
    <p>👃 Welcome back, <strong>${user}</strong>!</p>
    <button onclick="window.location.href='profile.html'">Go to Profile</button>
    <button onclick="logout()">Logout</button>
  `;

  const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");
  const currentUser = users.find(u => u.username === user);
  const profilePic = currentUser?.profilePic || "";

  profileDisplay.innerHTML = `
    <a href="profile.html" class="user-profile" title="Go to your profile">
      ${profilePic 
        ? `<img src="${profilePic}" alt="Your Pic">` 
        : `<div style="width:36px;height:36px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#999;">👤</div>`}
      <span>${user}</span>
    </a>
  `;
} else {
  greetingDiv.innerHTML = `
    <p>You’re not logged in.</p>
    <a href="login.html">Login</a> or <a href="register.html">Register</a> to get sniffin’!
  `;
}

function logout() {
  localStorage.removeItem("fartLoggedIn");
  localStorage.removeItem("fartCurrentUser");
  alert("You've been logged out.");
  window.location.href = "index.html";
}

// ✅ Load everything after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderTopFarts();
  renderFeedback();
  renderLeaderboard();

  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedback);
  }
});

// 💨 Renders top 3 farts
function renderTopFarts() {
  const feed = document.getElementById("fart-feed");
  const allFarts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
  const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");

  allFarts.forEach(f => {
    if (f.likes === undefined) f.likes = 0;
    if (!f.type) f.type = "audio";
  });

  const topFarts = [...allFarts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  feed.innerHTML = "";

  topFarts.forEach((fart, index) => {
    const fartCard = document.createElement("div");
    fartCard.classList.add("fart-post");

    const uploader = users.find(u => u.username === fart.author);
    const pic = uploader?.profilePic || '';
    const profileHTML = pic
      ? `<img src="${pic}" alt="${fart.author}" style="width:60px;height:60px;border-radius:50%;margin-bottom:10px;">`
      : `<div style="width:60px;height:60px;border-radius:50%;background:#333;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:24px;">👤</div>`;

    const mediaHTML = fart.type === "video"
      ? `<video controls width="100%"><source src="${fart.file}" type="video/mp4"></video>`
      : `<audio controls><source src="${fart.file}" type="audio/mpeg"></audio>`;

    fartCard.innerHTML = `
      ${profileHTML}
      <h3>#${index + 1}: ${fart.title}</h3>
      <p><em>by ${fart.author}</em></p>
      <p>${fart.desc || "No description"}</p>
      ${mediaHTML}
      <p><strong>Smells:</strong> ${fart.likes}</p>
      <button onclick="smellFart('${fart.timestamp}')">👃 Smell</button>
    `;

    feed.appendChild(fartCard);
  });

  localStorage.setItem("fartspaceFarts", JSON.stringify(allFarts));
}

function smellFart(timestamp) {
  const allFarts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
  const fart = allFarts.find(f => f.timestamp === timestamp);
  if (fart) {
    fart.likes = (fart.likes || 0) + 1;
    localStorage.setItem("fartspaceFarts", JSON.stringify(allFarts));
    renderTopFarts();
  }
}

// 💬 Feedback handler
function handleFeedback(e) {
  e.preventDefault();
  const name = document.getElementById("feedback-name").value.trim() || "Anonymous";
  const text = document.getElementById("feedback-text").value.trim();
  if (!text) return;

  const feedbacks = JSON.parse(localStorage.getItem("fartFeedback") || "[]");
  feedbacks.push({ name, text, time: new Date().toISOString() });

  localStorage.setItem("fartFeedback", JSON.stringify(feedbacks));
  document.getElementById("feedback-form").reset();
  renderFeedback();
}

// 💬 Render existing feedback
function renderFeedback() {
  const feedbacks = JSON.parse(localStorage.getItem("fartFeedback") || "[]");
  const list = document.getElementById("feedback-list");
  list.innerHTML = "";

  if (feedbacks.length === 0) {
    list.innerHTML = "<li>No feedback yet.</li>";
    return;
  }

  feedbacks.slice().reverse().forEach(fb => {
    const li = document.createElement("li");
    li.style.marginBottom = "1rem";
    li.innerHTML = `
      <p><strong>${fb.name}</strong> <small style="color:#888;">(${new Date(fb.time).toLocaleString()})</small></p>
      <p style="background:#1a1a1a;padding:0.5rem;border-radius:8px;border:1px solid #333;">${fb.text}</p>
    `;
    list.appendChild(li);
  });
}

// 🏆 Render game leaderboard
function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("fartGameScores") || "[]");
  const board = document.getElementById("leaderboard-list");
  if (!board) return;
  board.innerHTML = "";

  const top5 = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  if (top5.length === 0) {
    board.innerHTML = "<li>No scores yet. Play the game and be first!</li>";
    return;
  }

  top5.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `#${index + 1} <strong>${entry.name}</strong>: ${entry.score} pts`;
    li.style.marginBottom = "0.5rem";
    board.appendChild(li);
  });
}
