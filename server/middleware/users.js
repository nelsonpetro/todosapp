import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/usersController.js";
import { registerValidationRules, loginValidationRules, validateRequest } from "./validators.js";

const router = express.Router();

// Auth routes with validation
router.post("/register", registerValidationRules, validateRequest, register);
router.post("/login", loginValidationRules, validateRequest, login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

export default router;