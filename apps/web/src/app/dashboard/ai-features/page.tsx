"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ContentGenerator,
    SmartRecommendations,
    LearningInsights,
} from "@/components/ai";
import { Sparkles } from "lucide-react";

export default function AIFeaturesPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/sign-in");
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">AI Features</h1>
                </div>
                <p className="text-muted-foreground">
                    Harness the power of AI to enhance your learning experience
                </p>
            </div>

            {/* Introduction Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        SkillForge AI provides three powerful features to
                        supercharge your learning: generate course content with
                        AI, get personalized course recommendations, and receive
                        insights about your learning progress.
                    </p>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Content Generator */}
                <div>
                    <ContentGenerator className="h-full" />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Smart Recommendations */}
                    <SmartRecommendations />

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                How AI Features Help
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">
                                        1.
                                    </span>
                                    <span>
                                        <strong className="text-foreground">
                                            Content Generator:
                                        </strong>{" "}
                                        Quickly generate course descriptions,
                                        learning objectives, and tags for new
                                        courses
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">
                                        2.
                                    </span>
                                    <span>
                                        <strong className="text-foreground">
                                            Smart Recommendations:
                                        </strong>{" "}
                                        Get AI-powered personalized course
                                        suggestions based on your enrollment
                                        history
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">
                                        3.
                                    </span>
                                    <span>
                                        <strong className="text-foreground">
                                            Learning Insights:
                                        </strong>{" "}
                                        Receive analysis of your learning
                                        journey with personalized guidance
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Learning Insights - Full Width */}
            <LearningInsights />
        </div>
    );
}
