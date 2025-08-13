// models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Job", "Internship"], required: true },
  location: String,
  duration: String,
  experience: String,
  stipend: String,
  ctc: String,
  skills: String,
  requirements: String,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
