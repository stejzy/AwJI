const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Please enter a valid unit price.',
        },
    },
    unitWeight: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Please enter a valid unit weight.',
        },
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category', required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };