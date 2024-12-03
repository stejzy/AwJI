const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    unitWeight: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category', required: true
    }
})

module.exports = mongoose.model('Product', productSchema);