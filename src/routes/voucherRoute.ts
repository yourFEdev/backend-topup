import express from "express";
import {
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherByGameName,
} from "../controllers/voucherController";
import { authenticateToken } from "../middleware/jwtMiddleware";

const router = express.Router();

router.get("/", getVouchers);
router.get("/:id", getVoucherById);
router.get("/game/:name", getVoucherByGameName);
router.post("/", createVoucher);
router.put("/:id",authenticateToken, updateVoucher);
router.delete("/:id", deleteVoucher);

export default router;