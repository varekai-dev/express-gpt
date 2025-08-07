"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .literal(["development", "test", "production"])
        .catch("development"),
    PORT: zod_1.z.coerce.number().int().positive().catch(3000),
    MONGO_URI: zod_1.z.string().min(1).catch("mongodb://127.0.0.1:27017"),
    MONGO_DB: zod_1.z.string().min(1).catch("gpt5"),
});
function getEnv() {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
        const message = zod_1.z.prettifyError(parsed.error);
        throw new Error(`Invalid environment configuration\n${message}`);
    }
    const v = parsed.data;
    return {
        nodeEnv: v.NODE_ENV,
        port: v.PORT,
        mongoUri: v.MONGO_URI,
        mongoDb: v.MONGO_DB,
    };
}
