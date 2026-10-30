import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type AdminIdentity = {
  userId: string;
  email: string;
  displayName: string;
};

const COOKIE_NAME = "yan_admin_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("后台会话密钥尚未配置");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function createAdminSession(identity: AdminIdentity) {
  const payload = Buffer.from(
    JSON.stringify({ ...identity, expiresAt: Date.now() + MAX_AGE * 1000 }),
  ).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getAdminSession(): Promise<AdminIdentity | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as
      AdminIdentity & { expiresAt: number };
    if (parsed.expiresAt < Date.now() || !parsed.email || !parsed.userId) return null;
    return {
      userId: parsed.userId,
      email: parsed.email,
      displayName: parsed.displayName,
    };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export function isValidAccessCode(value: unknown) {
  const expected = process.env.ADMIN_ACCESS_CODE ?? "";
  if (typeof value !== "string" || !expected) return false;
  const actualBuffer = Buffer.from(value.trim());
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
