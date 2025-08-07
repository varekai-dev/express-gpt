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
    // JSON body parser errors
    if (isBodyParserError(err)) {
      const { status, code, message } = mapBodyParserError(err);
      res.status(status).json({ error: code, message });
      return;
    }

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

    // JWT errors
    if (isJwtError(err)) {
      const { status, code, message } = mapJwtError(err);
      res.status(status).json({ error: code, message });
      return;
    }

    // Mongoose / MongoDB errors
    if (isMongoDuplicateKeyError(err)) {
      const fields = extractDuplicateFields(err);
      res.status(409).json({
        error: "DUPLICATE_KEY",
        message: `Duplicate value for ${fields.join(", ")}`,
      });
      return;
    }

    if (isMongooseCastError(err)) {
      res
        .status(400)
        .json({ error: "INVALID_ID", message: `Invalid id format` });
      return;
    }

    if (isMongooseValidationError(err)) {
      const fields = Object.keys(err.errors ?? {});
      res.status(400).json({
        error: "DB_VALIDATION_ERROR",
        message: fields.length
          ? `Validation failed for: ${fields.join(", ")}`
          : "Validation failed",
      });
      return;
    }

    if (isMongoServerSelectionError(err)) {
      res
        .status(503)
        .json({ error: "DB_UNAVAILABLE", message: "Database unavailable" });
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

export function methodNotAllowed(): RequestHandler {
  return (_req, res) => {
    res
      .status(405)
      .json({ error: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  };
}

function isBodyParserError(err: any): boolean {
  const type = err?.type as string | undefined;
  return typeof type === "string" && type.startsWith("entity.");
}

function mapBodyParserError(err: any): {
  status: number;
  code: string;
  message: string;
} {
  const type = err?.type as string | undefined;
  if (type === "entity.too.large")
    return {
      status: 413,
      code: "PAYLOAD_TOO_LARGE",
      message: "Payload too large",
    };
  if (type === "entity.parse.failed")
    return {
      status: 400,
      code: "INVALID_JSON",
      message: "Malformed JSON body",
    };
  return { status: 400, code: "BAD_REQUEST", message: "Invalid request body" };
}

function isJwtError(err: any): boolean {
  const name = err?.name as string | undefined;
  return (
    name === "JsonWebTokenError" ||
    name === "TokenExpiredError" ||
    name === "NotBeforeError"
  );
}

function mapJwtError(err: any): {
  status: number;
  code: string;
  message: string;
} {
  const name = err?.name as string | undefined;
  if (name === "TokenExpiredError")
    return { status: 401, code: "TOKEN_EXPIRED", message: "Token expired" };
  if (name === "NotBeforeError")
    return {
      status: 401,
      code: "TOKEN_NOT_ACTIVE",
      message: "Token not active yet",
    };
  return { status: 401, code: "UNAUTHORIZED", message: "Invalid token" };
}

function isMongoDuplicateKeyError(err: any): boolean {
  return (
    err?.name === "MongoServerError" &&
    (err?.code === 11000 || String(err?.message ?? "").includes("E11000"))
  );
}

function extractDuplicateFields(err: any): string[] {
  const pattern = err?.keyPattern ?? {};
  const keyValue = err?.keyValue ?? {};
  const keys = Object.keys(pattern);
  if (keys.length) return keys;
  const kvKeys = Object.keys(keyValue);
  if (kvKeys.length) return kvKeys;
  return ["unique_field"];
}

function isMongooseCastError(err: any): boolean {
  return err?.name === "CastError";
}

function isMongooseValidationError(err: any): boolean {
  return err?.name === "ValidationError";
}

function isMongoServerSelectionError(err: any): boolean {
  return err?.name === "MongooseServerSelectionError";
}
