"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const midtransController_1 = require("../controllers/midtransController");
const router = express_1.default.Router();
router.post('/callback', midtransController_1.midtransCallback);
exports.default = router;
