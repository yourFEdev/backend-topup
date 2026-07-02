// models/Transaction.ts
import { Schema, model, models } from "mongoose";
import { Counter } from "./Counter";

const TransactionSchema = new Schema({
  transaction_id: { type: String, unique: true }, // Auto-generated
  buyer_email: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User"},
  voucher_id: { type: Schema.Types.ObjectId, ref: "Voucher", required: true },
  voucher_name: { type: String, required: true },
  variant: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  buyer_inputs: {
    type: Map,
    of: String,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "failed", "expired"],
    default: "pending",
  },
  delivery_status: {
    type: String,
    enum: ["pending", "processing", "success", "failed"],
    default: "pending",
  },
  payment_method: {
    type: String,
    default: null,
  },
  order_id: { type: String },
}, { timestamps: true });

// Middleware untuk auto-increment transaction_id
TransactionSchema.pre("save", async function (next) {
  if (this.isNew && !this.transaction_id) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "transaction" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.transaction_id = `TRX-${String(counter.seq).padStart(3, "0")}`;
  }
  next();
});

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);