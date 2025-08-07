"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = userRouter;
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const user_controller_1 = require("../users/user.controller");
const user_schemas_1 = require("../users/user.schemas");
function userRouter() {
    const r = (0, express_1.Router)();
    r.get("/", (0, validate_1.validate)({ query: user_schemas_1.ListUsersQuerySchema }), user_controller_1.listUsersController);
    r.get("/:id", (0, validate_1.validate)({ params: user_schemas_1.GetUserParamsSchema }), user_controller_1.getUserByIdController);
    r.post("/", (0, validate_1.validate)({ body: user_schemas_1.CreateUserBodySchema }), user_controller_1.createUserController);
    return r;
}
