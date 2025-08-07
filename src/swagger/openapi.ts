import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { authOpenApi } from "./auth.openapi";
import { userOpenApi } from "./user.openapi";

export function buildOpenApi() {
  const registry = new OpenAPIRegistry();
  userOpenApi({ registry });
  authOpenApi({ registry });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "GPT-5 Express Zod API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
    ],
  });
}
