import express from "express";
import { getDailyReport,getSalesReport } from "../controllers/reportController";

const   router = express.Router();

router.get("/daily-report", getDailyReport);
router.get("/", getSalesReport);

export default router;