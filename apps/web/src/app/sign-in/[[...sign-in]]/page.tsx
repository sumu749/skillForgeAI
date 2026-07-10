"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isClerkEnabled } from "@/lib/clerk-config";

export default function SignInPage() {
    if (!isClerkEnabled) {
        return (
            <div className="relative container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-mesh -z-10" />
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
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-12 overflow-hidden">
            <div className="absolute inset-0 bg-mesh -z-10" />
            <Link
                href="/"
                className="mb-6 flex items-center gap-2 font-bold text-xl"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
                    <Sparkles className="h-4.5 w-4.5 text-white" />
                </span>
                SkillForge AI
            </Link>
            <div className="mb-6 text-center animate-in-up">
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">
                    Sign in to continue your learning journey
                </p>
            </div>
            <Button
                variant="outline"
                className="mb-4 shadow-xs"
                onClick={fillDemo}
            >
                Fill Demo Credentials
            </Button>
            <div className="animate-in-up" style={{ animationDelay: "100ms" }}>
                <SignIn
                    redirectUrl="/dashboard"
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-xl rounded-2xl border border-border",
                        },
                    }}
                />
            </div>
        </div>
    );
}
