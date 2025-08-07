import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .literal(["development", "test", "production"])
    .catch("development"),
  PORT: z.coerce.number().int().positive().catch(3000),
  MONGO_URI: z.string().min(1).catch("mongodb://127.0.0.1:27017"),
  MONGO_DB: z.string().min(1).catch("gpt5"),
});

export type Env = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  mongoUri: string;
  mongoDb: string;
};

export function getEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = z.prettifyError(parsed.error);
    throw new Error(`Invalid environment configuration\n${message}`);
  }
  const v = parsed.data;
  return {
    nodeEnv: v.NODE_ENV as Env["nodeEnv"],
    port: v.PORT,
    mongoUri: v.MONGO_URI,
    mongoDb: v.MONGO_DB,
  };
}
