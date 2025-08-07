import type { RequestHandler } from "express";
import { createUserRepository } from "./user.repository";
import { createUserService } from "./user.service";

const repo = createUserRepository();
const svc = createUserService({ repo });

export const listUsersController: RequestHandler = async (req, res, next) => {
  try {
    const limit = Number(req.validated?.query?.limit ?? 20);
    const users = await svc.listUsers({ limit });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController: RequestHandler = async (req, res, next) => {
  try {
    const { id } = (req.validated?.params ?? {}) as { id: string };
    const user = await svc.getUserById({ id });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const createUserController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { email, name } = (req.validated?.body ?? {}) as {
      email: string;
      name: string;
    };
    const user = await svc.createUser({ email, name });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};
