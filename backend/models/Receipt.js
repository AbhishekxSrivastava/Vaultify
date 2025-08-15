import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: [true, "Please add a title"] },
    purchaseDate: { type: Date, required: true },
    warrantyEndDate: { type: Date },
    amount: { type: Number },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    extractedText: { type: String },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
