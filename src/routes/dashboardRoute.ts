import express from "express";
import { getStats, getRevenue } from "../controllers/dashboardController";

const router = express.Router();

router.get("/stats", getStats);
router.get("/revenue", getRevenue);

export default router;
