"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: string;
    joined: string;
}

const fallbackUsers: UserRecord[] = [
    {
        id: "demo-1",
        name: "Jordan Lee",
        email: "jordan@example.com",
        role: "student",
        joined: "Jan 2026",
    },
    {
        id: "demo-2",
        name: "Priya Sharma",
        email: "priya@example.com",
        role: "student",
        joined: "Feb 2026",
    },
    {
        id: "demo-3",
        name: "Admin User",
        email: "admin@skillforge.ai",
        role: "admin",
        joined: "Dec 2025",
    },
    {
        id: "demo-4",
        name: "Emily Watson",
        email: "emily@example.com",
        role: "student",
        joined: "Mar 2026",
    },
    {
        id: "demo-5",
        name: "Chris Anderson",
        email: "chris@example.com",
        role: "student",
        joined: "Apr 2026",
    },
];

const roleStyles: Record<string, string> = {
    admin: "bg-destructive/10 text-destructive",
    manager: "bg-secondary/10 text-secondary",
    student: "bg-primary/10 text-primary",
};

function initialsOf(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export default function AdminUsersPage() {
    const {
        data = fallbackUsers,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            try {
                const res = await api.get("/users");
                return (res.data?.data ?? fallbackUsers) as UserRecord[];
            } catch (err) {
                console.error(err);
                return fallbackUsers;
            }
        },
        initialData: fallbackUsers,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage platform users and roles
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="gap-1.5 shadow-xs"
                >
                    <RefreshCw
                        className={cn(
                            "h-3.5 w-3.5",
                            isLoading && "animate-spin",
                        )}
                    />
                    {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {error && (
                        <div className="mx-6 mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                            Unable to load Clerk users. Showing demo data
                            instead.
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                                <tr className="border-b border-border/70">
                                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Role
                                    </th>
                                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <tr
                                              key={i}
                                              className="border-b last:border-0"
                                          >
                                              <td className="py-3.5 px-6">
                                                  <div className="flex items-center gap-3">
                                                      <Skeleton className="h-8 w-8 rounded-full" />
                                                      <Skeleton className="h-4 w-28" />
                                                  </div>
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-4 w-36" />
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-5 w-16 rounded-full" />
                                              </td>
                                              <td className="py-3.5 px-6">
                                                  <Skeleton className="h-4 w-20" />
                                              </td>
                                          </tr>
                                      ))
                                    : (data || fallbackUsers).map((user) => (
                                          <tr
                                              key={user.id}
                                              className="border-b last:border-0 transition-colors hover:bg-muted/40"
                                          >
                                              <td className="py-3.5 px-6">
                                                  <div className="flex items-center gap-3">
                                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold">
                                                          {initialsOf(
                                                              user.name,
                                                          )}
                                                      </div>
                                                      <span className="font-medium">
                                                          {user.name}
                                                      </span>
                                                  </div>
                                              </td>
                                              <td className="py-3.5 px-4 text-muted-foreground">
                                                  {user.email}
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <span
                                                      className={cn(
                                                          "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                                                          roleStyles[
                                                              user.role
                                                          ] ??
                                                              "bg-muted text-muted-foreground",
                                                      )}
                                                  >
                                                      {user.role}
                                                  </span>
                                              </td>
                                              <td className="py-3.5 px-6 text-muted-foreground">
                                                  {user.joined}
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
