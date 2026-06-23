"use client";

import { useState } from "react";
import { isClerkEnabled } from "@/lib/clerk-config";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const isManager = user?.publicMetadata?.role === "manager";

    return (
        <div className="relative flex">
            <DashboardSidebar isAdmin={isAdmin} isManager={isManager} />
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
            <div className="flex-1 p-6 lg:p-8">
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
