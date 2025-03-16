const mongoose = require("mongoose");

const BPRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Links to User
  systolic: { type: Number, required: true },
  diastolic: { type: Number, required: true },
  pulse: { type: Number, required: true },
  recommendation: { type: String }, // ✅ Stores AI recommendation
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BPRecord", BPRecordSchema);
