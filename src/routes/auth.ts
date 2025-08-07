import { Router } from "express";

import { loginController, registerController } from "../auth/auth.controller";
import { LoginBodySchema, RegisterBodySchema } from "../auth/auth.schemas";
import { validate } from "../middlewares/validate";

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
