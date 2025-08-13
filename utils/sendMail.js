// utils/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"N-Technologies" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Admin Verification",
    html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  });
};

module.exports = sendOTP;
