"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
];

const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/chat", label: "AI Tutor" },
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/help", label: "Help" },
];

export function ClerkNavbarAuth({ variant }: { variant: "links" | "auth" }) {
    const pathname = usePathname();
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    if (variant === "auth") {
        return (
            <>
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button size="sm">Sign In</Button>
                    </SignInButton>
                    <Link href="/sign-up" className="hidden sm:block">
                        <Button size="sm" variant="secondary">
                            Get Started
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </>
        );
    }

    return (
        <>
            <SignedOut>
                {publicLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === link.href
                                ? "text-primary"
                                : "text-muted-foreground",
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </SignedOut>
            <SignedIn>
                {authLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.startsWith(link.href) &&
                                link.href !== "/explore"
                                ? "text-primary"
                                : "text-muted-foreground",
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
                {isAdmin && (
                    <Link
                        href="/dashboard/admin"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.startsWith("/dashboard/admin")
                                ? "text-primary"
                                : "text-muted-foreground",
                        )}
                    >
                        Admin
                    </Link>
                )}
            </SignedIn>
        </>
    );
}
