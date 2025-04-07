import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/duranTodoController.js";
import { authenticate } from "../middleware/login-middleware.js";

const router = express.Router();

router.get("/", authenticate, getAllTasks);
router.get("/:id", authenticate, getTaskById);
router.post("/", authenticate, createTask);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;
