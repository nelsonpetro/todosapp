import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();


// POST: Register
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, name, email",
      [username, name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// POST: Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Save user ID in session
    req.session.userId = user.id;

    res.json({ message: "Logged in successfully", user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// POST: Logout
router.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Could not log out" });
    }
    // Optional: clear the cookie in the browser
    res.clearCookie("connect.sid");

    res.json({ message: "Logged out successfully" });
  });
});

export default router;

