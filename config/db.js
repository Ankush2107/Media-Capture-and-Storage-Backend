// gRqlVDxRpxuByns6
// mongodb+srv://ankushkumar210701:gRqlVDxRpxuByns6@cluster0.ic4eh.mongodb.net/
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB...");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;