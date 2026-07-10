"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { streamChat } from "@/lib/api";
import { cn } from "@/lib/utils";

function normalizeError(error: unknown) {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object") {
        const anyError = error as Record<string, unknown>;
        return (
            (typeof anyError.message === "string" && anyError.message) ||
            (typeof anyError.type === "string" && anyError.type) ||
            JSON.stringify(anyError)
        );
    }
    return String(error);
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1.5 px-1 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:300ms]" />
        </div>
    );
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatAssistantProps {
    courseContext?: { courseId?: string; courseTitle?: string };
    className?: string;
}

export function ChatAssistant({
    courseContext,
    className,
}: ChatAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm your SkillForge AI Tutor. Ask me about programming, data science, cloud computing, or any course topic. How can I help you learn today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [conversationId, setConversationId] = useState<string>();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsStreaming(true);

        const apiMessages = updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        let assistantContent = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            await streamChat(
                apiMessages,
                conversationId,
                (chunk) => {
                    assistantContent += chunk;
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            role: "assistant",
                            content: assistantContent,
                        };
                        return next;
                    });
                },
                (id) => {
                    setConversationId(id);
                    setIsStreaming(false);
                },
                (error) => {
                    const text = normalizeError(error);
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            role: "assistant",
                            content: `Sorry, something went wrong: ${text}`,
                        };
                        return next;
                    });
                    setIsStreaming(false);
                },
                courseContext,
            );
        } catch (error) {
            const text = normalizeError(error);
            setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                    role: "assistant",
                    content: `Sorry, something went wrong: ${text || "Unknown error"}`,
                };
                return next;
            });
            setIsStreaming(false);
        }
    };

    return (
        <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
            <CardHeader className="border-b pb-4 bg-gradient-to-r from-primary/[0.04] to-transparent">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-sm">
                        <Bot className="h-4.5 w-4.5 text-white" />
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span
                                className={cn(
                                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                                    isStreaming
                                        ? "bg-accent animate-ping"
                                        : "bg-secondary",
                                )}
                            />
                            <span
                                className={cn(
                                    "relative inline-flex h-3 w-3 rounded-full border-2 border-card",
                                    isStreaming ? "bg-accent" : "bg-secondary",
                                )}
                            />
                        </span>
                    </span>
                    SkillForge AI Tutor
                </CardTitle>
                {courseContext?.courseTitle ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 pl-11.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Context: {courseContext.courseTitle}
                    </p>
                ) : null}
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0 min-h-[500px]">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-5 max-h-[60vh]"
                >
                    {messages.map((msg, i) => {
                        const isLastAssistant =
                            msg.role === "assistant" &&
                            i === messages.length - 1;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 animate-fade",
                                    msg.role === "user"
                                        ? "flex-row-reverse"
                                        : "flex-row",
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-gradient-to-br from-muted to-muted/60 text-foreground",
                                    )}
                                >
                                    {msg.role === "user" ? (
                                        <User className="h-4 w-4" />
                                    ) : (
                                        <Bot className="h-4 w-4" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:rounded-lg prose-pre:bg-foreground/[0.04] prose-code:before:content-none prose-code:after:content-none",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
                                            : "bg-muted rounded-tl-sm",
                                    )}
                                >
                                    {msg.role === "assistant" ? (
                                        msg.content ? (
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : isStreaming && isLastAssistant ? (
                                            <TypingIndicator />
                                        ) : null
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="border-t p-4 flex gap-2 bg-muted/20">
                    <Input
                        placeholder="Ask about a topic, concept, or course..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && !e.shiftKey && sendMessage()
                        }
                        disabled={isStreaming}
                        className="bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isStreaming || !input.trim()}
                        className="shrink-0 shadow-sm"
                    >
                        {isStreaming ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
