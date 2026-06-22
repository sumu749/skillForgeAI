import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isClerkEnabled } from "@/lib/clerk-config";

export default async function middleware(req: NextRequest) {
  if (!isClerkEnabled) {
    return NextResponse.next();
  }

  const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");

  const isPublicRoute = createRouteMatcher([
    "/",
    "/explore",
    "/courses(.*)",
    "/about",
    "/contact",
    "/blog",
    "/help",
    "/privacy",
    "/terms",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ]);

  const handler = clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  });

  return handler(req, {} as never);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
