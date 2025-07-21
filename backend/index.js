import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import receiptRoutes from "./routes/receipts.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/receipts", receiptRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
