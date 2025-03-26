const express = require('express');
const router = express.Router();
const BPRecord = require('../Models/BPRecord');
const authMiddleware = require("../Middlewares/AuthMiddleware");
const fs = require("fs");
const { Parser } = require("json2csv");

// Add BP Record
router.post('/add', authMiddleware, async (req, res) => {
  const { systolic, diastolic, pulse } = req.body;
  const newBP = new BPRecord({ userId: req.user.id, systolic, diastolic, pulse });

  try {
    await newBP.save();
    res.json({ message: 'BP record added' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving record' });
  }
});

// Get BP History
router.get("/history", authMiddleware, async (req, res) => {
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
router.get("/download", authMiddleware, async (req, res) => {
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

module.exports = router;