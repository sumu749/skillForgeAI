"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import {
    LayoutDashboard,
    Sparkles,
    BookOpen,
    User,
    Settings,
    Users,
    BarChart3,
    Shield,
    ChevronsLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const userLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/chat", label: "AI Tutor", icon: Sparkles },
    { href: "/dashboard/ai-features", label: "AI Features", icon: Sparkles },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

const managerLinks = [
    { href: "/dashboard/admin", label: "Manager Overview", icon: Shield },
    {
        href: "/dashboard/admin/courses",
        label: "Manage Courses",
        icon: BookOpen,
    },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Admin Overview", icon: Shield },
    {
        href: "/dashboard/admin/courses",
        label: "Manage Courses",
        icon: BookOpen,
    },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
    isAdmin?: boolean;
    isManager?: boolean;
    mobile?: boolean;
    open?: boolean;
    onClose?: () => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function DashboardSidebar({
    isAdmin,
    isManager,
    mobile = false,
    open = false,
    onClose,
    collapsed = false,
    onToggleCollapse,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    // Students (neither admin nor manager) should not see the Overview page
    let baseUserLinks = userLinks;
    const isStudent = !isAdmin && !isManager;
    if (isStudent) {
        baseUserLinks = userLinks.filter((l) => l.href !== "/dashboard");
    }

    const links = isAdmin
        ? [...baseUserLinks, ...adminLinks]
        : isManager
          ? [...baseUserLinks, ...managerLinks]
          : baseUserLinks;

    const activeLinkHref = links.reduce<string | null>((current, link) => {
        const match =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

        if (!match) {
            return current;
        }

        if (!current || link.href.length > current.length) {
            return link.href;
        }

        return current;
    }, null);

    const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = linkRefs.current[idx + 1] || linkRefs.current[0];
            next?.focus();
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev =
                linkRefs.current[idx - 1] ||
                linkRefs.current[linkRefs.current.length - 1];
            prev?.focus();
        }
        if (e.key === "Home") {
            e.preventDefault();
            linkRefs.current[0]?.focus();
        }
        if (e.key === "End") {
            e.preventDefault();
            linkRefs.current[linkRefs.current.length - 1]?.focus();
        }
    };

    const isRailCollapsed = !mobile && collapsed;

    return (
        <aside
            className={cn(
                "transition-[width] duration-300 ease-smooth",
                mobile
                    ? "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background shadow-xl lg:hidden"
                    : cn(
                          "hidden lg:flex flex-col border-r bg-muted/20 min-h-[calc(100vh-4rem)]",
                          isRailCollapsed ? "w-[4.5rem]" : "w-72",
                      ),
                mobile
                    ? cn(
                          "transition-transform duration-200",
                          open ? "translate-x-0" : "-translate-x-full",
                      )
                    : "",
            )}
        >
            <nav className="flex h-full flex-col gap-4 p-4">
                {!isRailCollapsed && (
                    <div className="rounded-[2rem] border border-border bg-background/90 p-4 shadow-sm animate-fade">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Dashboard
                        </p>
                        <h2 className="mt-2 text-lg font-semibold">
                            Workspace navigation
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Quick access to your learning tools, profile, and
                            admin pages.
                        </p>
                    </div>
                )}
                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mb-2 self-end rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                )}
                <div className="space-y-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const active = activeLinkHref === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => {
                                    if (mobile) onClose?.();
                                }}
                                aria-current={active ? "page" : undefined}
                                title={isRailCollapsed ? link.label : undefined}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ease-smooth",
                                    isRailCollapsed && "justify-center px-0",
                                    active
                                        ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-glow"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {active && !isRailCollapsed && (
                                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/70" />
                                )}
                                <span
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                                        active
                                            ? "bg-white/15"
                                            : "bg-transparent group-hover:bg-background",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                {!isRailCollapsed && (
                                    <span className="truncate">
                                        {link.label}
                                    </span>
                                )}

                                {/* CSS-only tooltip for collapsed rail */}
                                {isRailCollapsed && (
                                    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50">
                                        {link.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {!mobile && onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className={cn(
                            "mt-auto flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                            isRailCollapsed && "justify-center px-0",
                        )}
                        aria-label={
                            collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                    >
                        <ChevronsLeft
                            className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-300 ease-smooth",
                                isRailCollapsed && "rotate-180",
                            )}
                        />
                        {!isRailCollapsed && <span>Collapse</span>}
                    </button>
                )}
            </nav>
        </aside>
    );
}
