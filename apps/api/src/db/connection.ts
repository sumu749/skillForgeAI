import mongoose from "mongoose";
import { config } from "../config";

let isConnected = false;

export async function connectDatabase(): Promise<"mongo" | "json"> {
  if (!config.useMongo || !config.mongoUri) {
    console.log("📁 Using JSON file storage (MongoDB disabled or not configured)");
    return "json";
  }

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 3000 });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
    return "mongo";
  } catch (error) {
    console.warn("⚠️ MongoDB unavailable, falling back to JSON file storage:", (error as Error).message);
    return "json";
  }
}

export function getStorageMode(): "mongo" | "json" {
  return isConnected ? "mongo" : "json";
}

export { mongoose };
