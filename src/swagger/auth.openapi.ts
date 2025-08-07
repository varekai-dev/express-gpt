import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  LoginBodySchema,
  RegisterBodySchema,
  AuthResponseSchema,
} from "../auth/auth.schemas";

extendZodWithOpenApi(z);

export function authOpenApi({ registry }: { registry: OpenAPIRegistry }) {
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    request: {
      body: { content: { "application/json": { schema: RegisterBodySchema } } },
    },
    responses: {
      201: {
        description: "Registered",
        content: { "application/json": { schema: AuthResponseSchema } },
      },
      409: { description: "Conflict" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    request: {
      body: { content: { "application/json": { schema: LoginBodySchema } } },
    },
    responses: {
      200: {
        description: "Logged in",
        content: { "application/json": { schema: AuthResponseSchema } },
      },
      401: { description: "Invalid credentials" },
    },
  });
}
