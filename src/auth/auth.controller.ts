import type { RequestHandler } from "express";

import { HttpStatus } from "../constants/http-status";
import { AppError } from "../middlewares/error-handler";
import { createUserRepository } from "../users/user.repository";

import {
  createAccessToken,
  hashPassword,
  verifyPassword,
} from "./auth.service";

const repo = createUserRepository();

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const { email, name, password } = (req.validated?.body ?? {}) as {
      email: string;
      name: string;
      password: string;
    };

    const existing = await repo.findByEmail({ email });
    if (existing)
      throw new AppError("Email already exists", {
        status: 409,
        code: "EMAIL_EXISTS",
      });

    const passwordHash = await hashPassword({ password });
    const user = await repo.create({ email, name, passwordHash, role: "user" });
    const token = createAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role as any,
    });
    res.status(HttpStatus.CREATED).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = (req.validated?.body ?? {}) as {
      email: string;
      password: string;
    };

    const user = await repo.findByEmail({ email });
    if (!user || !(user as any).passwordHash)
      throw new AppError("Invalid credentials", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });

    const isValid = await verifyPassword({
      password,
      passwordHash: (user as any).passwordHash,
    });
    if (!isValid)
      throw new AppError("Invalid credentials", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });

    const token = createAccessToken({
      userId: user._id,
      email: user.email,
      role: (user as any).role ?? "user",
    });
    res.status(HttpStatus.OK).json({ token, user });
  } catch (err) {
    next(err);
  }
};
