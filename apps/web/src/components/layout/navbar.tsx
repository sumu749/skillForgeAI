"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/help", label: "Help" },
];

const dropdownSections = [
    {
        title: "Learning",
        items: [
            {
                href: "/explore",
                label: "Explore courses",
                description: "Browse all AI learning paths",
            },
            {
                href: "/dashboard/chat",
                label: "AI Tutor",
                description: "Get guided help and study support",
            },
            {
                href: "/dashboard/profile",
                label: "Your profile",
                description: "Manage your account and progress",
            },
        ],
    },
    {
        title: "Resources",
        items: [
            {
                href: "/help",
                label: "Help center",
                description: "Find answers and support articles",
            },
            {
                href: "/blog",
                label: "Blog",
                description: "Read the latest AI training tips",
            },
            {
                href: "/about",
                label: "About SkillForge",
                description: "Learn what makes our platform special",
            },
        ],
    },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const links = isClerkEnabled
        ? null
        : [...publicLinks, ...authLinks].filter(
              (link, index, self) =>
                  self.findIndex((item) => item.href === link.href) === index,
          );

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

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
                        <>
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                                >
                                    Explore menu
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-2 w-[28rem] overflow-hidden rounded-3xl border border-border bg-background p-4 shadow-xl">
                                        <div className="grid gap-6 lg:grid-cols-2">
                                            {dropdownSections.map((section) => (
                                                <div key={section.title}>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                                        {section.title}
                                                    </p>
                                                    <div className="mt-3 space-y-2">
                                                        {section.items.map(
                                                            (item) => (
                                                                <Link
                                                                    key={
                                                                        item.href
                                                                    }
                                                                    href={
                                                                        item.href
                                                                    }
                                                                    onClick={() =>
                                                                        setMenuOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                    className="block rounded-2xl px-3 py-2 transition-colors hover:bg-muted"
                                                                >
                                                                    <p className="font-medium">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 rounded-2xl bg-secondary/5 p-4">
                                            <p className="text-sm font-semibold">
                                                New learner?
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Create an account to save
                                                progress and access your
                                                personalized dashboard.
                                            </p>
                                            <Link
                                                href="/sign-up"
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                                            >
                                                Start for free
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {links
                                ?.filter((link) => link.label !== "Explore")
                                .map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary",
                                            pathname === link.href ||
                                                pathname.startsWith(
                                                    link.href + "/",
                                                )
                                                ? "text-primary"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                        </>
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
