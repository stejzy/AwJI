import express from "express";
const router = express.Router();
import { login, register, refreshToken } from "../controllers/authController.js";

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refreshToken)

export default router;