"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";
import { isClerkEnabled } from "@/lib/clerk-config";
import type { Course } from "@skillforge/shared";

import { useUser } from "@clerk/nextjs";

function ClerkProfile() {
    const { user } = useUser();
    const [editing, setEditing] = useState(false);
    const initialName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
    const [name, setName] = useState(initialName);
    const [saving, setSaving] = useState(false);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const trimmedName = name.trim();
        const [firstName, ...rest] = trimmedName.split(" ");
        const lastName = rest.join(" ");

        try {
            setSaving(true);
            await user.update({ firstName, lastName });
            setEditing(false);
        } catch (err) {
            console.error("Failed to update user", err);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <form onSubmit={onSave} className="col-span-2">
                <div className="mb-4">
                    <label className="text-sm text-muted-foreground">
                        Name
                    </label>
                    {editing ? (
                        <div className="flex gap-2 mt-1">
                            <input
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setEditing(false);
                                    setName(user?.fullName || "");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">
                                {user?.fullName || "—"}
                            </p>
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                            {user?.primaryEmailAddress?.emailAddress || "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium capitalize">
                            {(user?.publicMetadata?.role as string) || "user"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Member Since
                        </p>
                        <p className="font-medium">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "—"}
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
}

export default function ProfilePage() {
    const { data } = useQuery({
        queryKey: ["my-courses"],
        queryFn: async () => {
            const res = await api.get("/courses", {
                params: { limit: 3, sort: "popular" },
            });
            return res.data.data as Course[];
        },
    });

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {isClerkEnabled ? (
                            <ClerkProfile />
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="font-medium">Demo Student</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="font-medium">
                                        demo@skillforge.ai
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Role
                                    </p>
                                    <p className="font-medium">student</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Note
                                    </p>
                                    <p className="font-medium text-sm">
                                        Configure Clerk keys for real auth
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recommended Courses</CardTitle>
                    <Link href="/explore">
                        <Button variant="outline" size="sm">
                            Browse All
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
