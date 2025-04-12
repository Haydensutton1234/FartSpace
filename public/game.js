const fart = document.getElementById("fart");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best-score");
const startBtn = document.getElementById("start-button");

let score = 0;
let timeLeft = 30;
let gameInterval, timerInterval;

fart.style.display = "none";
bestEl.textContent = localStorage.getItem("fartGameBest") || 0;

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  fart.style.display = "block";
  moveFart();

  gameInterval = setInterval(() => moveFart(), 800);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function moveFart() {
  const area = document.getElementById("game-area");
  const maxX = area.clientWidth - 50;
  const maxY = area.clientHeight - 50;
  fart.style.left = Math.random() * maxX + "px";
  fart.style.top = Math.random() * maxY + "px";
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  fart.style.display = "none";

  const name = localStorage.getItem("fartCurrentUser") || "Anonymous";
  const leaderboard = JSON.parse(localStorage.getItem("fartGameScores") || "[]");

  leaderboard.push({
    name,
    score,
    time: new Date().toISOString()
  });

  localStorage.setItem("fartGameScores", JSON.stringify(leaderboard));

  const best = parseInt(localStorage.getItem("fartGameBest") || "0");
  if (score > best) {
    localStorage.setItem("fartGameBest", score);
    bestEl.textContent = score;
    alert("💥 New High Score!");
  } else {
    alert("Game Over! Your score: " + score);
  }
}

fart.onclick = () => {
  score++;
  scoreEl.textContent = score;
  moveFart();
};

startBtn.addEventListener("click", startGame);
