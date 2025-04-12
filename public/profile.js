const greeting = document.getElementById("profile-info");
const fartList = document.getElementById("user-fart-list");
const fartCount = document.getElementById("fart-count");
const picPreview = document.getElementById("profile-preview");
const uploadInput = document.getElementById("pic-upload");

const currentUser = localStorage.getItem("fartCurrentUser");
const isLoggedIn = localStorage.getItem("fartLoggedIn") === "true";

if (!isLoggedIn || !currentUser) {
  greeting.innerHTML = "<p>You’re not logged in. <a href='login.html'>Login</a></p>";
} else {
  const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");
  const farts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");

  const current = users.find(u => u.username === currentUser);

  if (current) {
    greeting.innerHTML = `<h2>👋 Welcome, ${currentUser}</h2>`;
    if (current.profilePic) {
      const pic = document.createElement("img");
      pic.src = current.profilePic;
      pic.style.maxWidth = "150px";
      pic.style.borderRadius = "12px";
      greeting.appendChild(pic);
    }
  }

  const myFarts = farts.filter(f => f.author === currentUser);
  fartCount.innerText = `${myFarts.length} farts uploaded`;

  myFarts.forEach(fart => {
    const div = document.createElement("div");
    div.classList.add("fart-post");

    const mediaHTML = fart.type === "video"
      ? `<video controls width="100%"><source src="${fart.file}" type="video/mp4"></video>`
      : `<audio controls><source src="${fart.file}" type="audio/mpeg"></audio>`;

    div.innerHTML = `
      <h4>${fart.title}</h4>
      <p>${fart.desc || ""}</p>
      ${mediaHTML}
      <p>Smells: ${fart.likes}</p>
    `;

    fartList.appendChild(div);
  });
}

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result;

    const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");
    const index = users.findIndex(u => u.username === currentUser);
    if (index !== -1) {
      users[index].profilePic = base64;
      localStorage.setItem("fartUsers", JSON.stringify(users));
      picPreview.src = base64;
      picPreview.style.display = "block";
    }
  };
  reader.readAsDataURL(file);
});

function logout() {
  localStorage.removeItem("fartLoggedIn");
  localStorage.removeItem("fartCurrentUser");
  alert("Logged out!");
  window.location.href = "index.html";
}
