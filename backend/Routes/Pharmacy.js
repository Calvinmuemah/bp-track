const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pharmacy = require("../Models/Pharmacy");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 🔹 Pharmacy Registration
router.post("/reg", async (req, res) => {
  const { username, email, password, phone_number, location } = req.body;
  
  try {
    const existingPharmacy = await Pharmacy.findOne({ email });
    if (existingPharmacy) return res.status(400).json({ message: "Pharmacy already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPharmacy = new Pharmacy({ username, email, password: hashedPassword, phone_number, location });

    await newPharmacy.save();
    res.status(201).json({ message: "Pharmacy registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Pharmacy.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" }); // 👈 Fix: Proper error message
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" }); // 👈 Fix: Proper error message
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ access_token: token, vetId: user._id });
  } catch (error) {
    console.error("Login error:", error); // 👈 Add this for debugging
    res.status(500).json({ error: error.message });
  }
});



// 🔹 Forgot Password (Send Reset Email)
router.post("/kkkk", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Pharmacy.findOne({ email });
    if (!user) return res.status(404).json({ message: "Pharmacy not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Send Reset Link via Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link sent to email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// fetch nurse location
router.post("/nearby-nurses", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const nurses = await Pharmacy.find({
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] }, // [lng, lat]
          $maxDistance: 5000, // 5000 meters = 5km
        },
      },
      status: "available", // Only available nurses
    });

    res.json(nurses);
  } catch (error) {
    console.error("Error fetching nearby nurses:", error);
    res.status(500).json({ error: "Failed to fetch nearby nurses" });
  }
});


module.exports = router;
