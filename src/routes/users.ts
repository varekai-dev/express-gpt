import { Router } from "express";

import { authenticate, authorize } from "../auth/auth.middleware";
import { validate } from "../middlewares/validate";
import {
  createUserController,
  getUserByIdController,
  listUsersController,
} from "../users/user.controller";
import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  ListUsersQuerySchema,
} from "../users/user.schemas";

export function userRouter() {
  const r = Router();

  r.get(
    "/",
    authenticate(),
    validate({ query: ListUsersQuerySchema }),
    listUsersController
  );
  r.get(
    "/:id",
    authenticate(),
    validate({ params: GetUserParamsSchema }),
    getUserByIdController
  );
  r.post(
    "/",
    authenticate(),
    authorize(["admin"]),
    validate({ body: CreateUserBodySchema }),
    createUserController
  );

  return r;
}
