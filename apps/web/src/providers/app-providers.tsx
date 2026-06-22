"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { clerkPublishableKey, isClerkEnabled } from "@/lib/clerk-config";

export function AppProviders({ children }: { children: React.ReactNode }) {
  if (!isClerkEnabled) {
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>;
}
