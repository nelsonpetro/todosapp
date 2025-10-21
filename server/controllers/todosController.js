import pool from "../db.js";
import { APIError } from "../middleware/errorHandler.js";

// Create todo
export const createTodo = async (req, res, next) => {
  try {
    console.log('CreateTodo called');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Body:', req.body);
    
    const user_id = req.session.userId;
    const { title } = req.body;

    console.log('User ID:', user_id);
    console.log('Title:', title);

    // Sanitize the title
    const sanitizedTitle = title.trim().replace(/<[^>]*>/g, '');

    console.log('Sanitized title:', sanitizedTitle);

    const result = await pool.query(
      "INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *",
      [user_id, sanitizedTitle]
    );

    console.log('Query result:', result.rows[0]);

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('CreateTodo error:', err);
    next(new APIError(500, 'Failed to create todo', err.message));
  }
};

// Get all todos
export const getAllTodos = async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    next(new APIError(500, 'Failed to fetch todos', err.message));
  }
};

// Update todo
export const updateTodo = async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const { id } = req.params;
    const { title } = req.body;

    const sanitizedTitle = title.trim().replace(/<[^>]*>/g, '');

    const result = await pool.query(
      "UPDATE todos SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [sanitizedTitle, id, user_id]
    );

    if (result.rows.length === 0) {
      throw new APIError(404, 'Todo not found or not authorized');
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    if (err instanceof APIError) {
      next(err);
    } else {
      next(new APIError(500, 'Failed to update todo', err.message));
    }
  }
};

// Toggle todo completion
export const toggleTodo = async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [completed, id, user_id]
    );

    if (result.rows.length === 0) {
      throw new APIError(404, 'Todo not found or not authorized');
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    if (err instanceof APIError) {
      next(err);
    } else {
      next(new APIError(500, 'Failed to update todo status', err.message));
    }
  }
};

// Delete todo
export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.session.userId;

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      throw new APIError(404, 'Todo not found or not authorized');
    }

    res.json({
      status: 'success',
      message: 'Todo deleted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    if (err instanceof APIError) {
      next(err);
    } else {
      next(new APIError(500, 'Failed to delete todo', err.message));
    }
  }
};