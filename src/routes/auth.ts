import { Router } from "express";
import { validate } from "../middlewares/validate";
import { loginController, registerController } from "../auth/auth.controller";
import { LoginBodySchema, RegisterBodySchema } from "../auth/auth.schemas";

export function authRouter() {
  const r = Router();
  r.post(
    "/register",
    validate({ body: RegisterBodySchema }),
    registerController
  );
  r.post("/login", validate({ body: LoginBodySchema }), loginController);
  return r;
}
