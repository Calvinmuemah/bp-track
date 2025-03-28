require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./Config/BD");
const User = require("./Models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("./Middlewares/AuthMiddleware");
const BPRecord = require("./Models/BPRecord");
const fs = require("fs");
const { Parser } = require("json2csv");

const settingsRoutes = require("./Routes/SettingsRoute");
const contactRoutes = require("./Routes/Contact");
const Pharmacy = require("./Models/Pharmacy");

const PharmacyRoutes = require("./Routes/Pharmacy");
const router = require("./Routes/SettingsRoute");
const AuthRoutes = require("./Routes/AuthRoutes")
const ReminderChart = require("./Routes/ReminderChart");
const BPRoutes = require("./Routes/BPRoutes");


const PORT = process.env.PORT;

// Connect to DB
connectDB();

const app = express();
app.use(express.json({ limit: "5mb" })); // Allow large images

app.use(cors());
app.options('*', cors());

app.use(cors({
  origin: "*",
  // methods: ['GET', 'POST',"PUT", "DELETE"],
}));



// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// User
// register
app.use("/api/register", AuthRoutes);
// login
app.use("/api/login", AuthRoutes);
// Add Blood Pressure Record
app.use("/api/add", BPRoutes);


// AI Analysis Route
app.use("/api/analyze", ReminderChart);



// AI Chat Route
app.use("/api/chat", ReminderChart);




// Get BP History
app.use("/api/history", BPRoutes);
// downloading reports
app.use("/api/download", BPRoutes);

// Settings Routes
// settings
app.use("/api/settings", settingsRoutes);
// save updates
app.use("/api/update", settingsRoutes);
// Contact Form Route
app.use("/api/contact", contactRoutes);



// Pharmacy routes
// register
app.use("/signup", PharmacyRoutes);
// login
app.use("/api/login", PharmacyRoutes);
// forgot password
app.use("/api/forgot-password", PharmacyRoutes);

app.use("/api/nearby-nurses", PharmacyRoutes);

// Send Reminder Email (Uses User's Registered Email)
app.post("/api/reminder", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "🩺 Blood Pressure Check Reminder",
      text: `Hello ${user.name},\n\nThis is a friendly reminder to check your blood pressure today. Monitoring your blood pressure regularly is essential for maintaining good heart health.\n\n📌 Here are some quick tips for an accurate reading:\n✔️ Sit in a comfortable position with your feet flat on the ground.\n✔️ Rest for at least 5 minutes before measuring.\n✔️ Avoid caffeine, smoking, or exercise 30 minutes before checking.\n✔️ Take multiple readings and record your results.\n\n💡 Why is this important?\nRegular monitoring helps detect early signs of hypertension and ensures your well-being.\n\nStay healthy,\nBP Monitor Team`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reminder email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

