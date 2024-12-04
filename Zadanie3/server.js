require('dotenv').config();

const databaseInit = require("./utils/databaseInit");
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
    console.log('Connected to MongoDB');
    await databaseInit();
})
    .catch(async (err) => {
    console.error(err);
});

const router = require('./routes');
app.use(express.json());
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
app.use('/products', productsRouter)
app.use('/categories', categoriesRouter);
app.use('/', router);

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close(); // Close MongoDB connection
    console.log('MongoDB connection closed');
    process.exit(0); // Exit process
});

app.listen(port, () => console.log(`Server running on port ${port}`));