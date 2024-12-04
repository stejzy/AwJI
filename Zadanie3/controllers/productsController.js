const {Product} = require("../models/product");

const getAllProducts = async (req, res) => {
    try {
        const productsList = await Product.find();
        res.status(200).json(productsList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getAllProducts };