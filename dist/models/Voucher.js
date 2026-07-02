"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voucher = void 0;
const mongoose_1 = require("mongoose");
const InputFieldSchema = new mongoose_1.Schema({
    field_name: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: true },
}, { _id: false });
const VariantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: false });
const VoucherSchema = new mongoose_1.Schema({
    voucher_id: { type: String, unique: true, required: true }, // custom ID slug
    game_name: { type: String, required: true },
    voucher_name: { type: String, required: true },
    image_url: { type: String },
    description: { type: String },
    input_fields: [InputFieldSchema],
    variants: [VariantSchema],
}, { timestamps: true });
exports.Voucher = mongoose_1.models.Voucher || (0, mongoose_1.model)("Voucher", VoucherSchema);
