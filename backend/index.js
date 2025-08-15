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


// 192.168.137.1

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.137.1",
  // Add your network IP here if you know it, otherwise the config below handles it.
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If the origin is not in our whitelist, but it's a local network IP, allow it for development
      if (origin.startsWith('http://192.168.') || origin.startsWith('http://10.0.')) {
        return callback(null, true);
      }
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
// --- END CORS CONFIGURATION ---




// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
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
