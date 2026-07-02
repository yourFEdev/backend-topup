import { Schema, model, models } from "mongoose";

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = models.Counter || model("Counter", counterSchema);