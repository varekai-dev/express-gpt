"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRepository = createUserRepository;
const mongoose_1 = require("mongoose");
const mongo_1 = require("../services/mongo");
const userSchema = new mongoose_1.Schema({
    // MongoDB will provide _id automatically
    email: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: String, required: true },
}, { collection: "users" });
const UserModel = (0, mongoose_1.model)("User", userSchema);
function createUserRepository() {
    async function list({ limit }) {
        await (0, mongo_1.initMongo)();
        const docs = await UserModel.find({}, { __v: 0 })
            .limit(limit)
            .lean()
            .exec();
        // Cast _id ObjectId to string
        return docs.map((d) => ({
            ...d,
            _id: String(d._id),
        }));
    }
    async function findById({ id }) {
        await (0, mongo_1.initMongo)();
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return undefined;
        const doc = await UserModel.findById(id, { __v: 0 })
            .lean()
            .exec();
        if (!doc)
            return undefined;
        return { ...doc, _id: String(doc._id) };
    }
    async function create({ email, name, }) {
        await (0, mongo_1.initMongo)();
        const now = new Date().toISOString();
        const doc = await UserModel.create({ email, name, createdAt: now });
        const plain = doc.toObject();
        return { ...plain, _id: String(plain._id) };
    }
    return { list, findById, create };
}
