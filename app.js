document.addEventListener("DOMContentLoaded", () => {
    renderTopFarts();
  });
  
  function renderTopFarts() {
    const feed = document.getElementById("fart-feed");
    if (!feed) return;
  
    const allFarts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
  
    // Ensure every fart has a likes field
    allFarts.forEach(fart => {
      if (fart.likes === undefined) fart.likes = 0;
    });
  
    // Sort by likes, descending
    const topFarts = allFarts.sort((a, b) => b.likes - a.likes).slice(0, 3);
  
    feed.innerHTML = "";
  
    topFarts.forEach((fart, index) => {
      const fartCard = document.createElement("div");
      fartCard.classList.add("fart-post");
  
      fartCard.innerHTML = `
        <h3>#${index + 1}: ${fart.title}</h3>
        <p>${fart.desc || "No description provided"}</p>
        <audio controls>
          <source src="${fart.audio}" type="audio/mpeg">
          Your browser cannot handle this thunder.
        </audio>
        <p><strong>Likes:</strong> ${fart.likes}</p>
        <button onclick="likeFart('${fart.timestamp}')">👍 Like</button>
      `;
  
      feed.appendChild(fartCard);
    });
  
    localStorage.setItem("fartspaceFarts", JSON.stringify(allFarts));
  }
  
  function likeFart(timestamp) {
    const allFarts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
    const fart = allFarts.find(f => f.timestamp === timestamp);
    if (fart) {
      fart.likes = (fart.likes || 0) + 1;
      localStorage.setItem("fartspaceFarts", JSON.stringify(allFarts));
      renderTopFarts();
    }
  }
  
const featured = farts[0];

function createFartPost(fart) {
    const post = document.createElement('div');
    post.className = 'fart-post';
    post.innerHTML = `
        <h3>"${fart.title}" by <em>${fart.author}</em></h3>
        <audio controls>
            <source src="${fart.file}" type="audio/mpeg">
            Your browser can’t handle this thunder.
        </audio>
        <div class="fart-tags">
            ${fart.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        <div class="reactions">
            <button onclick="react(${fart.id}, 'sniff')">Sniff 💨 (${fart.sniffCount})</button>
            <button onclick="react(${fart.id}, 'choke')">Choke 🤢 (${fart.chokeCount})</button>
        </div>
    `;
    return post;
}

function renderFartFeed() {
    const feed = document.getElementById('fart-feed');
    feed.innerHTML = "";
    farts.forEach(fart => {
        feed.appendChild(createFartPost(fart));
    });
}

function renderFeaturedFart() {
    const container = document.getElementById('featured-fart');
    container.innerHTML = "";
    container.appendChild(createFartPost(featured));
}

function react(id, type) {
    const fart = farts.find(f => f.id === id);
    if (!fart) return;
    if (type === 'sniff') fart.sniffCount++;
    else if (type === 'choke') fart.chokeCount++;
    renderFartFeed();
    renderFeaturedFart();
}

document.addEventListener('DOMContentLoaded', () => {
    renderFartFeed();
    renderFeaturedFart();
});
