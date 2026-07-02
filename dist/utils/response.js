"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, data) => {
    return {
        status: "success",
        message,
        data,
    };
};
exports.successResponse = successResponse;
const errorResponse = (message, errors) => {
    return {
        status: "error",
        message,
        errors,
    };
};
exports.errorResponse = errorResponse;
