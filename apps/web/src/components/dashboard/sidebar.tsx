"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Sparkles,
    BookOpen,
    User,
    Settings,
    Users,
    BarChart3,
    Shield,
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
}

export function DashboardSidebar({
    isAdmin,
    isManager,
    mobile = false,
    open = false,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const links = isAdmin
        ? [...userLinks, ...adminLinks]
        : isManager
          ? [...userLinks, ...managerLinks]
          : userLinks;

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

    return (
        <aside
            className={cn(
                mobile
                    ? "fixed inset-y-0 left-0 z-50 w-72 border-r bg-muted/95 shadow-xl lg:hidden transition-transform duration-200"
                    : "hidden lg:flex w-72 flex-col border-r bg-muted/20 min-h-[calc(100vh-4rem)]",
                mobile ? (open ? "translate-x-0" : "-translate-x-full") : "",
            )}
        >
            <nav className="flex h-full flex-col gap-4 p-4">
                <div className="rounded-[2rem] border border-border bg-background/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Dashboard
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                        Workspace navigation
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Quick access to your learning tools, profile, and admin
                        pages.
                    </p>
                </div>
                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mb-2 self-end rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                )}
                <div className="space-y-2">
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
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}
