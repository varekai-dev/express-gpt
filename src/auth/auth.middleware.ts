import type { RequestHandler } from "express";

import { AppError } from "../middlewares/error-handler";

import { verifyAccessToken } from "./auth.service";

export function authenticate(): RequestHandler {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      next(
        new AppError("Missing or invalid Authorization header", {
          status: 401,
          code: "UNAUTHORIZED",
        })
      );
      return;
    }
    const token = authHeader.slice("Bearer ".length).trim();
    try {
      const payload = verifyAccessToken({ token });
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
      next();
    } catch {
      next(
        new AppError("Invalid or expired token", {
          status: 401,
          code: "UNAUTHORIZED",
        })
      );
    }
  };
}

export function authorize(
  allowedRoles?: Array<"user" | "admin">
): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError("Unauthorized", { status: 401, code: "UNAUTHORIZED" }));
      return;
    }
    if (!allowedRoles || allowedRoles.length === 0) {
      next();
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("Forbidden", { status: 403, code: "FORBIDDEN" }));
      return;
    }
    next();
  };
}
