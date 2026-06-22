"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { isClerkEnabled } from "@/lib/clerk-config";
import { ClerkNavbarAuth } from "./navbar-clerk";

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
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/help", label: "Help" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const links = isClerkEnabled
        ? null
        : [...publicLinks, ...authLinks].filter(
              (link, index, self) =>
                  self.findIndex((item) => item.href === link.href) === index,
          );

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl"
                >
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span>SkillForge AI</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {isClerkEnabled ? (
                        <ClerkNavbarAuth variant="links" />
                    ) : (
                        links?.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ||
                                        pathname.startsWith(link.href + "/")
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                )}
                            >
                                {link.label}
                            </Link>
                        ))
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {isClerkEnabled ? (
                        <ClerkNavbarAuth variant="auth" />
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <Button size="sm">Sign In</Button>
                            </Link>
                            <Link href="/sign-up" className="hidden sm:block">
                                <Button size="sm" variant="secondary">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t md:hidden">
                    <nav className="container flex flex-col gap-2 py-4">
                        {(links || publicLinks).map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-2 py-2 text-sm font-medium hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
