"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongo = initMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../utils/env");
let isConnected = false;
async function initMongo() {
    if (isConnected)
        return;
    const env = (0, env_1.getEnv)();
    const uri = env.mongoUri;
    await mongoose_1.default.connect(uri, env.mongoDb ? { dbName: env.mongoDb } : {});
    isConnected = true;
}
