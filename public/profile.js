document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("fartCurrentUser");
    const isLoggedIn = localStorage.getItem("fartLoggedIn") === "true";
  
    if (!currentUser || !isLoggedIn) {
      alert("You must be logged in to view your profile.");
      window.location.href = "login.html";
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");
    const current = users.find(u => u.username === currentUser);
    const infoDiv = document.getElementById("profile-info");
  
    // ✅ Render profile info
    infoDiv.innerHTML = `
      <h2>Welcome, <strong>${current.username}</strong>!</h2>
      <p>Member since: ${new Date(current.created).toDateString()}</p>
    `;
  
    if (current.profilePic) {
      const img = document.createElement("img");
      img.src = current.profilePic;
      img.alt = "Profile Pic";
      img.style.maxWidth = "150px";
      img.style.borderRadius = "12px";
      infoDiv.appendChild(img);
    }
  
    // ✅ Handle profile picture upload
    const fileInput = document.getElementById("pic-upload");
    const preview = document.getElementById("profile-preview");
  
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file || !file.type.startsWith("image/")) return;
  
      const reader = new FileReader();
      reader.onload = function () {
        const base64 = reader.result;
  
        const users = JSON.parse(localStorage.getItem("fartUsers") || "[]");
        const index = users.findIndex(u => u.username === currentUser);
        users[index].profilePic = base64;
        localStorage.setItem("fartUsers", JSON.stringify(users));
  
        preview.src = base64;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  
    // ✅ Render user's uploaded farts
    const allFarts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
    const userFarts = allFarts.filter(f => f.author === currentUser);
    const fartList = document.getElementById("user-fart-list");
    const fartCount = document.getElementById("fart-count");
  
    fartCount.innerHTML = `<strong>Total Uploads:</strong> ${userFarts.length}`;
  
    if (userFarts.length === 0) {
      fartList.innerHTML = `<p>You haven't uploaded any farts yet...</p>`;
    } else {
      userFarts.forEach((fart, index) => {
        const container = document.createElement("div");
        container.classList.add("fart-post");
        container.innerHTML = `
          <h4>${fart.title}</h4>
          <p>${fart.desc || "No description"}</p>
          ${fart.type === "video"
            ? `<video controls width="100%"><source src="${fart.file}" type="video/mp4"></video>`
            : `<audio controls width="100%"><source src="${fart.file}" type="audio/mpeg"></audio>`
          }
          <p class="timestamp">Uploaded: ${new Date(fart.timestamp).toLocaleString()}</p>
        `;
        fartList.appendChild(container);
      });
    }
  
    // ✅ Logout button support if needed
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("fartLoggedIn");
        localStorage.removeItem("fartCurrentUser");
        alert("Logged out.");
        window.location.href = "index.html";
      });
    }
  });
  