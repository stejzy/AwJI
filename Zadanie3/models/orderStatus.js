const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderStatusSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
})

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);

module.exports = { OrderStatus };