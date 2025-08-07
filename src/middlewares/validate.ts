import type { RequestHandler } from "express";
import { ZodError,type ZodObject } from "zod";

export function validate({
  body,
  query,
  params,
}: {
  body?: ZodObject<any>;
  query?: ZodObject<any>;
  params?: ZodObject<any>;
}): RequestHandler {
  return (req, _res, next) => {
    try {
      const validatedBody = body ? body.parse(req.body) : undefined;
      const validatedQuery = query ? query.parse(req.query) : undefined;
      const validatedParams = params ? params.parse(req.params) : undefined;
      req.validated = {
        body: validatedBody,
        query: validatedQuery,
        params: validatedParams,
      };
      next();
    } catch (err) {
      if (err instanceof ZodError) next(err);
      else next(new Error("Validation failed"));
    }
  };
}
