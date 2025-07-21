import express from "express";
import Receipt from "../models/Receipt.js";
import verifyToken from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.single("receiptFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "vaultify_receipts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      const newReceipt = new Receipt({
        userId: req.user.uid,
        itemName: req.body.itemName,
        store: req.body.store,
        purchaseDate: req.body.purchaseDate,
        warrantyExpiry: req.body.warrantyExpiry,
        fileUrl: result.secure_url,
      });
      const savedReceipt = await newReceipt.save();
      res.status(201).json(savedReceipt);
    } catch (err) {
      console.error("Error uploading receipt:", err);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
