import express from "express";
import { json, urlencoded } from "express";

import { errorHandler } from "./middlewares/error-handler";
import { requestLogger } from "./middlewares/request-logger";
import { initMongo } from "./services/mongo";
import { registerRoutes } from "./routes";

export function createApp() {
  const app = express();

  app.use(urlencoded({ extended: false }));
  app.use(json({ limit: "1mb" }));
  app.use(requestLogger());

  registerRoutes({ app });

  app.use(errorHandler());
  return app;
}

export type CreateApp = ReturnType<typeof createApp>;
