"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isClerkEnabled } from "@/lib/clerk-config";

export default function SignInPage() {
    if (!isClerkEnabled) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
                <h1 className="text-2xl font-bold mb-2">Sign In</h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Add your Clerk keys to{" "}
                    <code className="text-sm">apps/web/.env.local</code> to
                    enable authentication. You can still use the dashboard and
                    AI tutor without signing in during development.
                </p>
                <Link href="/dashboard">
                    <Button>Continue to Dashboard</Button>
                </Link>
            </div>
        );
    }

    const fillDemo = () => {
        const emailInput = document.querySelector<HTMLInputElement>(
            'input[name="identifier"]',
        );
        const passwordInput = document.querySelector<HTMLInputElement>(
            'input[name="password"]',
        );
        if (emailInput) {
            emailInput.value = "demo@skillforge.ai";
            emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (passwordInput) {
            passwordInput.value = "DemoPass123!";
            passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
    };

    return (
        <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">
                    Sign in to continue your learning journey
                </p>
            </div>
            {process.env.NODE_ENV === "development" && (
                <Button variant="outline" className="mb-4" onClick={fillDemo}>
                    Fill Demo Credentials (Dev)
                </Button>
            )}
            <SignIn
                redirectUrl="/dashboard"
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-lg rounded-xl",
                    },
                }}
            />
        </div>
    );
}
