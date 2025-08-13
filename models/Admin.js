// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String }, // stores the OTP
  isVerified: { type: Boolean, default: false }, // email verification status
});

module.exports = mongoose.model("Admin", adminSchema);

