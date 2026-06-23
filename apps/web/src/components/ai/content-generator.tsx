"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GeneratedContent {
    description: string;
    objectives: string[];
    tags: string[];
    summary: string;
}

interface ContentGeneratorProps {
    onGenerate?: (content: GeneratedContent) => void;
    className?: string;
}

export function ContentGenerator({
    onGenerate,
    className,
}: ContentGeneratorProps) {
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("beginner");
    const [category, setCategory] = useState("web-development");
    const [content, setContent] = useState<GeneratedContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/ai/generate-content", {
                topic,
                level,
                category,
            });
            setContent(response.data);
            onGenerate?.(response.data);
        } catch (err) {
            setError("Failed to generate content. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        AI Content Generator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Topic
                            </label>
                            <Input
                                placeholder="e.g., React Hooks, Python APIs"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Level
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                                <option value="web-development">
                                    Web Development
                                </option>
                                <option value="data-science">
                                    Data Science
                                </option>
                                <option value="cloud-devops">
                                    Cloud & DevOps
                                </option>
                                <option value="cybersecurity">
                                    Cybersecurity
                                </option>
                                <option value="mobile-development">
                                    Mobile Development
                                </option>
                                <option value="ai-machine-learning">
                                    AI & ML
                                </option>
                                <option value="programming">Programming</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate Content
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {content && (
                <Card className="border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Generated Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">
                                Description
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {content.description}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-2">
                                Summary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {content.summary}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-2">
                                Learning Objectives
                            </h4>
                            <ul className="space-y-1">
                                {content.objectives.map((obj, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-muted-foreground flex gap-2"
                                    >
                                        <span className="text-primary">•</span>
                                        <span>{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {content.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                // Copy to clipboard functionality
                                const text = `${content.description}\n\nObjectives:\n${content.objectives.join("\n")}\n\nTags: ${content.tags.join(", ")}`;
                                navigator.clipboard.writeText(text);
                            }}
                        >
                            Copy Content
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
