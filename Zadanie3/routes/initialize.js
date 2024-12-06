import express from "express";
import multer from 'multer';
import { initializeProducts } from "../controllers/initializeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/init', upload.single('file'), authenticateToken(true), initializeProducts);

export default router;