const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  bpTarget: { type: String, default: "" },
  notifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: "English" },
  unit: { type: String, default: "mmHg" },
  profilePicture: { type: String, default: "" }, // Store Base64 image
});

module.exports = mongoose.model("Settings", settingsSchema);