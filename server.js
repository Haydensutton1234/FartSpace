const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");

// ✅ Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Your frontend folder

// ✅ Make sure users.json exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]", "utf8");
}

// ✅ Read and write user data
const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));
const writeUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// 🟢 REGISTER
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ error: "Username already exists." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    created: new Date().toISOString(),
    ip,
    profilePic: null // Default empty
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully." });
});

// 🟢 LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  res.status(200).json({
    message: "Login successful.",
    username: user.username
    // 🔐 Future: Send JWT or session token
  });
});

// 🟢 List Users (for testing/admin/debug only)
app.get("/api/users", (req, res) => {
  const users = readUsers().map((u) => ({
    username: u.username,
    created: u.created,
    ip: u.ip
  }));
  res.json(users);
});

// 🛑 Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`Fartspace backend running on http://localhost:${PORT}`);
});
