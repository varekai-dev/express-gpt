"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userOpenApi = userOpenApi;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const zod_1 = require("zod");
const user_schemas_1 = require("../users/user.schemas");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
function userOpenApi({ registry }) {
    registry.registerPath({
        method: "get",
        path: "/api/users",
        request: { query: user_schemas_1.ListUsersQuerySchema },
        responses: {
            200: {
                description: "List users",
                content: {
                    "application/json": {
                        schema: zod_1.z.object({ users: zod_1.z.array(user_schemas_1.UserSchema) }),
                    },
                },
            },
        },
    });
    registry.registerPath({
        method: "get",
        path: "/api/users/{id}",
        request: { params: user_schemas_1.GetUserParamsSchema },
        responses: {
            200: {
                description: "Get user by id",
                content: {
                    "application/json": { schema: zod_1.z.object({ user: user_schemas_1.UserSchema }) },
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
                content: { "application/json": { schema: user_schemas_1.CreateUserBodySchema } },
            },
        },
        responses: {
            201: {
                description: "Created",
                content: {
                    "application/json": { schema: zod_1.z.object({ user: user_schemas_1.UserSchema }) },
                },
            },
            409: { description: "Conflict" },
        },
    });
}
