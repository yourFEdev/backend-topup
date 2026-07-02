"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midtransCallback = void 0;
const Transaction_1 = require("../models/Transaction");
const midtransCallback = async (req, res) => {
    try {
        const payload = req.body;
        const { transaction_status, order_id, fraud_status, payment_type, } = payload;
        // Cari transaksi berdasarkan order_id
        const transaction = await Transaction_1.Transaction.findOne({ order_id });
        if (!transaction) {
            console.error(`Transaksi dengan order_id ${order_id} tidak ditemukan`);
            res.status(404).send('Transaction not found');
            return;
        }
        // Update payment_status dan payment_method
        if (transaction_status === 'settlement') {
            transaction.payment_status = 'paid';
            transaction.payment_method = payment_type;
            await transaction.save();
        }
        else if (transaction_status === 'cancel' || transaction_status === 'expire') {
            transaction.payment_status = transaction_status === 'cancel' ? 'failed' : 'expired';
            transaction.payment_method = payment_type;
            await transaction.save();
        }
        res.status(200).send('OK');
        return;
    }
    catch (error) {
        console.error('Error di callback Midtrans:', error);
        res.status(500).send('Internal Server Error');
        return;
    }
};
exports.midtransCallback = midtransCallback;
