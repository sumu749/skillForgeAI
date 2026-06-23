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

    return (
        <aside
            className={cn(
                mobile
                    ? "fixed inset-y-0 left-0 z-50 w-72 border-r bg-muted/95 shadow-xl lg:hidden transition-transform duration-200"
                    : "hidden lg:flex w-64 flex-col border-r bg-muted/20 min-h-[calc(100vh-4rem)]",
                mobile ? (open ? "translate-x-0" : "-translate-x-full") : "",
            )}
        >
            <nav className="flex h-full flex-col gap-1 p-4">
                {mobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mb-4 self-end rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                )}
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => {
                                if (mobile) onClose?.();
                            }}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
