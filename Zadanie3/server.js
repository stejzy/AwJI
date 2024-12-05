import dotenv from "dotenv";
dotenv.config();

import {initializeDatabase} from "./utils/databaseInit.js"
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
    console.log('Connected to MongoDB');
    await initializeDatabase();
})
    .catch(async (err) => {
    console.error(err);
});


app.use(express.json());
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import orderStatusesRouter from "./routes/orderStatus.js";
import orderRouter from "./routes/order.js";
app.use('/products', productsRouter)
app.use('/categories', categoriesRouter);
app.use('/status', orderStatusesRouter);
app.use('/orders', orderRouter);


process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

app.listen(port, () => console.log(`Server running on port ${port}`));