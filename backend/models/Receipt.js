import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ReceiptSchema = new Schema(
  {
    userId: { type: String, required: true },
    itemName: { type: String, required: true },
    store: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyExpiry: { type: Date, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Receipt = model("Receipt", ReceiptSchema);
export default Receipt;
