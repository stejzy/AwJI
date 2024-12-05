import { Category } from "../models/category.js";
import { StatusCodes } from 'http-status-codes';

export const getAllCategories = async (req, res) => {
    try {
        const categoriesList = await Category.find();
        res.status(StatusCodes.OK).json({
            categories: categoriesList
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get all categories.',
            error: err.message,
        });
    }
};