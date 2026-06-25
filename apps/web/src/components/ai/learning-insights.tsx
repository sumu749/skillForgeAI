"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Brain, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface LearningInsight {
    progressSummary: string;
    strengths: string[];
    recommendations: string[];
    nextSteps: string[];
    motivationalMessage: string;
}

interface LearningInsightsProps {
    className?: string;
    onInsightsLoaded?: (insights: LearningInsight) => void;
}

export function LearningInsights({
    className,
    onInsightsLoaded,
}: LearningInsightsProps) {
    const [insights, setInsights] = useState<LearningInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const fetchInsights = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const token = await getToken();
            const response = await api.get("/ai/learning-insights", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInsights(response.data);
            onInsightsLoaded?.(response.data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load learning insights. Showing sample insights.",
            );
            // Demo data fallback
            setInsights({
                progressSummary:
                    "You're making excellent progress! You've enrolled in multiple courses across different categories, showing a commitment to continuous learning.",
                strengths: [
                    "Consistent learner - regularly engaging with course content",
                    "Diverse interests - exploring multiple technology areas",
                    "Goal-oriented - tracking progress and completing modules",
                ],
                recommendations: [
                    "Focus on completing one course before starting another for better retention",
                    "Practice hands-on projects from completed courses",
                    "Join community discussions to reinforce learning",
                ],
                nextSteps: [
                    "Complete your current course modules",
                    "Apply learned skills in a personal project",
                    "Explore advanced courses in your strongest areas",
                ],
                motivationalMessage:
                    "You're on a great learning journey! Keep up the excellent progress - every course completed brings you closer to mastery.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [getToken, onInsightsLoaded]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        fetchInsights();
    }, [isLoaded, isSignedIn, fetchInsights]);

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Learning Insights
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
                    <Brain className="h-5 w-5" />
                    Learning Insights
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    AI-powered analysis of your learning journey
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                        {error}
                    </div>
                )}

                {insights && (
                    <>
                        {/* Motivational Message */}
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm font-medium text-primary italic">
                                {insights.motivationalMessage}
                            </p>
                        </div>

                        {/* Progress Summary */}
                        <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Your Progress
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {insights.progressSummary}
                            </p>
                        </div>

                        {/* Strengths */}
                        <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                Your Strengths
                            </h4>
                            <ul className="space-y-2">
                                {insights.strengths.map((strength, idx) => (
                                    <li
                                        key={idx}
                                        className="flex gap-2 text-sm"
                                    >
                                        <span className="text-emerald-600 font-bold">
                                            ✓
                                        </span>
                                        <span className="text-muted-foreground">
                                            {strength}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h4 className="font-semibold text-sm mb-3">
                                Recommendations for Growth
                            </h4>
                            <ul className="space-y-2">
                                {insights.recommendations.map((rec, idx) => (
                                    <li
                                        key={idx}
                                        className="flex gap-2 text-sm"
                                    >
                                        <span className="text-amber-600 font-bold">
                                            {idx + 1}.
                                        </span>
                                        <span className="text-muted-foreground">
                                            {rec}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <h4 className="font-semibold text-sm mb-3">
                                Next Steps
                            </h4>
                            <ul className="space-y-2">
                                {insights.nextSteps.map((step, idx) => (
                                    <li
                                        key={idx}
                                        className="flex gap-2 text-sm"
                                    >
                                        <span className="text-blue-600 font-bold">
                                            {idx + 1}.
                                        </span>
                                        <span className="text-muted-foreground">
                                            {step}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={fetchInsights}
                        >
                            Refresh Insights
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
