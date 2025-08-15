import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import startWarrantyScheduler from "./utils/emailScheduler.js"; // Import the scheduler

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Vaultify API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);

// Start the cron job for email reminders
startWarrantyScheduler();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
