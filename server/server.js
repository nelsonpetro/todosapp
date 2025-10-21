import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import todosRouter from "./routes/todos.js";
import sessionMiddleware from "./middleware/session.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500', // Use exact origin
  credentials: true
}));
app.use(express.json());
app.use(sessionMiddleware);

// Serve static files from client directory
app.use(express.static('client'));

// API routes
app.use("/api/users", authRouter);
app.use("/api/todos", todosRouter);

// Check DB status
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ 
      status: 'success',
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});