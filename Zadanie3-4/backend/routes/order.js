import express from "express";
const router = express.Router();
import {
    createOrder,
    getAllOrders,
    getOrdersByUsername,
    getOrderById,
    getOrdersByStatusId,
    updateOrder,
    addOpinion
} from "../controllers/orderController.js";

router.get('/', getAllOrders)
router.post('/', createOrder);
router.get('/user/:username', getOrdersByUsername)
router.get('/:id', getOrderById)
router.get('/status/:id', getOrdersByStatusId)
router.put('/:id', updateOrder)
router.post('/:id/opinions', addOpinion);

export default router;