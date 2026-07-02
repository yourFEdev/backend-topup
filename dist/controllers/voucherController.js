"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoucher = exports.updateVoucher = exports.createVoucher = exports.getVoucherByGameName = exports.getVoucherById = exports.getVouchers = void 0;
const Voucher_1 = require("../models/Voucher");
const response_1 = require("../utils/response");
const slugify_1 = __importDefault(require("slugify"));
// Get all vouchers
const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher_1.Voucher.find();
        res.status(200).json((0, response_1.successResponse)("Fetched vouchers", vouchers));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch vouchers", error));
    }
};
exports.getVouchers = getVouchers;
// Get one voucher
const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher_1.Voucher.find({ _id: req.params.id });
        console.log(req.params.id);
        const list = await Voucher_1.Voucher.find();
        console.log("Semua nama voucher:");
        list.forEach(v => console.log(v.name));
        if (!voucher) {
            res.status(404).json((0, response_1.errorResponse)("Voucher not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Fetched voucher", voucher));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch voucher", error));
    }
};
exports.getVoucherById = getVoucherById;
// Get one Voucher by name 
const getVoucherByGameName = async (req, res) => {
    try {
        const gameName = req.params.name;
        console.log("Game name param:", req.params.name);
        const voucher = await Voucher_1.Voucher.find({ game_name: gameName });
        if (!voucher || voucher.length === 0) {
            res.status(404).json((0, response_1.errorResponse)("Voucher not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Fetched voucher by game name", voucher));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch voucher", error));
        return;
    }
};
exports.getVoucherByGameName = getVoucherByGameName;
// Create voucher
const createVoucher = async (req, res) => {
    try {
        const { voucher_name, game_name, ...rest } = req.body;
        const slug = (0, slugify_1.default)(voucher_name, { lower: true, strict: true });
        const newVoucher = new Voucher_1.Voucher({
            voucher_id: slug,
            voucher_name,
            game_name,
            ...rest,
        });
        const savedVoucher = await newVoucher.save();
        res.status(201).json((0, response_1.successResponse)("Voucher created", savedVoucher));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to create voucher", error));
        return;
    }
};
exports.createVoucher = createVoucher;
// Update voucher
const updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        // Gunakan _id jika id-nya dari MongoDB
        const updated = await Voucher_1.Voucher.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json((0, response_1.errorResponse)("Voucher not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Voucher updated", updated));
        return;
    }
    catch (error) {
        res
            .status(500)
            .json((0, response_1.errorResponse)("Failed to update voucher", error.message));
        return;
    }
};
exports.updateVoucher = updateVoucher;
// Delete voucher
const deleteVoucher = async (req, res) => {
    try {
        const deleted = await Voucher_1.Voucher.findOneAndDelete({ _id: req.params.id });
        res.status(200).json((0, response_1.successResponse)("Voucher deleted", deleted));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to delete voucher", error));
        return;
    }
};
exports.deleteVoucher = deleteVoucher;
