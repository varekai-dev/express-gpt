import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { notFound } from "../middlewares/error-handler";
import { buildOpenApi } from "../swagger/openapi";

import { authRouter } from "./auth";
import { userRouter } from "./users";

export function registerRoutes({ app }: { app: Express }) {
  app.use("/api/auth", authRouter());
  app.use("/api/users", userRouter());

  const openapi = buildOpenApi();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  app.get("/openapi.json", (_req, res) => res.json(openapi));

  app.use(notFound());
}
