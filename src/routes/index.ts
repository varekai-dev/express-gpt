import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { buildOpenApi } from "../swagger/openapi";
import { userRouter } from "./users";
import { notFound } from "../middlewares/error-handler";

export function registerRoutes({ app }: { app: Express }) {
  app.use("/api/users", userRouter());

  const openapi = buildOpenApi();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  app.get("/openapi.json", (_req, res) => res.json(openapi));

  app.use(notFound());
}
