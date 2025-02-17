import { Order } from "../models/order.js";
import { StatusCodes } from 'http-status-codes';
import { Product } from '../models/product.js';
import { OrderStatus } from '../models/orderStatus.js';
import {getUsernameById} from "./userController.js"
import {Types} from "mongoose";


export const getAllOrders = async (req, res) => {
    try {
        const ordersList = await Order.find()
            .populate('orderStatus', 'name')
            .populate('orderedItems.product', 'name');
        res.status(StatusCodes.OK).json({
            orders: ordersList
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get all orders.',
            error: err.message,
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { username, email, phoneNumber, products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Products list cannot be empty.' });
        }

        const orderedItems = [];

        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];

            if (!Types.ObjectId.isValid(productId)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid product ID format ${productId}.` });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `Product with ID ${productId} not found.` });
            }

            if (quantity <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `Quantity for product ${productId} must be greater than 0.` });
            }

            orderedItems.push({
                product: productId,
                quantity,
                priceAtOrder: product.unitPrice,
            });
        }

        const orderStatus = await OrderStatus.findOne({ name: 'UNAPPROVED' });
        const newOrder = new Order({
            username,
            email,
            phoneNumber,
            orderedItems,
            orderStatus: orderStatus._id,
        });

        await newOrder.save();
        res.status(StatusCodes.CREATED).json({ message: 'Order created successfully', order: newOrder });

    } catch (err) {
        if(err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((err) => err.message);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                errors: errors,
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to create new order',
            error: err.message,
        });
    }
};

export const getOrdersByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const orders = await Order.find({ username: username })
            .populate('orderStatus', 'name')
            .populate('orderedItems.product', 'name');

        if (orders.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No orders found for this user.' });
        }

        res.status(StatusCodes.OK).json({
            orders: orders
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to retrieve orders.',
            error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid order ID format.' });
        }

        const order = await Order.findOne({_id: id})

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' });
        }
        res.status(StatusCodes.OK).json({
            order: order
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to find order.',
            error: err.message
        });
    }
}

export const getOrdersByStatusName = async (req, res) => {
    try {
        const { name } = req.params;

        const orderStatus = await OrderStatus.findOne({name: name});

        const orders = await Order.find({ orderStatus: orderStatus._id }).populate('orderedItems.product orderStatus');

        if (orders.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No orders found for this status' });
        }

        res.status(StatusCodes.OK).json({
            orders: orders
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to fetch orders by status',
            error: err.message
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusName, username, email, phoneNumber, orderedItems } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid order ID format.' });
        }

        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Order with ID ${id} not found.` });
        }

        if (statusName) {
            const orderStatus = await OrderStatus.findOne({name: statusName});

            const newStatus = await OrderStatus.findOne({ _id: orderStatus._id });
            if (!newStatus) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `Order status '${orderStatus}' not found.` });
            }

            const allowedStatusTransitions = {
                UNAPPROVED: ['APPROVED', 'CANCELLED'],
                APPROVED: ['FULFILLED', 'CANCELLED'],
                FULFILLED: [],
                CANCELLED: []
            };

            const currentStatusName = await OrderStatus.findById(existingOrder.orderStatus).then(status => status.name);

            if (!allowedStatusTransitions[currentStatusName].includes(newStatus.name)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: `Cannot change status from '${currentStatusName}' to '${newStatus.name}'.`
                });
            }

            existingOrder.orderStatus = newStatus._id;
        }

        if (username) existingOrder.username = username;
        if (email) existingOrder.email = email;
        if (phoneNumber) existingOrder.phoneNumber = phoneNumber;

        if (orderedItems && orderedItems.length > 0) {
            const updatedItems = [];
            for (const item of orderedItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: `Product with ID ${item.product} not found.`
                    });
                }
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: `Invalid quantity for product ${item.product}.`
                    });
                }

                updatedItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtOrder: product.unitPrice
                });
            }
            existingOrder.orderedItems = updatedItems;
        }

        existingOrder.approvalDate = new Date();
        await existingOrder.save();

        res.status(StatusCodes.OK).json({ message: 'Order updated successfully.', order: existingOrder });
    } catch (err) {
        if(err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((err) => err.message);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation error',
                errors: errors,
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update order.', details: err.message });
    }
};



export const addOpinion = async (req, res) => {
    const { id } = req.params;  // Id zamówienia
    const { rating, comment } = req.body;  // Ocena i treść opinii

    try {
        // Sprawdzamy, czy id zamówienia jest poprawne
        if (!Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid order ID format.' });
        }

        // Pobieramy zamówienie z bazy danych
        const order = await Order.findById(id);

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found.' });
        }

        // Sprawdzamy, czy status zamówienia umożliwia dodanie opinii
        const orderStatus = await OrderStatus.findById(order.orderStatus);
        if (orderStatus.name !== 'FULFILLED' && orderStatus.name !== 'CANCELLED') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'You can only add opinions to orders with status "FULFILLED" or "CANCELLED".'
            });
        }

        const username = await getUsernameById(req.user.id);

        // Sprawdzamy, czy użytkownik jest właścicielem zamówienia
        if (order.username !== username) {
            console.log(order.username)
            console.log(req.user.username)
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'You can only add opinions to your own orders.' });
        }

        // Tworzymy nową opinię
        const newOpinion = {
            rating,
            comment
        };

        // Dodajemy opinię do zamówienia
        order.opinions.push(newOpinion);
        await order.save();

        res.status(StatusCodes.CREATED).json({
            message: 'Opinion added successfully.',
            opinion: newOpinion
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error adding opinion.',
            error: err.message
        });
    }
};