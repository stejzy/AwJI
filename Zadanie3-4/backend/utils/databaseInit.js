import { Category } from "../models/category.js";
import { OrderStatus } from "../models/orderStatus.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

const predefinedCategories = ['Electronics', 'Books', 'Clothing', 'Home Appliances'];
const predefinedStatuses = ['UNAPPROVED', 'APPROVED', 'CANCELLED', 'FULFILLED'];
const predifinedUsers = [
    {
        username: 'user',
        password: 'user',
        role: 'KLIENT'
    },
    {
        username: 'admin',
        password: 'admin',
        role: 'PRACOWNIK'
    }
];

export async function initializeDatabase() {
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

        for (const userData of predifinedUsers) {
            const existingUser = await User.findOne({ username: userData.username});
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.create({
                    username: userData.username,
                    password: hashedPassword,
                    role: userData.role
                });
                console.log(`Added user: ${userData.username} with role ${userData.role}`);
            }
        }

        console.log('Database initialized with default data.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}