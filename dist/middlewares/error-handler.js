"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.notFound = notFound;
const zod_1 = require("zod");
class AppError extends Error {
    status;
    code;
    cause;
    constructor(message, options = {}) {
        super(message);
        this.name = "AppError";
        this.status = options.status ?? 500;
        this.code = options.code ?? "INTERNAL_ERROR";
        this.cause = options.cause;
    }
}
exports.AppError = AppError;
function errorHandler() {
    return (err, _req, res, _next) => {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                error: "VALIDATION_ERROR",
                message: "Request validation failed",
                details: err.issues,
            });
            return;
        }
        if (err instanceof AppError) {
            res.status(err.status).json({ error: err.code, message: err.message });
            return;
        }
        res
            .status(500)
            .json({ error: "INTERNAL_ERROR", message: "Unexpected error" });
    };
}
function notFound() {
    return (_req, res) => {
        res.status(404).json({ error: "NOT_FOUND", message: "Route not found" });
    };
}
