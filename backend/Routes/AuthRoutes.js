const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
// require("dotenv").config();
// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, phone_number, location } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(req.body)
    const newUser = new User({ name, email, password: hashedPassword, phone_number, location });

    // await newUser.save();
    res.status(201).json({ message: "You Are registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});


module.exports = router;