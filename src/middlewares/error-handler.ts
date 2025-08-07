import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

type AppErrorOptions = {
  status?: number;
  code?: string;
  cause?: unknown;
};

export class AppError extends Error {
  status: number;
  code: string;
  cause?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.status = options.status ?? 500;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.cause = options.cause;
  }
}

export function errorHandler(): ErrorRequestHandler {
  return (err, _req, res, _next) => {
    if (err instanceof ZodError) {
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

export function notFound(): RequestHandler {
  return (_req, res) => {
    res.status(404).json({ error: "NOT_FOUND", message: "Route not found" });
  };
}
