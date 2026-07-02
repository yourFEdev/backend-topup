"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Invalid email format"],
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", UserSchema);
