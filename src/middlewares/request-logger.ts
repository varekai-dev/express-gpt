import type { RequestHandler } from "express";
import pino from "pino";
import pretty from "pino-pretty";

export function requestLogger(): RequestHandler {
  const stream = pretty({ translateTime: true, ignore: "pid,hostname" });
  const logger = pino({}, stream);
  return (req, res, next) => {
    const started = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - started;
      logger.info(
        {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          ms,
        },
        "request"
      );
    });
    next();
  };
}
