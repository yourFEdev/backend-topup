"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.updateTransactionStatus = exports.createTransaction = void 0;
const midtrans_node_client_1 = require("midtrans-node-client");
const crypto_1 = __importDefault(require("crypto"));
const Transaction_1 = require("../models/Transaction");
const response_1 = require("../utils/response");
const generateInvoice_1 = require("../utils/generateInvoice");
const sendToMail_1 = require("../utils/sendToMail");
const createTransaction = async (req, res) => {
    try {
        const newTransaction = new Transaction_1.Transaction({
            ...req.body,
            timeline: [
                {
                    status: "created",
                    title: "Transaction Created",
                },
                {
                    status: "waiting_payment",
                    title: "Waiting for Payment",
                },
            ],
        });
        const savedTransaction = await newTransaction.save();
        const snap = new midtrans_node_client_1.MidtransClient.Snap({
            isProduction: false,
            serverKey: process.env.SERVER_KEY,
            clientKey: process.env.CLIENT_KEY,
        });
        const order_id = crypto_1.default.randomUUID();
        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id,
                gross_amount: savedTransaction.variant.price || 0,
            },
            item_details: [
                {
                    id: crypto_1.default.randomUUID(),
                    name: savedTransaction.voucher_name || "Voucher",
                    quantity: 1,
                    price: savedTransaction.variant.price || 40000,
                },
            ],
            customer_details: {
                first_name: "Topup",
                last_name: "Voucher",
                email: savedTransaction.buyer_email || "xxaexa1@gmail.com",
                phone: "08123456789",
                billing_address: {
                    address: "ds yex",
                    city: "city",
                    postal_code: "12345",
                },
            },
            callbacks: {
                finish: process.env.CB_MIDTRANS,
            },
        });
        savedTransaction.order_id = order_id;
        await savedTransaction.save();
        res.status(201).json((0, response_1.successResponse)("success", {
            transactionId: savedTransaction.transaction_id,
            midtransToken: transaction.token,
        }));
    }
    catch (error) {
        res
            .status(500)
            .json((0, response_1.errorResponse)("Failed to create transaction and initiate payment", error));
    }
};
exports.createTransaction = createTransaction;
// update transaction status
const updateTransactionStatus = async (req, res) => {
    try {
        const transaction = await Transaction_1.Transaction.findByIdAndUpdate(req.params.id, { payment_status: "paid" }, { new: true });
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json({
            message: "Payment status updated successfully",
            payment_status: transaction.payment_status,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating payment status" });
        return;
    }
};
exports.updateTransactionStatus = updateTransactionStatus;
// Get all transactions
const getTransactions = async (req, res) => {
    try {
        // const transactions = await Transaction.find({
        //   payment_status: { $ne: "pending" }
        // });
        const transactions = await Transaction_1.Transaction.find();
        console.log(transactions);
        res.json((0, response_1.successResponse)("Transactions fetched", transactions));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch transactions", error));
        return;
    }
};
exports.getTransactions = getTransactions;
// Get a single transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction_1.Transaction.findOne({
            transaction_id: req.params.id,
        });
        if (!transaction) {
            res.status(404).json((0, response_1.errorResponse)("Transaction not found"));
            return;
        }
        res.json((0, response_1.successResponse)("Transaction found", transaction));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch transaction", error));
        return;
    }
};
exports.getTransactionById = getTransactionById;
// Update transaction status
const updateTransaction = async (req, res) => {
    try {
        const { buyer_email, delivery_status } = req.body;
        const { id } = req.params;
        // Update delivery status
        const transaction = await Transaction_1.Transaction.findByIdAndUpdate(req.params.id, { delivery_status }, { new: true });
        if (!transaction) {
            res.status(404).json((0, response_1.errorResponse)("Transaction not found"));
            return;
        }
        // send email
        if (transaction.buyer_email) {
            const html = (0, generateInvoice_1.generateInvoiceTemplate)({
                recipientName: transaction.buyer_email,
                gameName: transaction.voucher_name,
                variation: transaction.variant.name,
                price: transaction.variant.price,
                transactionId: transaction.transaction_id,
                payment_method: transaction.payment_method,
                payment_status: transaction.payment_status,
                delivery_status: transaction.delivery_status,
                date: new Date().toLocaleDateString("id-ID"),
            });
            await (0, sendToMail_1.sendToMail)(buyer_email, "Invoice Top-up", html);
        }
        res.json((0, response_1.successResponse)("Transaction status updated", transaction));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to update status", error));
        return;
    }
};
exports.updateTransaction = updateTransaction;
// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction_1.Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            res.status(404).json((0, response_1.errorResponse)("Transaction not found"));
            return;
        }
        res.json((0, response_1.successResponse)("Transaction deleted", transaction));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to delete transaction", error));
        return;
    }
};
exports.deleteTransaction = deleteTransaction;
