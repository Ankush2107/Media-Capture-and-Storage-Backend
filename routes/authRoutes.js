const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { check } = require('express-validator');

router.post(
    "/register",
    [
      check("email", "Valid email required").isEmail(),
      check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    ],
    register
);

router.post("/login", login);  
 
module.exports = router;