"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "kuhakuxxxx1232";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.log("Invalid token", err);
        res.status(403).json({ message: "Token is not valid" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
