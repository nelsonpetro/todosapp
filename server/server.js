import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import todosRouter from "./routes/todos.js";
import sessionMiddleware from "./middleware/session.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);

// Check DB status
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Todos route
app.use("/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});