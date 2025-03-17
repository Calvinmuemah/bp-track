const express = require("express");
const Settings = require("../Models/SettingsDB");
// const cors = require("cors");

const router = express.Router();

// Get User Settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

// Update User Settings
router.post("/", async (req, res) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ message: "✅ Settings updated successfully!", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
});

module.exports = router;