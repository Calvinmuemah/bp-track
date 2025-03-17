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


const PORT = process.env.PORT;

// Connect to DB
connectDB();

const app = express();
app.use(express.json({ limit: "5mb" })); // Allow large images

app.use(cors());
app.use(cors({
  origin: ['https://bp-track-delta.vercel.app/', 'http://localhost:3000'],
  methods: ['GET', 'POST',"PUT", "DELETE"],
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

// Register User
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Add Blood Pressure Record
app.post("/api/bp/add", authMiddleware, async (req, res) => {
  try {
    const { systolic, diastolic, pulse } = req.body;
    const userId = req.user.id; 

    if (!systolic || !diastolic || !pulse) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBP = new BPRecord({ userId, systolic, diastolic, pulse });
    await newBP.save();

    res.json({ message: "BP record added successfully", data: newBP });
  } catch (error) {
    console.error("Error saving BP record:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// AI Analysis Route
app.post("/api/ai/analyze", authMiddleware, async (req, res) => {
  try {
    const { systolic, diastolic, pulse } = req.body;
    const userId = req.user.id;

    if (!systolic || !diastolic || !pulse) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let recommendation = "";
    if (systolic > 140 || diastolic > 90) {
      recommendation = "High BP detected! Consult a doctor and reduce salt intake.";
    } else if (systolic < 90 || diastolic < 60) {
      recommendation = "Low BP detected! Stay hydrated and eat a balanced diet.";
    } else {
      recommendation = "BP is normal. Keep maintaining a healthy lifestyle!";
    }

    const newBP = new BPRecord({ userId, systolic, diastolic, pulse, recommendation });
    await newBP.save();

    res.json({ message: "BP record analyzed and saved successfully", data: newBP });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "AI service error" });
  }
});


// AI Chat Route
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${message}. Keep your response short and to the point, no more than 2-3 sentences.` }] }]
    });

    console.log("🔍 API Response:", result);

    if (!result || !result.response || !result.response.candidates) {
      console.error("⚠️ Empty AI Response");
      return res.status(500).json({ error: "AI could not generate a response." });
    }

    const aiResponse = result.response.candidates[0]?.content?.parts[0]?.text || "No response from AI";
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("🚨 AI Chat Error:", error);
    res.status(500).json({ error: "AI service unavailable" });
  }
});



// Get BP History
app.get("/api/bp/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bpHistory = await BPRecord.find({ userId }).sort({ createdAt: -1 });

    if (bpHistory.length === 0) {
      return res.status(404).json({ error: "No BP records found" });
    }

    res.json(bpHistory);
  } catch (error) {
    console.error("Error fetching BP history:", error);
    res.status(500).json({ error: "Failed to retrieve BP history" });
  }
});

// downloading reports
app.get("/api/bp/download", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bpHistory = await BPRecord.find({ userId }).sort({ createdAt: -1 });

    if (bpHistory.length === 0) {
      return res.status(404).json({ error: "No BP records found" });
    }

    // Convert JSON data to CSV format
    const fields = ["systolic", "diastolic", "pulse", "recommendation", "createdAt"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(bpHistory);

    // Send file for download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=BP_Report_${userId}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});


// Send Reminder Email (Uses User's Registered Email)
app.post("/reminder", authMiddleware, async (req, res) => {
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

// Settings Routes
app.use("/api/settings", settingsRoutes);


// Contact Form Route
app.use("/api/contact", contactRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

