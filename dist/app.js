"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const voucherRoute_1 = __importDefault(require("./routes/voucherRoute"));
const transactionRoute_1 = __importDefault(require("./routes/transactionRoute"));
const midtransRoute_1 = __importDefault(require("./routes/midtransRoute"));
const reportRoute_1 = __importDefault(require("./routes/reportRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const dashboardRoute_1 = __importDefault(require("./routes/dashboardRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.send("Hello Brox");
});
app.use("/api/auth", authRoute_1.default);
app.use("/api/voucher", voucherRoute_1.default);
app.use("/api/transaction", transactionRoute_1.default);
app.use("/api/midtrans", midtransRoute_1.default);
app.use("/api/report", reportRoute_1.default);
app.use("/api/category", categoryRoute_1.default);
app.use("/api/home/", dashboardRoute_1.default);
exports.default = app;
