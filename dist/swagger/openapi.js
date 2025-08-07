"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApi = buildOpenApi;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const user_openapi_1 = require("./user.openapi");
function buildOpenApi() {
    const registry = new zod_to_openapi_1.OpenAPIRegistry();
    (0, user_openapi_1.userOpenApi)({ registry });
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: "3.0.3",
        info: {
            title: "GPT-5 Express Zod API",
            version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000" }],
    });
}
