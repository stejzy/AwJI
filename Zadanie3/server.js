require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to DB'));

const router = require('./routes');
app.use(express.json());
app.use('/', router);
app.listen(port, () => console.log(`Server running on port ${port}`));