import { Schema, model, models } from "mongoose";

const FieldSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    component: {
      type: String,
      enum: ["input", "select", "textarea"],
      default: "input",
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
      default: "text",
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const VariantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const VoucherSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: String,
    image: String,
    badge: String,
    discountLabel: String,
    expired: Date,
    fields: [FieldSchema],
    variants: [VariantSchema],
  },
  {
    timestamps: true,
  },
);

export const Voucher = models.Voucher || model("Voucher", VoucherSchema);
