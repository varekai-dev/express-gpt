import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      body?: Record<string, unknown>;
      query?: Record<string, unknown>;
      params?: Record<string, unknown>;
    };
  }
}
