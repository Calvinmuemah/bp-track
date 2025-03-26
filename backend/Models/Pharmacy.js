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


// const mongoose = require("mongoose");

// const NurseSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   location: {
//     type: { type: String, enum: ["Point"], default: "Point" },
//     coordinates: { type: [Number], required: true }, // [longitude, latitude]
//   },
//   status: { type: String, default: "available" },
// });

// // ✅ Add geospatial index for location-based queries
// NurseSchema.index({ location: "2dsphere" });

// module.exports = mongoose.model("Nurse", NurseSchema);