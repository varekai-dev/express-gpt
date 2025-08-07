"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
function requestLogger() {
    const stream = (0, pino_pretty_1.default)({ translateTime: true, ignore: "pid,hostname" });
    const logger = (0, pino_1.default)({}, stream);
    return (req, res, next) => {
        const started = Date.now();
        res.on("finish", () => {
            const ms = Date.now() - started;
            logger.info({
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                ms,
            }, "request");
        });
        next();
    };
}
