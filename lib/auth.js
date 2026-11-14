import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import connectToMongo from "./mongodb";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "fixmate_session";
const SESSION_LENGTH = 7 * 24 * 60 * 60 * 1000;

export async function getAuthCollections() {
  const client = await connectToMongo();
  const database = client.db(process.env.MONGODB_DB || "fixmate");
  return { users: database.collection("users"), sessions: database.collection("sessions") };
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, keyHex] = storedHash.split(":");
  const storedKey = Buffer.from(keyHex, "hex");
  const suppliedKey = await scrypt(password, salt, 64);
  return storedKey.length === suppliedKey.length && timingSafeEqual(storedKey, suppliedKey);
}

export function safeCompare(first, second) {
  const firstBuffer = Buffer.from(String(first));
  const secondBuffer = Buffer.from(String(second));
  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

export async function findUserByEmail(email) {
  const { users } = await getAuthCollections();
  return users.findOne({ email });
}

export async function createClientAccount({ name, email, passwordHash }) {
  const { users } = await getAuthCollections();
  await users.createIndex({ email: 1 }, { unique: true });
  const result = await users.insertOne({ name, email, passwordHash, role: "client", createdAt: new Date() });
  return { _id: result.insertedId, name, email, role: "client" };
}

export async function saveAdminAccount(email, passwordHash) {
  const { users } = await getAuthCollections();
  await users.createIndex({ email: 1 }, { unique: true });
  await users.updateOne(
    { email },
    { $set: { name: "FixMate Admin", email, passwordHash, role: "admin" }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  return users.findOne({ email });
}

export async function startSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_LENGTH);
  const { sessions } = await getAuthCollections();
  await sessions.createIndex("expiresAt", { expireAfterSeconds: 0 });
  await sessions.deleteMany({ expiresAt: { $lt: new Date() } });
  await sessions.insertOne({ tokenHash: createHash("sha256").update(token).digest("hex"), userId: new ObjectId(userId), expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt });
}

export async function endSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const { sessions } = await getAuthCollections();
    await sessions.deleteOne({ tokenHash });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { users, sessions } = await getAuthCollections();
  const session = await sessions.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await users.findOne({ _id: session.userId }, { projection: { name: 1, email: 1, role: 1 } });
  if (!user) return null;
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}

export async function requireRole(role) {
  let user = null;
  try { user = await getCurrentUser(); } catch { redirect("/login"); }
  if (!user) redirect("/login");
  if (role && user.role !== role) redirect(user.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
  return user;
}
