document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("upload-form");
    const status = document.getElementById("upload-status");
  
    if (!form || !status) return;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const title = document.getElementById("fart-title").value.trim();
      const desc = document.getElementById("fart-desc").value.trim();
      const audioFile = document.getElementById("fart-audio").files[0];
      const videoFile = document.getElementById("fart-video").files[0];
      const user = localStorage.getItem("fartCurrentUser") || "Anonymous";
  
      if (!audioFile && !videoFile) {
        status.innerText = "❌ You need to upload an audio or video file.";
        return;
      }
  
      const fileToRead = videoFile || audioFile;
      const isVideo = !!videoFile;
      const reader = new FileReader();
  
      reader.onload = function () {
        const fart = {
          title,
          desc,
          author: user,
          timestamp: new Date().toISOString(),
          audio: undefined,
          video: undefined,
          file: reader.result,
          type: isVideo ? "video" : "audio",
          likes: 0
        };
  
        const farts = JSON.parse(localStorage.getItem("fartspaceFarts") || "[]");
        farts.push(fart);
        localStorage.setItem("fartspaceFarts", JSON.stringify(farts));
  
        status.innerText = `✅ Fart "${title}" uploaded successfully!`;
        form.reset();
      };
  
      reader.onerror = function () {
        status.innerText = "❌ Error reading the file.";
      };
  
      reader.readAsDataURL(fileToRead);
    });
  });
  