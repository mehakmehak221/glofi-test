"use client";

import { setCookie } from "@/utils/cookieUtils";

const TOKEN_KEYS = new Set(["accessToken", "access_token", "token", "authToken", "jwt"]);

function isJwtLike(value: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/.test(value) || value.length > 20;
}

function findTokenDeep(value: unknown, seen = new WeakSet<object>()): string | null {
  if (typeof value === "string") {
    return isJwtLike(value) ? value : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  if (seen.has(value as object)) return null;
  seen.add(value as object);

  if (Array.isArray(value)) {
    for (const item of value) {
      const token = findTokenDeep(item, seen);
      if (token) return token;
    }
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    const current = record[key];
    if (TOKEN_KEYS.has(key) && typeof current === "string" && current.trim()) {
      return current;
    }
  }

  for (const key of Object.keys(record)) {
    const current = record[key];
    if (typeof current === "string" && key.toLowerCase().includes("token") && current.trim()) {
      return current;
    }
  }

  for (const key of Object.keys(record)) {
    const token = findTokenDeep(record[key], seen);
    if (token) return token;
  }

  return null;
}

export function extractAccessToken(result: unknown): string | null {
  return findTokenDeep(result);
}

export function persistAuthSession(token: string, role?: string): void {
  if (typeof window === "undefined") return;

  setCookie("access_token", token);
  localStorage.setItem("access_token", token);
  localStorage.setItem("isLoggedIn", "true");
  setCookie("isLoggedIn", "true");

  if (role) {
    localStorage.setItem("userType", role);
  }
}
