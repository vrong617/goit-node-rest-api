import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
} from "../controllers/authController.js";
import validateBody from "../middleware/validateBody.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrent);

export default router;
