"use client";

import { useEffect, useState } from "react";
import { isClerkEnabled } from "@/lib/clerk-config";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useUser();
    const clerk = useClerk();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const isManager = user?.publicMetadata?.role === "manager";

    const SIDEBAR_COLLAPSE_KEY = "skillforge:sidebar-collapsed";

    useEffect(() => {
        const stored = window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
        if (stored) setCollapsed(stored === "true");
    }, []);

    const toggleCollapse = () => {
        setCollapsed((prev) => {
            const next = !prev;
            window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(next));
            return next;
        });
    };

    return (
        <div className="relative flex">
            <DashboardSidebar
                isAdmin={isAdmin}
                isManager={isManager}
                collapsed={collapsed}
                onToggleCollapse={toggleCollapse}
            />
            <DashboardSidebar
                isAdmin={isAdmin}
                isManager={isManager}
                mobile
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
            {mobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close mobile menu"
                    title="Close mobile menu"
                />
            )}
            <div className="flex-1 p-6 lg:p-8 min-w-0">
                <header className="mb-4 flex items-center justify-between">
                    <div />
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-sm text-muted-foreground">
                            {user?.fullName}
                        </div>
                        <div className="relative">
                            <details className="relative">
                                <summary className="flex items-center gap-2 cursor-pointer list-none">
                                    <img
                                        src={
                                            user?.imageUrl ||
                                            "/avatar-placeholder.svg"
                                        }
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/30 transition-all"
                                    />
                                </summary>
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-card p-2 shadow-lg animate-in-up z-50">
                                    <Link
                                        href="/dashboard/profile"
                                        className="block px-2 py-1 text-sm hover:bg-accent/10 rounded"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => clerk.signOut()}
                                        className="w-full text-left px-2 py-1 text-sm hover:bg-accent/10 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </details>
                        </div>
                    </div>
                </header>
                <div className="mb-4 flex items-center justify-between lg:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open mobile menu"
                        title="Open mobile menu"
                    >
                        <Menu className="h-4 w-4" />
                        Menu
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
