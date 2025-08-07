import { Router } from "express";
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

  r.get("/", validate({ query: ListUsersQuerySchema }), listUsersController);
  r.get(
    "/:id",
    validate({ params: GetUserParamsSchema }),
    getUserByIdController
  );
  r.post("/", validate({ body: CreateUserBodySchema }), createUserController);

  return r;
}
