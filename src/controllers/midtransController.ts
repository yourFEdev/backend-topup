import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";

export const midtransCallback = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { transaction_status, order_id, fraud_status, payment_type } =
      payload;

    // Cari transaksi berdasarkan order_id
    const transaction = await Transaction.findOne({ order_id });
    console.log("===== CALLBACK =====");
    console.log(req.body);

    console.log("Order ID:", order_id);
    console.log("Transaction:", transaction);
    if (!transaction) {
      console.error(`Transaksi dengan order_id ${order_id} tidak ditemukan`);
      res.status(404).send("Transaction not found");
      return;
    }
    // Update payment_status dan payment_method
    if (transaction_status === "settlement") {
      transaction.payment_status = "paid";
      transaction.payment_method = payment_type;

      transaction.timeline.push({
        status: "paid",
        title: "Payment Successful",
        description: `Payment received via ${payment_type}.`,
        created_at: new Date(),
      });

      await transaction.save();
    } else if (transaction_status === "expire") {
      transaction.payment_status = "expired";
      transaction.payment_method = payment_type;

      transaction.timeline.push({
        status: "expired",
        title: "Payment Expired",
        description: "The payment time has expired.",
        created_at: new Date(),
      });

      await transaction.save();
    } else if (transaction_status === "cancel") {
      transaction.payment_status = "failed";
      transaction.payment_method = payment_type;

      transaction.timeline.push({
        status: "failed",
        title: "Payment Cancelled",
        description: "The payment was cancelled.",
        created_at: new Date(),
      });

      await transaction.save();
    }
    {
      transaction.payment_status =
        transaction_status === "cancel" ? "failed" : "expired";
      transaction.payment_method = payment_type;
      await transaction.save();
    }

    res.status(200).send("OK");
    return;
  } catch (error) {
    console.error("Error di callback Midtrans:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};
