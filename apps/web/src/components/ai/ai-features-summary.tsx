"use client";

import Link from "next/link";
import { Sparkles, Wand2, Lightbulb, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AIFeaturesSummaryProps {
    className?: string;
    showCTA?: boolean;
}

export function AIFeaturesSummary({
    className,
    showCTA = true,
}: AIFeaturesSummaryProps) {
    const features = [
        {
            icon: Wand2,
            title: "Content Generator",
            description:
                "Generate course descriptions, learning objectives, and tags with AI",
        },
        {
            icon: Lightbulb,
            title: "Smart Recommendations",
            description:
                "Get personalized course suggestions based on your learning history",
        },
        {
            icon: Brain,
            title: "Learning Insights",
            description:
                "Receive AI-powered analysis of your progress and personalized guidance",
        },
    ];

    return (
        <div className={cn("space-y-6", className)}>
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold">
                        AI-Powered Learning
                    </h2>
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                    Harness the power of artificial intelligence to enhance your
                    learning experience with smart recommendations, AI-generated
                    content, and personalized insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                        <Card
                            key={idx}
                            className="border-primary/20 hover:border-primary/50 transition-colors"
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {feature.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {showCTA && (
                <div className="text-center">
                    <Link href="/dashboard/ai-features">
                        <Button size="lg" className="gap-2">
                            <Sparkles className="h-4 w-4" />
                            Explore AI Features
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
