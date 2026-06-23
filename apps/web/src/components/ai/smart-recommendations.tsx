"use client";

import { useEffect, useState } from "react";
import { Loader2, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseRecommendation {
    courseId: string;
    title: string;
    reason: string;
    matchScore: number;
}

interface RecommendationsProps {
    onRecommendationsLoaded?: (recommendations: CourseRecommendation[]) => void;
    className?: string;
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

    const fetchRecommendations = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/ai/recommendations");
            setRecommendations(response.data.recommendations);
            onRecommendationsLoaded?.(response.data.recommendations);
        } catch (err) {
            // Demo data fallback
            setRecommendations([
                {
                    courseId: "1",
                    title: "Advanced React Patterns",
                    reason: "Builds on your React fundamentals with advanced component patterns",
                    matchScore: 0.95,
                },
                {
                    courseId: "2",
                    title: "Node.js Backend Development",
                    reason: "Perfect next step for full-stack development skills",
                    matchScore: 0.88,
                },
                {
                    courseId: "3",
                    title: "TypeScript Masterclass",
                    reason: "Enhance your development workflow with type safety",
                    matchScore: 0.82,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
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
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            Enroll in a course to get personalized
                            recommendations
                        </p>
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
                                    <Link href={`/courses/${rec.courseId}`}>
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
