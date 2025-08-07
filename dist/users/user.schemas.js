"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersQuerySchema = exports.GetUserParamsSchema = exports.CreateUserBodySchema = exports.UserSchema = void 0;
exports.registerUserSchemas = registerUserSchemas;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const zod_1 = require("zod");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.UserSchema = zod_1.z
    .object({
    _id: zod_1.z
        .string()
        .regex(/^[a-f0-9]{24}$/i)
        .openapi({ description: "MongoDB ObjectId" }),
    email: zod_1.z.email().openapi({ example: "[email protected]" }),
    name: zod_1.z.string().min(1).openapi({ example: "Ada Lovelace" }),
    createdAt: zod_1.z.iso.datetime().openapi({ example: "2024-01-01T00:00:00Z" }),
})
    .openapi("User");
exports.CreateUserBodySchema = zod_1.z
    .object({
    email: zod_1.z.email(),
    name: zod_1.z.string().min(1),
})
    .openapi("CreateUserBody");
exports.GetUserParamsSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f0-9]{24}$/i),
});
exports.ListUsersQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(20),
});
function registerUserSchemas(registry) {
    registry.register("User", exports.UserSchema);
    registry.register("CreateUserBody", exports.CreateUserBodySchema);
}
