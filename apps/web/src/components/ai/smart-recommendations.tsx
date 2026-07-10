"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface CourseRecommendation {
    courseId?: string;
    slug?: string;
    title: string;
    reason: string;
    matchScore: number;
}

interface RecommendationsProps {
    onRecommendationsLoaded?: (recommendations: CourseRecommendation[]) => void;
    className?: string;
}

function RecommendationSkeleton() {
    return (
        <div className="p-4 border border-border rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
            <div className="flex justify-end">
                <Skeleton className="h-7 w-24 rounded-md" />
            </div>
        </div>
    );
}

export function SmartRecommendations({
    onRecommendationsLoaded,
    className,
}: RecommendationsProps) {
    const [recommendations, setRecommendations] = useState<
        CourseRecommendation[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const token = await getToken();

            const response = await api.post(
                "/ai/recommendations",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setRecommendations(response.data.recommendations);
            onRecommendationsLoaded?.(response.data.recommendations);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load recommendations. Showing sample recommendations.",
            );
            // Demo data fallback
            setRecommendations([
                {
                    courseId: "1",
                    slug: "advanced-react-patterns",
                    title: "Advanced React Patterns",
                    reason: "Builds on your React fundamentals with advanced component patterns",
                    matchScore: 0.95,
                },
                {
                    courseId: "2",
                    slug: "nodejs-backend-development",
                    title: "Node.js Backend Development",
                    reason: "Perfect next step for full-stack development skills",
                    matchScore: 0.88,
                },
                {
                    courseId: "3",
                    slug: "typescript-masterclass",
                    title: "TypeScript Masterclass",
                    reason: "Enhance your development workflow with type safety",
                    matchScore: 0.82,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [getToken, onRecommendationsLoaded]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        fetchRecommendations();
    }, [isLoaded, isSignedIn, fetchRecommendations]);

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <RecommendationSkeleton />
                        <RecommendationSkeleton />
                        <RecommendationSkeleton />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI Recommendations
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Personalized course suggestions based on your learning path
                </p>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md mb-4">
                        {error}
                    </div>
                )}

                {recommendations.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-10 px-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 mb-4">
                            <Lightbulb className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-lg font-semibold mb-1">
                            No recommendations yet
                        </p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Enroll in a course and we&apos;ll surface
                            personalized next steps for you here.
                        </p>
                        <Link href="/explore" className="mt-4">
                            <Button size="sm" variant="secondary">
                                Browse Courses
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recommendations.map((rec, idx) => (
                            <div
                                key={idx}
                                className="p-4 border border-input rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-sm flex-1">
                                        {rec.title}
                                    </h4>
                                    <span className="text-xs font-medium text-primary">
                                        {Math.round(rec.matchScore * 100)}%
                                        match
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {rec.reason}
                                </p>
                                <div className="flex justify-end">
                                    <Link
                                        href={`/courses/${rec.slug || rec.courseId}`}
                                    >
                                        <Button size="sm" variant="ghost">
                                            View Course
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={fetchRecommendations}
                >
                    Refresh Recommendations
                </Button>
            </CardContent>
        </Card>
    );
}
