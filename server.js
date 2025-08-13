const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jobRoutes = require("./routes/jobs");
const adminRoutes = require("./routes/admin");


const app = express();
app.use(cors());
app.use(express.json());




mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server started on port", process.env.PORT || 8080);
    });
  })
  .catch((err) => console.error("DB Connection Error , its not working:", err));

  //Routes
  app.use("/api/jobs", require('./routes/jobs'));
  app.use("/api/auth", adminRoutes);  