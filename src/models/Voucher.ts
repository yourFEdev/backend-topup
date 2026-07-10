import { Schema, model, models } from "mongoose";

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
      enum: ["input", "textarea", "select"],
      default: "input",
    },

    placeholder: {
      type: String,
      default: "",
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

    field_type: {
      type: String,
      required: true,
      enum: ["userId", "userIdZoneId", "email", "phone", "custom"],
    },

    fields: {
      type: [FieldSchema],
      default: [],
    },

    variants: {
      type: [VariantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Voucher = models.Voucher || model("Voucher", VoucherSchema);
