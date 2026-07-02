import { Request, Response } from "express";
import {MidtransClient}  from "midtrans-node-client";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../models/Transaction";
import { successResponse, errorResponse } from "../utils/response";
import { generateInvoiceTemplate } from "../utils/generateInvoice";
import { sendToMail } from "../utils/sendToMail";


export const createTransaction = async (req: Request, res: Response) => {
  try {
    const newTransaction = new Transaction(req.body); 
    const savedTransaction = await newTransaction.save();

    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY!,
      clientKey: process.env.CLIENT_KEY!,
    });

    const order_id = uuidv4();

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id,
        gross_amount: savedTransaction.variant.price || 0,
      },
      item_details: [
        {
          id: uuidv4(),
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
        finish: `https://fe-topup-online.vercel.app/transaction/${savedTransaction.transaction_id}`,
      },
    });

    savedTransaction.order_id = order_id;
    await savedTransaction.save();

    res.status(201).json(
      successResponse("success", {
        transactionId: savedTransaction.transaction_id,
        midtransToken: transaction.token,
      })
    );
  } catch (error) {
    res.status(500).json(
      errorResponse("Failed to create transaction and initiate payment", error)
    );
  }
};

// update transaction status
export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { payment_status: "paid" },
      { new: true } 
    );

    if (!transaction) {
     res.status(404).json({ message: "Transaction not found" });
      return
    }

    res.status(200).json({
      message: "Payment status updated successfully",
      payment_status: transaction.payment_status,
    });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating payment status" });
    return
  }
};



// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      payment_status: { $ne: "pending" }
    });

    res.json(successResponse("Transactions fetched", transactions));
    return;
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Failed to fetch transactions", error));
    return;
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOne({ transaction_id: req.params.id });
   
    if (!transaction) {
       res.status(404).json(errorResponse("Transaction not found"));
       return
    }
    res.json(successResponse("Transaction found", transaction));
    return
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch transaction", error));
    return
  }
};

// Update transaction status
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { buyer_email, delivery_status } = req.body;
    const { id } = req.params;

    // Update delivery status
    const transaction = await  Transaction.findByIdAndUpdate(req.params.id, { delivery_status }, { new: true });

    if (!transaction) {
       res.status(404).json(errorResponse("Transaction not found"));
       return
    }

    // send email
    if (transaction.buyer_email) {
      const html = generateInvoiceTemplate({
        recipientName: transaction.buyer_email,
        gameName: transaction.voucher_name,
        variation: transaction.variant.name,
        price: transaction.variant.price,
        transactionId: transaction.transaction_id,
        payment_method:transaction.payment_method,
        payment_status:transaction.payment_status,
        delivery_status:transaction.delivery_status,
        date: new Date().toLocaleDateString('id-ID'),
      });

      await sendToMail(buyer_email, "Invoice Top-up", html);
    }

    res.json(successResponse("Transaction status updated", transaction));
    return
  } catch (error) {
    res.status(500).json(errorResponse("Failed to update status", error));
    return
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      res.status(404).json(errorResponse("Transaction not found"));
      return
    }

     res.json(successResponse("Transaction deleted", transaction));
    return
  } catch (error) {
     res.status(500).json(errorResponse("Failed to delete transaction", error));
    return
  }
};