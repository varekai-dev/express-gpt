import { AppError } from "../middlewares/error-handler";

import type { UserRepository } from "./user.repository";

export function createUserService({ repo }: { repo: UserRepository }) {
  async function listUsers({ limit }: { limit: number }) {
    return repo.list({ limit });
  }

  async function getUserById({ id }: { id: string }) {
    const user = await repo.findById({ id });
    if (!user)
      throw new AppError("User not found", {
        status: 404,
        code: "USER_NOT_FOUND",
      });
    return user;
  }

  async function createUser({ email, name }: { email: string; name: string }) {
    // Rely on unique index; attempt insert and map duplicate error if occurs
    try {
      return await repo.create({ email, name });
    } catch (err: any) {
      const message = String(err?.message ?? "");
      if (message.includes("E11000") || message.includes("duplicate key"))
        throw new AppError("Email already exists", {
          status: 409,
          code: "EMAIL_EXISTS",
        });
      throw err;
    }
  }

  return { listUsers, getUserById, createUser };
}

export type UserService = ReturnType<typeof createUserService>;
