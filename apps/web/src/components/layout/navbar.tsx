"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Sparkles, X, BookOpen, HelpCircle, FileText, Info, User } from "lucide-react";
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
                icon: BookOpen,
            },
            {
                href: "/dashboard/chat",
                label: "AI Tutor",
                description: "Get guided help and study support",
                icon: Sparkles,
            },
            {
                href: "/dashboard/profile",
                label: "Your profile",
                description: "Manage your account and progress",
                icon: User,
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
                icon: HelpCircle,
            },
            {
                href: "/blog",
                label: "Blog",
                description: "Read the latest AI training tips",
                icon: FileText,
            },
            {
                href: "/about",
                label: "About SkillForge",
                description: "Learn what makes our platform special",
                icon: Info,
            },
        ],
    },
];

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const links = isClerkEnabled
        ? null
        : [...publicLinks, ...authLinks].filter(
              (link, index, self) =>
                  self.findIndex((item) => item.href === link.href) === index,
          );

    const activeLinkHref = links
        ? links.reduce<string | null>((current, link) => {
              const match =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
              if (!match) {
                  return current;
              }

              if (!current || link.href.length > current.length) {
                  return link.href;
              }

              return current;
          }, null)
        : null;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

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
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 ease-smooth",
                scrolled
                    ? "border-b bg-background/80 backdrop-blur-lg shadow-sm py-1.5"
                    : "border-b border-transparent bg-background/40 backdrop-blur-sm py-3",
            )}
        >
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6">
                <Link href="/" className="group flex items-center gap-2.5 font-bold text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md transition-transform duration-300 ease-smooth group-hover:scale-105 group-hover:rotate-3">
                        <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
                    </span>
                    <span className="tracking-tight">SkillForge AI</span>
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
                                .map((link) => {
                                    const isActive =
                                        activeLinkHref === link.href;
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
                        {(() => {
                            const mobileLinks = links || publicLinks;
                            const activeMobileLinkHref = mobileLinks.reduce<
                                string | null
                            >((current, link) => {
                                const match =
                                    pathname === link.href ||
                                    pathname.startsWith(link.href + "/");
                                if (!match) {
                                    return current;
                                }

                                if (
                                    !current ||
                                    link.href.length > current.length
                                ) {
                                    return link.href;
                                }

                                return current;
                            }, null);

                            return mobileLinks.map((link) => {
                                const isActive =
                                    activeMobileLinkHref === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "px-2 py-2 text-sm font-medium rounded-xl transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:text-primary hover:bg-muted",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            });
                        })()}
                    </nav>
                </div>
            )}
        </header>
    );
}
