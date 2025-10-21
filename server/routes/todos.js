import express from "express";
import requireLogin from "../middleware/users.js";
import { todoValidationRules, todoIdValidationRules, toggleCompletionRules, validateRequest } from "../middleware/validators.js";
import { createTodo, getAllTodos, updateTodo, toggleTodo, deleteTodo } from "../controllers/todosController.js";

const router = express.Router();
router.use(requireLogin);

// Routes
router.post("/", todoValidationRules, validateRequest, createTodo);
router.get("/", getAllTodos);
router.put("/:id", todoIdValidationRules, todoValidationRules, validateRequest, updateTodo);
router.patch("/:id/complete", todoIdValidationRules, toggleCompletionRules, validateRequest, toggleTodo);
router.delete("/:id", todoIdValidationRules, validateRequest, deleteTodo);

export default router;