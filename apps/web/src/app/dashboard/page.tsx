"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { BookOpen, Users, Star, TrendingUp, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CATEGORY_LABELS } from "@skillforge/shared";
import Link from "next/link";

const COLORS = [
    "#6366F1",
    "#14B8A6",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
];

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    // Redirect students (non-admin, non-manager) away from the overview page
    // to the courses page — the overview is not available to student role.
    useEffect(() => {
        if (!isLoaded) return;
        const role = (user?.publicMetadata?.role as string) || "student";
        if (role === "student") {
            router.replace("/dashboard/courses");
        }
    }, [isLoaded, user, router]);
    const { data: stats } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const res = await api.get("/courses/stats");
            return res.data;
        },
    });

    const role = (user?.publicMetadata?.role as string) || "student";
    const greeting = user?.fullName
        ? `Welcome back, ${user.fullName}`
        : "Welcome back";

    const subtitle =
        role === "admin"
            ? "You can manage platform health, course operations, and user growth from here."
            : role === "manager"
              ? "Track learner engagement and course performance in one place."
              : "Review your progress, upcoming courses, and learning goals.";

    const categoryData = stats
        ? Object.entries(stats.categoryCounts as Record<string, number>).map(
              ([key, value]) => ({
                  name: CATEGORY_LABELS[key] || key,
                  value,
              }),
          )
        : [];

    return (
        <div className="space-y-8">
            <div className="rounded-[2rem] border border-border bg-background/80 p-8 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Dashboard overview
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight mt-2">
                            {greeting}
                        </h1>
                        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>
                    <div className="rounded-3xl bg-primary/5 px-5 py-4 text-primary shadow-inner">
                        <p className="text-sm uppercase tracking-[0.24em] text-primary/80">
                            Your role
                        </p>
                        <p className="mt-2 text-2xl font-semibold capitalize">
                            {role}
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Features Highlight */}
            <Link href="/dashboard/ai-features">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">
                                    Explore AI Features
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Generate content, get recommendations &
                                    learning insights
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-4">
                            Explore →
                        </Button>
                    </CardContent>
                </Card>
            </Link>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={BookOpen}
                    label="Total Courses"
                    value={stats?.totalCourses}
                    accent="primary"
                />
                <StatCard
                    icon={Users}
                    label="Students"
                    value={stats?.totalStudents?.toLocaleString()}
                    accent="secondary"
                />
                <StatCard
                    icon={Star}
                    label="Avg Rating"
                    value={stats?.avgRating?.toFixed(1)}
                    accent="accent"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Reviews"
                    value={stats?.totalReviews}
                    accent="primary"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats?.monthlyEnrollments || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366F1"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Courses by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, value }) =>
                                        `${name}: ${value}`
                                    }
                                >
                                    {categoryData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[i % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Courses by Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={(stats?.topCourses || []).map(
                                (c: {
                                    title: string;
                                    reviewCount: number;
                                }) => ({
                                    name:
                                        c.title.slice(0, 25) +
                                        (c.title.length > 25 ? "..." : ""),
                                    reviews: c.reviewCount,
                                }),
                            )}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="reviews"
                                fill="#14B8A6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
