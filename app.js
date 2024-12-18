require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { connectDB, sequelize } = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const otpRoute = require("./src/routes/otpVerifyRoute");
const xss = require("xss-clean");
const helmet = require("helmet");
const app = express();
const path = require("path");
const PORT = 3000;
app.use(helmet());
// Middleware
// app.use(bodyParser.json());
app.use(express.json({ limit: "10kb" }));
app.use(xss());

//security for limit requests
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "to many request from this IP please try again in an hour",
});
app.use(limiter);
app.use(express.static("src/public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src", "views")); // Folder for Pug files
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/user", userRoutes);
app.use("/otp", otpRoute);
// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();

  // Sync models with the database
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    console.log("Database synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
