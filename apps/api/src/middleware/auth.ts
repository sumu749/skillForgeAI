import { clerkMiddleware, requireAuth } from "@clerk/express";
import { config } from "../config";

function isClerkConfigured(): boolean {
  const secret = config.clerkSecretKey;
  const publishable = config.clerkPublishableKey;
  if (!secret || !publishable) return false;
  if (secret.includes("your-clerk") || secret.includes("placeholder")) return false;
  if (publishable.includes("your-clerk") || publishable.includes("placeholder")) return false;
  return true;
}

export function setupAuth() {
  if (!isClerkConfigured()) {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }
  return clerkMiddleware();
}

export function optionalAuth() {
  if (!isClerkConfigured()) {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }
  return clerkMiddleware();
}

export function requireClerkAuth() {
  if (!isClerkConfigured()) {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }
  return requireAuth();
}
