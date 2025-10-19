import express from "express";
import pool from "../db.js";
import requireLogin from "../middleware/auth.js";

const router = express.Router();
router.use(requireLogin);

// POST Create Todo
router.post("/", async (req, res) => {
  try {
    //const { user_id, title } = req.body;
    const user_id = req.session.userId;
    const { title } = req.body;

    const result = await pool.query(
      "INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *",
      [user_id, title]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET Get all Todos (for a specific user)
router.get("/:user_id", async (req, res) => {
  try {
    const user_id = req.session.userId;

    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT Update Todo
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.session.userId;
    const { id } = req.params;
    const { title } = req.body;

    const result = await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [title, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found or not yours" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PATCH Toggle completed
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE Delete todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted", todo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;