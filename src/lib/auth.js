import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

/**
 * Reads the JWT from the httpOnly cookie (preferred) or Authorization header (fallback).
 * Returns { decoded, error }
 */
export async function verifyAuth(req) {
  let token = null;

  // 1. Try httpOnly cookie first
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("nestld_token");
  if (cookieToken?.value) {
    token = cookieToken.value;
  }

  // 2. Fallback: Authorization: Bearer header (for backwards compat)
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return { decoded: null, error: "No auth token provided" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { decoded, error: null };
  } catch (e) {
    return { decoded: null, error: "Invalid or expired token" };
  }
}

/**
 * Creates a signed JWT for the given user.
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Returns the Set-Cookie header string for persisting the JWT as an httpOnly cookie.
 */
export function buildAuthCookie(token) {
  // 7 days in seconds
  const maxAge = 7 * 24 * 60 * 60;
  return `nestld_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

/**
 * Returns the Set-Cookie header string that clears the auth cookie on logout.
 */
export function clearAuthCookie() {
  return "nestld_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax";
}
