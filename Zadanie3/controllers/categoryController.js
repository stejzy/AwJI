const {Category} = require("../models/category");

const getAllCategories = async (req, res) => {
    try {
        const categoriesList = await Category.find();
        res.status(200).json(categoriesList);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getAllCategories };