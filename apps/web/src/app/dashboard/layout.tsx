"use client";

import { isClerkEnabled } from "@/lib/clerk-config";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

function ClerkDashboardLayout({ children }: { children: React.ReactNode }) {
  const { useUser } = require("@clerk/nextjs") as typeof import("@clerk/nextjs");
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  return (
    <div className="flex">
      <DashboardSidebar isAdmin={isAdmin} />
      <div className="flex-1 p-6 lg:p-8">{children}</div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkEnabled) {
    return (
      <div className="flex">
        <DashboardSidebar isAdmin={false} />
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    );
  }

  return <ClerkDashboardLayout>{children}</ClerkDashboardLayout>;
}
