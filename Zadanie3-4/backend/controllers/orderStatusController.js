import { OrderStatus } from "../models/orderStatus.js";
import { StatusCodes } from 'http-status-codes';

export const getAllOrderStatuses = async (req, res) => {
    try {
        const orderStatusList = await OrderStatus.find();
        res.status(StatusCodes.OK).json({
            orderStatuses: orderStatusList
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get all order statuses.',
            error: err.message,
        });
    }
};