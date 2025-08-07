"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
function validate({ body, query, params, }) {
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
        }
        catch (err) {
            if (err instanceof zod_1.ZodError)
                next(err);
            else
                next(new Error("Validation failed"));
        }
    };
}
