import pool from "../db.js";
import bcrypt from "bcrypt";
import { APIError } from "../middleware/errorHandler.js";

// Register new user
export const register = async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, name, email",
      [username, name, email, hashedPassword]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    // Check for unique constraint violations
    if (err.code === '23505') { // PostgreSQL unique violation code
      if (err.constraint === 'users_email_key') {
        next(new APIError(400, 'Email already registered'));
      } else if (err.constraint === 'users_username_key') {
        next(new APIError(400, 'Username already taken'));
      }
    } else {
      next(new APIError(500, 'Failed to register user', err.message));
    }
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    console.log('Login called');
    console.log('Body:', req.body);
    const { username, password } = req.body;

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    console.log('User found:', result.rows.length > 0);

    if (result.rows.length === 0) {
      throw new APIError(401, 'Invalid username or password');
    }

    const user = result.rows[0];
    console.log('User:', user.id, user.username);

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    if (!match) {
      throw new APIError(401, 'Invalid username or password');
    }

    // Save user ID in session
    console.log('Setting session userId to:', user.id);
    req.session.userId = user.id;
    console.log('Session after setting userId:', req.session);

    // Explicitly save the session
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return next(new APIError(500, 'Session save failed', err.message));
      }
      
      console.log('Session saved successfully');
      console.log('Session ID:', req.sessionID);
      
      res.json({
        status: 'success',
        data: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email
        }
      });
    });
  } catch (err) {
    if (err instanceof APIError) {
      next(err);
    } else {
      next(new APIError(500, 'Login failed', err.message));
    }
  }
};

// Logout user
export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new APIError(500, 'Could not log out', err.message));
    }
    
    res.clearCookie("connect.sid");
    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  });
};

// Get current user (optional, useful for frontend)
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.json({
        status: 'success',
        data: null
      });
    }

    const result = await pool.query(
      "SELECT id, username, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new APIError(404, 'User not found');
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    next(new APIError(500, 'Failed to fetch user', err.message));
  }
};