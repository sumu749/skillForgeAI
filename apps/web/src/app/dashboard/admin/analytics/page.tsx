"use client";

import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { CATEGORY_LABELS } from "@skillforge/shared";

const chartTooltipStyle = {
    borderRadius: 10,
    border: "1px solid hsl(var(--border))",
    background: "hsl(var(--card))",
    boxShadow: "var(--shadow-md)",
    fontSize: 13,
};

export default function AdminAnalyticsPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-analytics"],
        queryFn: async () => {
            const res = await api.get("/courses/stats");
            return res.data;
        },
    });

    const categoryData = stats
        ? Object.entries(stats.categoryCounts as Record<string, number>).map(
              ([key, value]) => ({
                  category: CATEGORY_LABELS[key] || key,
                  courses: value,
              }),
          )
        : [];

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
                Analytics
            </h1>
            <p className="text-muted-foreground mb-8">
                Platform performance metrics
            </p>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <BarChart3 className="h-4 w-4" />
                            </span>
                            Enrollment Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoading ? (
                            <Skeleton className="h-[300px] w-full rounded-2xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={stats?.monthlyEnrollments || []}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        cursor={{ fill: "hsl(var(--muted))" }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="hsl(var(--primary))"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                <PieChart className="h-4 w-4" />
                            </span>
                            Courses by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoading ? (
                            <Skeleton className="h-[300px] w-full rounded-2xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                    />
                                    <XAxis
                                        type="number"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        dataKey="category"
                                        type="category"
                                        width={140}
                                        tick={{
                                            fontSize: 11,
                                            fill: "hsl(var(--muted-foreground))",
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        cursor={{ fill: "hsl(var(--muted))" }}
                                    />
                                    <Bar
                                        dataKey="courses"
                                        fill="hsl(var(--secondary))"
                                        radius={[0, 6, 6, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
