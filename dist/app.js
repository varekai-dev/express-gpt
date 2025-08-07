"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const routes_1 = require("./routes");
const error_handler_1 = require("./middlewares/error-handler");
const request_logger_1 = require("./middlewares/request-logger");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, express_2.urlencoded)({ extended: false }));
    app.use((0, express_2.json)({ limit: "1mb" }));
    app.use((0, request_logger_1.requestLogger)());
    (0, routes_1.registerRoutes)({ app });
    app.use((0, error_handler_1.errorHandler)());
    return app;
}
