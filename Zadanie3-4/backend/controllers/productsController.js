import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { generateSeoDescription } from "./groqController.js";

import { StatusCodes } from 'http-status-codes';
import { Types } from "mongoose";


export const getAllProducts = async (req, res) => {
    try {
        const productsList = await Product.find().populate('category', 'name');;
        res.status(StatusCodes.OK).json({
            products: productsList
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get all products.',
            error: err.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid product ID format.' });
        }

        const product = await Product.findOne({_id: id})

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
        }
        res.status(StatusCodes.OK).json({
            product: product
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to find product.',
            error: err.message
        });
    }
}

export const createProduct = async (req, res) => {
    try{
        const { name, description, unitPrice, unitWeight, category } = req.body;

        if (!Types.ObjectId.isValid(category)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid category ID format.' });
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Category not found.' });
        }

        const newProduct = new Product({
            name,
            description,
            unitPrice,
            unitWeight,
            category: existingCategory._id,
        });

        await newProduct.save();
        res.status(StatusCodes.CREATED).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (err) {
        if(err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((err) => err.message);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                errors: errors,
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to create new product',
            error: err.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, unitPrice, unitWeight, category } = req.body;

        if (category && !Types.ObjectId.isValid(category)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid category ID format.' });
        }

        let updatedCategory = null;
        if (category) {
            updatedCategory = await Category.findById(category);
            if (!updatedCategory) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found.' });
            }
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found.' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.unitPrice = unitPrice || product.unitPrice;
        product.unitWeight = unitWeight || product.unitWeight;
        product.category = updatedCategory ? updatedCategory._id : product.category;

        await product.save();

        res.status(StatusCodes.OK).json({
            message: 'Product updated successfully',
            product: product
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                errors: errors
            });
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to update product',
            error: err.message
        });
    }
}




export const getSeoDescriptionForProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid product ID format.' });
        }

        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found' });
        }

        
        const seoDescription = await generateSeoDescription(product);
        
        res.status(StatusCodes.OK).json({
            seoDescription: seoDescription
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to generate SEO description.',
            error: err.message
        });
    }
};


