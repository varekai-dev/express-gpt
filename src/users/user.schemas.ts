import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { REGEX } from "../constants/regex";

extendZodWithOpenApi(z);

export const UserSchema = z
  .object({
    _id: z
      .string()
      .regex(REGEX.mongoId)
      .openapi({ description: "MongoDB ObjectId" }),
    email: z.email().openapi({ example: "[email protected]" }),
    name: z.string().min(1).openapi({ example: "Ada Lovelace" }),
    createdAt: z.iso.datetime().openapi({ example: "2024-01-01T00:00:00Z" }),
    role: z.enum(["user", "admin"]).openapi({ example: "user" }),
  })
  .openapi("User");

export type User = z.infer<typeof UserSchema>;

export const CreateUserBodySchema = z
  .object({
    email: z.email(),
    name: z.string().min(1),
  })
  .openapi("CreateUserBody");

export const GetUserParamsSchema = z.object({
  id: z.string().regex(REGEX.mongoId),
});
export const ListUsersQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export function registerUserSchemas(registry: OpenAPIRegistry) {
  registry.register("User", UserSchema);
  registry.register("CreateUserBody", CreateUserBodySchema);
}
