const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendMail");
const authenticate = require("../middleware/authMiddleware");
const Admin = require("../models/Admin"); // ✅ You forgot to import this!

// Register route
router.post("/register", async (req, res) => {
  const { name,email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already existing" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

   const newAdmin = new Admin({
  name,
  email,
  password: hashedPassword,
  otp,
  isVerified: false,
});

    await newAdmin.save();
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Email verification route
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    admin.isVerified = true;
    admin.otp = null;
    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Email not registered" });

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
  message: "Login successful", 
  token, 
  name: admin.name, // 👈 add this
  email: admin.email // optional, in case you also use it
});
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Protected profile route
router.get("/profile", authenticate, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Cannot fetch profile", error: err.message });
  }
});

// ✅ Export router instead of individual functions
module.exports = router;
