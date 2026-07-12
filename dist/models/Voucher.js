"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voucher = void 0;
const mongoose_1 = require("mongoose");
const VariantSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Boolean,
        default: true,
    },
}, { _id: false });
const VoucherSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: String,
    image: String,
    badge: String,
    discountLabel: String,
    expired: Date,
    field_type: {
        type: String,
        required: true,
        enum: ["userId", "userIdZoneId", "email", "phone", "custom"],
    },
    variants: {
        type: [VariantSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.Voucher = mongoose_1.models.Voucher || (0, mongoose_1.model)("Voucher", VoucherSchema);
