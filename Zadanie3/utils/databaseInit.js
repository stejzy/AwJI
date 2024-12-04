const { Category } = require('../models/category');
const { OrderStatus } = require('../models/orderStatus');

const predefinedCategories = ['Electronics', 'Books', 'Clothing', 'Home Appliances'];
const predefinedStatuses = ['UNAPPROVED', 'APPROVED', 'CANCELLED', 'FULFILLED'];

async function initializeDatabase() {
    try {
        for (const categoryName of predefinedCategories) {
            const existingCategory = await Category.findOne({ name: categoryName });
            if (!existingCategory) {
                await Category.create({ name: categoryName });
                console.log(`Added category: ${categoryName}`);
            }
        }

        for (const statusName of predefinedStatuses) {
            const existingStatus = await OrderStatus.findOne({ name: statusName });
            if (!existingStatus) {
                await OrderStatus.create({ name: statusName });
                console.log(`Added order status: ${statusName}`);
            }
        }

        console.log('Database initialized with default data.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

module.exports = initializeDatabase;