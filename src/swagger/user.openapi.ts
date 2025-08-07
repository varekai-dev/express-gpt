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
  registry.registerPath({
    method: "get",
    path: "/api/users",
    request: { query: ListUsersQuerySchema },
    responses: {
      200: {
        description: "List users",
        content: {
          "application/json": {
            schema: z.object({ users: z.array(UserSchema) }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/users/{id}",
    request: { params: GetUserParamsSchema },
    responses: {
      200: {
        description: "Get user by id",
        content: {
          "application/json": { schema: z.object({ user: UserSchema }) },
        },
      },
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
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": { schema: z.object({ user: UserSchema }) },
        },
      },
      409: { description: "Conflict" },
    },
  });
}
