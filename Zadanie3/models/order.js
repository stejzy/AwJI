const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const phoneRegex = /^[0-9]{9,15}$/;

const orderSchema = new Schema({
    approvalDate: {
        type: Date,
        default: null,
    },
    orderStatus: {
        type: Schema.Types.ObjectId,
        ref: 'OrderStatus',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [emailRegex, 'Please enter a valid email address.'],
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [phoneRegex, 'Please enter a valid phone number.'],
    },
    orderedItems: [
        {
            product: {
                type: Schema.Types.ObjectId, ref: 'Product', required: true,
            },
            quantity: {
                type: Number,
                required: true,
                validate: {
                    validator: function (value) {
                        return Number.isInteger(value) && value > 0;
                    },
                    message: 'Please enter a valid quantity.',
                },
            },
            priceAtOrder: {
                type: Number,
                required: true,
            },
        }
    ]
})

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };