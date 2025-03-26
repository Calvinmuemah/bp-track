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


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.use("/api/chat", ReminderChart);




// Get BP History
app.use("/api/history", BPRoutes);
// downloading reports
app.use("/api/download", BPRoutes);
// Send Reminder Email (Uses User's Registered Email)
app.use("/api/reminder", ReminderChart);
// Settings Routes
app.use("/api/settings", settingsRoutes);
// Contact Form Route
app.use("/api/contact", contactRoutes);



// Pharmacy routes
// register
app.use("/api/register", PharmacyRoutes);
// login
app.use("/api/login", PharmacyRoutes);
// forgot password
app.use("/api/forgot-password", PharmacyRoutes);

app.use("/api/nearby-nurses", PharmacyRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

