import express from "express";
const router = express.Router();
import {
    createOrder,
    getAllOrders,
    getOrdersByUsername,
    getOrderById,
    getOrdersByStatusName,
    updateOrder,
    addOpinion
} from "../controllers/orderController.js";

router.get('/', getAllOrders)
router.post('/', createOrder);
router.get('/user/:username', getOrdersByUsername)
router.get('/:id', getOrderById)
router.get('/status/:name', getOrdersByStatusName)
router.patch('/:id', updateOrder)
router.post('/:id/opinions', addOpinion);

export default router;