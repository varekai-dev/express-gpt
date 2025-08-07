import mongoose, { Schema, model, type InferSchemaType, Types } from "mongoose";
import type { User } from "./user.schemas";
import { initMongo } from "../services/mongo";

const userSchema = new Schema(
  {
    // MongoDB will provide _id automatically
    email: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { collection: "users" }
);

type UserDoc = InferSchemaType<typeof userSchema>;
const UserModel = model<UserDoc>("User", userSchema);

export function createUserRepository() {
  async function list({ limit }: { limit: number }): Promise<User[]> {
    await initMongo();
    const docs = await UserModel.find({}, { __v: 0 })
      .limit(limit)
      .lean()
      .exec();
    // Cast _id ObjectId to string
    return (docs as any[]).map((d) => ({
      ...d,
      _id: String(d._id),
    })) as unknown as User[];
  }

  async function findById({ id }: { id: string }): Promise<User | undefined> {
    await initMongo();
    if (!Types.ObjectId.isValid(id)) return undefined;
    const doc = await UserModel.findById(id, { __v: 0 }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, _id: String(doc._id) } as any as User;
  }

  async function create({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<User> {
    await initMongo();
    const now = new Date().toISOString();
    const doc = await UserModel.create({ email, name, createdAt: now });
    const plain = doc.toObject();
    return { ...plain, _id: String(plain._id) } as any as User;
  }

  return { list, findById, create };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
