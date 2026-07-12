import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Mongo Connected");
  } catch (err) {
    console.error(err);
    throw err;
  }
};
