import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/usersController.js";
// Add validation imports here once we create them

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

export default router;

