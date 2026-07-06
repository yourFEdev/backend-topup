import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController";
import { authenticateToken } from "../middleware/jwtMiddleware";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", authenticateToken, getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", authenticateToken, updateTransaction);
router.get("/update-status/:id", updateTransactionStatus);
router.delete("/:id", authenticateToken, deleteTransaction);

export default router;
