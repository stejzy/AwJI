import express from "express";
const router = express.Router();
import { getAllProducts, createProduct, updateProduct } from "../controllers/productsController.js";
import { getProductById } from "../controllers/productsController.js";
import { getSeoDescriptionForProduct } from '../controllers/productsController.js';

router.get('/', getAllProducts)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.get('/:id', getProductById)
router.get('/:id/seo-description', getSeoDescriptionForProduct)

export default router;