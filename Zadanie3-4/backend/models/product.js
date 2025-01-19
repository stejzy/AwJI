import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [1, 'Product name cannot be blank'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [1, 'Product description cannot be blank'],
    },
    unitPrice: {
        type: Number,
        required: [true, 'Product unit price is required'],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Unit price must be greater than 0.',
        },
    },
    unitWeight: {
        type: Number,
        required: [true, 'Product unit weight is required'],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Unit weight must be greater than 0.',
        },
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    }
})

export const Product = mongoose.model('Product', productSchema);