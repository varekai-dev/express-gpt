import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const RegisterBodySchema = z
  .object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(6),
  })
  .openapi("RegisterBody");

export const LoginBodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
  })
  .openapi("LoginBody");

export const AuthResponseSchema = z
  .object({
    token: z.string(),
    user: z.object({
      _id: z.string(),
      email: z.string().email(),
      name: z.string(),
      createdAt: z.string(),
      role: z.enum(["user", "admin"]),
    }),
  })
  .openapi("AuthResponse");
