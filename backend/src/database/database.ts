import mongoose from "mongoose";
import { env } from "../config/env";

export const connectDatabase = async () => {
  try {
    const mongoUri = env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI missing");
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");

    process.exit(1);
  }
};