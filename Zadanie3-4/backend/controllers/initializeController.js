import { StatusCodes } from 'http-status-codes';
import { Product } from '../models/product.js';
import csv from 'csv-parser';
import { Readable } from 'stream';
import {Category} from "../models/category.js";

export const initializeProducts = async (req, res) => {
    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                message: 'Database already contains products.'
            })
        }

        const file = req.file;

        if (!file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'No file uploaded. Please upload a valid file.'
            });
        }

        let products = [];

        if (file.mimetype === 'application/json') {
            products = JSON.parse(file.buffer.toString());
        } else if (file.mimetype === 'text/csv') {
            const csvData = file.buffer.toString();
            products = await parseCSV(csvData);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Unsupported file format. Use JSON or CSV.'
            })
        }

        const categories = await Category.find();

        const categoryMap = categories.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const updatedProducts = products.map(product => {
            if (categoryMap[product.category]) {
                product.category = categoryMap[product.category];
            }
            return product;
        });


        await Product.insertMany(updatedProducts);
        res.status(StatusCodes.OK).json({
            message: 'Successfully initialized products.'
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to initialize products.',
            error: err.message
        })
    }
}

const parseCSV = async (csvData) => {
    return new Promise((resolve, reject) => {
        const results = [];

        const stream = Readable.from(csvData);

        stream
            .pipe(csv())
            .on('data', (chunk) => results.push(chunk))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    })
}