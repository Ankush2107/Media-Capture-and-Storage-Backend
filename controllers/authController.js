const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ 
            success: true,
            token: token,
            message: "User registered successfully",
            error: "" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ 
            success: false,
            message: "Invalid credentials" 
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ 
            success: false,
            message: "Invalid credentials" 
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true }); 
        res.status(200).json({ 
            success: true,
            token: token,
            user: { id: user._id, email: user.email },
            message: "User logged in successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            ssuccess: false,
            message: error.message || "Something went wrong"
        });
    }
};

module.exports = {
    register,
    login
};