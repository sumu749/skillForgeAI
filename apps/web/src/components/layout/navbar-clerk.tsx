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
    const isManager = user?.publicMetadata?.role === "manager";

    const signedInLinks =
        isAdmin || isManager
            ? [...authLinks, { href: "/dashboard/admin", label: "Admin" }]
            : authLinks;

    const activeLinkHref = signedInLinks.reduce<string | null>(
        (current, link) => {
            const match =
                pathname === link.href || pathname.startsWith(link.href + "/");
            if (!match) {
                return current;
            }

            if (!current || link.href.length > current.length) {
                return link.href;
            }

            return current;
        },
        null,
    );

    if (variant === "auth") {
        return (
            <>
                <SignedOut>
                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
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
                {publicLinks.map((link) => {
                    const isActive =
                        link.href === "/"
                            ? pathname === "/"
                            : pathname === link.href ||
                              pathname.startsWith(link.href + "/");
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground",
                            )}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </SignedOut>
            <SignedIn>
                {signedInLinks.map((link) => {
                    const isActive = activeLinkHref === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground",
                            )}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </SignedIn>
        </>
    );
}
