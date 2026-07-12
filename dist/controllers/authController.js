"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.refreshToken = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
// register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exist = await User_1.User.findOne({ email });
        if (exist) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const existingName = await User_1.User.findOne({ name });
        if (existingName) {
            res.status(400).json({ message: "Name already exists" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        let user = await User_1.User.create({ name, email, password: hashedPassword });
        res.status(201).json((0, response_1.successResponse)("success", user));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to register user", error));
        return;
    }
};
exports.registerUser = registerUser;
// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        res.json({
            message: "Login success",
            user: { name: user.name, email: user.email },
            accessToken,
        });
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to login", error));
        return;
    }
};
exports.loginUser = loginUser;
// refresh
const refreshToken = async (req, res) => {
    const refresh = req.cookies.refreshToken;
    if (!refresh)
        return res.status(401).json({ message: "No refresh token" });
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refresh);
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        res.json({ message: "Token refreshed" });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
// get user
const getUsers = async (req, res) => {
    try {
        const users = await User_1.User.find();
        res.status(200).json((0, response_1.successResponse)("Fetched vouchers", users));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch vouchers", error));
    }
};
exports.getUsers = getUsers;
// get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).json((0, response_1.errorResponse)("User not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Fetched voucher", user));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch voucher", error));
    }
};
exports.getUserById = getUserById;
