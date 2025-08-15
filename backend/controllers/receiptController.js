import Receipt from "../models/Receipt.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import Tesseract from "tesseract.js";

// @desc    Get all receipts for a logged-in user
// @route   GET /api/receipts
export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user._id }).sort({
      purchaseDate: -1,
    });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching receipts" });
  }
};

// @desc    Get a single receipt by ID
// @route   GET /api/receipts/:id
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    if (receipt.user.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Not authorized" });
    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Add a new receipt with Tesseract OCR
// @route   POST /api/receipts
export const addReceipt = async (req, res) => {
  const { title, purchaseDate, warrantyEndDate, amount } = req.body;
  if (!req.file)
    return res.status(400).json({ error: "Receipt image is required." });

  try {
    // 1. Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `vaultify/${req.user._id}`,
    });

    // 2. Perform OCR using Tesseract
    let extractedText = "";
    try {
      console.log("Performing OCR with Tesseract...");
      const result = await Tesseract.recognize(req.file.buffer, "eng");
      extractedText = result.data.text;
      console.log("Tesseract OCR successful.");
    } catch (ocrError) {
      console.error("Tesseract OCR failed:", ocrError.message);
      extractedText = "OCR failed to extract text from this image.";
    }

    // 3. Save everything to the database
    const newReceipt = new Receipt({
      user: req.user._id,
      title,
      purchaseDate,
      warrantyEndDate: warrantyEndDate || null,
      amount: amount || null,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      extractedText: extractedText, // Save the plain text from Tesseract
    });

    const savedReceipt = await newReceipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
    console.error("Error in addReceipt controller:", error);
    res.status(500).json({ error: "Server error while adding receipt" });
  }
};

// @desc    Delete a receipt by ID
// @route   DELETE /api/receipts/:id
export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    if (receipt.user.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Not authorized" });
    await deleteFromCloudinary(receipt.imagePublicId);
    await Receipt.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting receipt" });
  }
};

// @desc    Search receipts by title or extracted text
// @route   GET /api/receipts/search
export const searchReceipts = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const searchRegex = new RegExp(query, "i");
    const receipts = await Receipt.find({
      user: req.user._id,
      $or: [{ title: searchRegex }, { extractedText: searchRegex }],
    }).sort({ purchaseDate: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: "Server error while searching receipts" });
  }
};
