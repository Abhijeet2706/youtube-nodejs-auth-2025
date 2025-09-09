require("dotenv").config();


const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully")
    } catch (err) {
        console.log("Connection failed", err)
        process.exit(1)
    }
};

module.exports = {
    connectToDB
}