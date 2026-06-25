"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Manage platform users and roles
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading}
                >
                    {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                            Unable to load Clerk users. Showing demo data
                            instead.
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2">
                                        Name
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Role
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-6 px-2 text-center text-sm text-muted-foreground"
                                        >
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : (
                                    (data || fallbackUsers).map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 px-2 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="py-3 px-2">
                                                {user.email}
                                            </td>
                                            <td className="py-3 px-2 capitalize">
                                                {user.role}
                                            </td>
                                            <td className="py-3 px-2 text-muted-foreground">
                                                {user.joined}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
