"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = createUserService;
const error_handler_1 = require("../middlewares/error-handler");
function createUserService({ repo }) {
    async function listUsers({ limit }) {
        return repo.list({ limit });
    }
    async function getUserById({ id }) {
        const user = await repo.findById({ id });
        if (!user)
            throw new error_handler_1.AppError("User not found", {
                status: 404,
                code: "USER_NOT_FOUND",
            });
        return user;
    }
    async function createUser({ email, name, }) {
        // Rely on unique index; attempt insert and map duplicate error if occurs
        try {
            return await repo.create({ email, name });
        }
        catch (err) {
            const message = String(err?.message ?? "");
            if (message.includes("E11000") || message.includes("duplicate key"))
                throw new error_handler_1.AppError("Email already exists", {
                    status: 409,
                    code: "EMAIL_EXISTS",
                });
            throw err;
        }
    }
    return { listUsers, getUserById, createUser };
}
