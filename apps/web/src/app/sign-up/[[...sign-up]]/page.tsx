import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isClerkEnabled } from "@/lib/clerk-config";

export default function SignUpPage() {
    if (!isClerkEnabled) {
        return (
            <div className="relative container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-mesh -z-10" />
                <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Configure Clerk keys in{" "}
                    <code className="text-sm">apps/web/.env.local</code> to
                    enable registration.
                </p>
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-muted-foreground">
                    Start learning with SkillForge AI today
                </p>
            </div>
            <div className="animate-in-up" style={{ animationDelay: "100ms" }}>
                <SignUp
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
