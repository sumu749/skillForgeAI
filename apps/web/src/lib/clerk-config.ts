export const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export const isClerkEnabled =
  !!clerkPublishableKey &&
  !clerkPublishableKey.includes("your-clerk") &&
  !clerkPublishableKey.includes("placeholder");
