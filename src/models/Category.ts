import { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  title: { type: String, required: true },
  icon: { type: String },
});

export const Category = models.Category || model("Category", categorySchema);
