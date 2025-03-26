const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  location: { type: Object, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
});

module.exports = mongoose.model("Pharmacy", PharmacySchema);


