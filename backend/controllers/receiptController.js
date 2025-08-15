import Receipt from "../models/Receipt.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import Tesseract from "tesseract.js";

// --- No changes to getReceipts, getReceiptById, addReceipt, deleteReceipt ---
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
export const addReceipt = async (req, res) => {
  const { title, purchaseDate, warrantyEndDate, amount } = req.body;
  if (!req.file)
    return res.status(400).json({ error: "Receipt image is required." });
  try {
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: `vaultify/${req.user._id}`,
    });
    let extractedText = "";
    try {
      const result = await Tesseract.recognize(req.file.buffer, "eng");
      extractedText = result.data.text;
    } catch (ocrError) {
      extractedText = "OCR failed to extract text from this image.";
    }
    const newReceipt = new Receipt({
      user: req.user._id,
      title,
      purchaseDate,
      warrantyEndDate: warrantyEndDate || null,
      amount: amount || null,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      extractedText: extractedText,
    });
    const savedReceipt = await newReceipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
    res.status(500).json({ error: "Server error while adding receipt" });
  }
};
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
// --- End of unchanged functions ---

// @desc    Search receipts by title or extracted text
// @route   GET /api/receipts/search
export const searchReceipts = async (req, res) => {
  const { query } = req.query; // Get search query from URL parameter (e.g., /search?query=milk)
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const searchRegex = new RegExp(query, "i"); // 'i' for case-insensitive search
    const receipts = await Receipt.find({
      user: req.user._id,
      $or: [{ title: searchRegex }, { extractedText: searchRegex }],
    }).sort({ purchaseDate: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: "Server error while searching receipts" });
  }
};
