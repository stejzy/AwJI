import mongoose from "mongoose";
const { Schema } = mongoose;

const orderStatusSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Order status name is required'],
        unique: true,
    }
})

export const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);