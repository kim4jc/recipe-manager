const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            autoIndex: true,
        });
        console.log("Connected to MongoDB via Mongoose!");
    } catch (err) {
        console.error("Failed to connect to DB:", err);
        throw err;
    }
}

module.exports = connectToDB;