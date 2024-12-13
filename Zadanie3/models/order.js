import mongoose from "mongoose";
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
        required: [true, 'Order status name is required'],
    },
    username: {
        type: String,
        required: [true, 'Username cannot be empty'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [emailRegex, 'Please enter a valid email address.'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [phoneRegex, 'Please enter a valid phone number.'],
    },
    orderedItems: [
        {
            product: {
                type: Schema.Types.ObjectId, ref: 'Product', required: true,
            },
            quantity: {
                type: Number,
                required: [true, 'Product quantity is required'],
                validate: {
                    validator: function (value) {
                        return Number.isInteger(value) && value > 0;
                    },
                    message: 'Quantity must be an integer greater than 0.',
                },
            },
            priceAtOrder: {
                type: Number,
                required: true,
            },
        }
    ],
    opinions: [
        {
            rating: {
                type: Number,
                required: [true, 'Rating is required'],
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: [true, 'Comment is required'],
                minlength: 5,
                maxlength: 500
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

export const Order = mongoose.model('Order', orderSchema);