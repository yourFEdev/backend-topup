import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";

export const midtransCallback = async (req: Request, res: Response) => {
  try {
    const { transaction_status, order_id, payment_type } = req.body;

    console.log("===== CALLBACK =====");
    console.log(req.body);

    const transaction = await Transaction.findOne({ order_id });

    console.log("Order ID:", order_id);
    console.log("Transaction:", transaction);

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    transaction.payment_method = payment_type;

    switch (transaction_status) {
      case "settlement":
        transaction.payment_status = "paid";

        transaction.timeline.push({
          status: "paid",
          title: "Payment Successful",
          description: `Payment received via ${payment_type}.`,
          created_at: new Date(),
        });

        break;

      case "expire":
        transaction.payment_status = "expired";

        transaction.timeline.push({
          status: "expired",
          title: "Payment Expired",
          description: "The payment time has expired.",
          created_at: new Date(),
        });

        break;

      case "cancel":
        transaction.payment_status = "failed";

        transaction.timeline.push({
          status: "failed",
          title: "Payment Cancelled",
          description: "The payment was cancelled.",
          created_at: new Date(),
        });

        break;
    }

    await transaction.save();

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error di callback Midtrans:", error);
    return res.status(500).send("Internal Server Error");
  }
};
