"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const JwtMiddleware_1 = require("../middleware/JwtMiddleware");
const router = express_1.default.Router();
router.post("/", transactionController_1.createTransaction);
router.get("/", JwtMiddleware_1.authenticateToken, transactionController_1.getTransactions);
router.get("/:id", transactionController_1.getTransactionById);
router.put("/:id", JwtMiddleware_1.authenticateToken, transactionController_1.updateTransaction);
router.get("/update-status/:id", transactionController_1.updateTransactionStatus);
router.delete("/:id", JwtMiddleware_1.authenticateToken, transactionController_1.deleteTransaction);
exports.default = router;
