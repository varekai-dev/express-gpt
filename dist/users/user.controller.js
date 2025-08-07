"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = exports.getUserByIdController = exports.listUsersController = void 0;
const user_repository_1 = require("./user.repository");
const user_service_1 = require("./user.service");
const repo = (0, user_repository_1.createUserRepository)();
const svc = (0, user_service_1.createUserService)({ repo });
const listUsersController = async (req, res, next) => {
    try {
        const limit = Number(req.validated?.query?.limit ?? 20);
        const users = await svc.listUsers({ limit });
        res.json({ users });
    }
    catch (err) {
        next(err);
    }
};
exports.listUsersController = listUsersController;
const getUserByIdController = async (req, res, next) => {
    try {
        const { id } = (req.validated?.params ?? {});
        const user = await svc.getUserById({ id });
        res.json({ user });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserByIdController = getUserByIdController;
const createUserController = async (req, res, next) => {
    try {
        const { email, name } = (req.validated?.body ?? {});
        const user = await svc.createUser({ email, name });
        res.status(201).json({ user });
    }
    catch (err) {
        next(err);
    }
};
exports.createUserController = createUserController;
