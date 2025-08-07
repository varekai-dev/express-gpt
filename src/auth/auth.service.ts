// bcryptjs ships types via its index.d.ts, but TS may not resolve defaults correctly in some configs
// Use require type to avoid missing types error in some environments
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcryptjs") as typeof import("bcryptjs");
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { getEnv } from "../utils/env";

export type Role = "user" | "admin";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: Role;
};

export function hashPassword({
  password,
}: {
  password: string;
}): Promise<string> {
  if (!password || password.length < 6)
    return Promise.reject(new Error("Password must be at least 6 characters"));
  return bcrypt.hash(password, 10);
}

export function verifyPassword({
  password,
  passwordHash,
}: {
  password: string;
  passwordHash: string;
}): Promise<boolean> {
  if (!passwordHash) return Promise.resolve(false);
  return bcrypt.compare(password, passwordHash);
}

export function createAccessToken({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: Role;
}): string {
  const env = getEnv();
  const payload: AuthTokenPayload = { sub: userId, email, role };
  const secret: Secret = env.jwtSecret;
  const expiresIn = env.jwtExpiresIn as unknown as SignOptions["expiresIn"];
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken({
  token,
}: {
  token: string;
}): AuthTokenPayload {
  const env = getEnv();
  const secret: Secret = env.jwtSecret;
  const decoded = jwt.verify(token, secret);
  const payload = decoded as AuthTokenPayload;
  return payload;
}
