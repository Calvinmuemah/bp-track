const express = require('express');
const router = express.Router();
const BPRecord = require('../Models/BPRecord');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// AI chart
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/chat", authMiddleware, async (req, res) => {
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

// AI Analysis Route
router.post("/analyze", authMiddleware, async (req, res) => {
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


module.exports = router;