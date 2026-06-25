"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import type { Course } from "@skillforge/shared";

export default function MyCoursesPage() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const isAuthenticated = isLoaded && isSignedIn;

    const {
        data = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["my-enrolled"],
        queryFn: async () => {
            if (!isSignedIn) {
                return [] as Course[];
            }

            const token = await getToken();
            const res = await api.get("/courses/enrolled", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return (res.data?.data ?? []) as Course[];
        },
        enabled: isAuthenticated,
        refetchOnWindowFocus: true,
        refetchOnMount: "always",
        staleTime: 1000 * 60 * 5,
        initialData: [],
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground mb-8">
                Continue where you left off
            </p>

            {!isLoaded ? (
                <p>Loading authentication...</p>
            ) : !isSignedIn ? (
                <div className="rounded-lg border border-border bg-muted p-6 text-sm text-muted-foreground">
                    You need to sign in to see your enrolled courses.
                </div>
            ) : isLoading ? (
                <p>Loading your enrolled courses...</p>
            ) : error ? (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-sm text-destructive">
                    Something went wrong while loading your courses. Please
                    refresh the page.
                </div>
            ) : data.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted p-6 text-sm text-muted-foreground">
                    No enrolled courses found yet. Enroll in a course to see it
                    here.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((course) => (
                        <div key={course.id} className="space-y-3">
                            <CourseCard course={course} />
                            <Link href={`/courses/${course.slug}`}>
                                <Button className="w-full" variant="secondary">
                                    Continue Learning
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
