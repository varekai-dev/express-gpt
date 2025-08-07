import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  ListUsersQuerySchema,
  UserSchema,
} from "../users/user.schemas";

extendZodWithOpenApi(z);

export function userOpenApi({ registry }: { registry: OpenAPIRegistry }) {
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  registry.registerPath({
    method: "get",
    path: "/api/users",
    request: { query: ListUsersQuerySchema },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "List users",
        content: {
          "application/json": {
            schema: z.object({ users: z.array(UserSchema) }),
          },
        },
      },
      401: { description: "Unauthorized" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/users/{id}",
    request: { params: GetUserParamsSchema },
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Get user by id",
        content: {
          "application/json": { schema: z.object({ user: UserSchema }) },
        },
      },
      401: { description: "Unauthorized" },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/users",
    request: {
      body: {
        content: { "application/json": { schema: CreateUserBodySchema } },
      },
    },
    security: [{ bearerAuth: [] }],
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": { schema: z.object({ user: UserSchema }) },
        },
      },
      401: { description: "Unauthorized" },
      403: { description: "Forbidden" },
      409: { description: "Conflict" },
    },
  });
}
