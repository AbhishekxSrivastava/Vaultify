import express from "express";
import {
  getReceipts,
  addReceipt,
  getReceiptById,
  deleteReceipt,
  searchReceipts,
} from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.use(protect);

// IMPORTANT: Place the specific '/search' route before the general '/:id' route
router.get("/search", searchReceipts);

router
  .route("/")
  .get(getReceipts)
  .post(upload.single("receiptImage"), addReceipt);

router.route("/:id").get(getReceiptById).delete(deleteReceipt);

export default router;
