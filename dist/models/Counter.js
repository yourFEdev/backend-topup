"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
exports.Counter = mongoose_1.models.Counter || (0, mongoose_1.model)("Counter", counterSchema);
