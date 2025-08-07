import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { userOpenApi } from "./user.openapi";

export function buildOpenApi() {
  const registry = new OpenAPIRegistry();
  userOpenApi({ registry });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "GPT-5 Express Zod API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
  });
}
