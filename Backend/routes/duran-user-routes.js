import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyToken,
} from "../controller/duranUserController.js";
import { authenticate } from "../middleware/login-middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/verifyToken", verifyToken);
router.get("/profile", authenticate, (req, res) => {
  res.json(req.user);
});

export default router;
