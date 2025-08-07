"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_1 = require("../swagger/openapi");
const users_1 = require("./users");
const error_handler_1 = require("../middlewares/error-handler");
function registerRoutes({ app }) {
    app.use("/api/users", (0, users_1.userRouter)());
    const openapi = (0, openapi_1.buildOpenApi)();
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi));
    app.get("/openapi.json", (_req, res) => res.json(openapi));
    app.use((0, error_handler_1.notFound)());
}
