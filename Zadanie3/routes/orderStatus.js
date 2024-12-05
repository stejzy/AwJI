import express from "express";
const router = express.Router();
import { getAllOrderStatuses } from "../controllers/orderStatusController.js";

router.get('/', getAllOrderStatuses)

export default router;