import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isClerkEnabled } from "@/lib/clerk-config";

export default function SignUpPage() {
    if (!isClerkEnabled) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
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
        <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-muted-foreground">
                    Start learning with SkillForge AI today
                </p>
            </div>
            <SignUp
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
