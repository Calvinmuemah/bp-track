const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pharmacy = require("../Models/Pharmacy");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 🔹 Pharmacy Registration
router.post("/signup", async (req, res) => {
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
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await Pharmacy.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    // Generate a reset token with an expiry of 15 minutes
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Store the token and expiry time in the database
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Email transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("Reset Link:", resetLink);

    // Email content with user's name
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Hi ${user.username},</h2>
          <p>We received a request to reset your password for your account at <strong>BP Track Pharmacy</strong>.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; font-size: 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p><strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or contact support.</p>
          <p>Thank you,<br>BP Track Pharmacy Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// resetLink

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Pharmacy.findById(decoded.id);

    if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
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
