import mongoose from "mongoose";
import { getEnv } from "../utils/env";

let isConnected = false;

export async function initMongo(): Promise<void> {
  if (isConnected) return;
  const env = getEnv();
  const uri = env.mongoUri;
  await mongoose.connect(uri, env.mongoDb ? { dbName: env.mongoDb } : {});
  isConnected = true;
}
