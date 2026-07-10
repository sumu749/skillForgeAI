"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Users,
    Award,
    TrendingUp,
    CheckCircle,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CourseCard,
    CourseCardSkeleton,
} from "@/components/courses/course-card";
import { api } from "@/lib/api";
import type { Course } from "@skillforge/shared";

const heroSlides = [
    {
        title: "Built for busy learners",
        description:
            "Learn at your own pace with bite-sized modules, guided projects, and quick AI feedback.",
    },
    {
        title: "AI help on demand",
        description:
            "Ask the tutor anything from syntax to architecture and get instant context-aware answers.",
    },
    {
        title: "Career-ready pathways",
        description:
            "Follow structured programs that connect you to real-world skills employers are hiring for.",
    },
];

export default function HomePage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const { data, isLoading } = useQuery({
        queryKey: ["featured-courses"],
        queryFn: async () => {
            const res = await api.get("/courses", {
                params: { limit: 4, sort: "popular" },
            });
            return res.data as { data: Course[] };
        },
    });

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <>
            {/* Hero - 60-70vh */}
            <section className="relative min-h-[65vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
                <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
                <div className="container relative py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="max-w-3xl">
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                                <Sparkles className="h-4 w-4" />
                                AI-Powered Learning Platform
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                                {heroSlides[activeSlide].title} with{" "}
                                <span className="text-gradient">
                                    SkillForge AI
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                                {heroSlides[activeSlide].description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/explore">
                                    <Button
                                        size="lg"
                                        className="group shadow-glow"
                                    >
                                        Explore Courses
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="/dashboard/chat">
                                    <Button size="lg" variant="secondary">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Try AI Tutor
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3 text-sm">
                                {heroSlides.map((slide, index) => (
                                    <button
                                        key={slide.title}
                                        type="button"
                                        onClick={() => setActiveSlide(index)}
                                        className={cn(
                                            "rounded-full border px-4 py-2 transition",
                                            index === activeSlide
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                                        )}
                                    >
                                        {slide.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right-side hero mockup */}
                        <div className="hidden md:block">
                            <Card className="p-6 shadow-elevation-lg rounded-2xl">
                                <div className="space-y-4">
                                    <div className="h-3 w-24 rounded-full bg-muted" />
                                    <div className="rounded-xl bg-card p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                                AI
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    AI Tutor
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Ask anything about this
                                                    course
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div className="rounded-lg bg-muted p-3 text-sm">
                                                How do I set up Tailwind with
                                                Next.js?
                                            </div>
                                            <div className="rounded-lg bg-primary/10 p-3 text-sm">
                                                Use the official Tailwind docs
                                                and configure your content
                                                paths.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y bg-muted/30 py-12">
                <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        {
                            icon: BookOpen,
                            label: "Expert Courses",
                            value: "13+",
                        },
                        {
                            icon: Users,
                            label: "Active Learners",
                            value: "2,800+",
                        },
                        { icon: Award, label: "Certificates", value: "1,200+" },
                        {
                            icon: TrendingUp,
                            label: "Avg. Rating",
                            value: "4.7/5",
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-16">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold">
                                Popular Courses
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Start with our most-loved programs
                            </p>
                        </div>
                        <Link href="/explore">
                            <Button variant="outline">View All</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <CourseCardSkeleton key={i} />
                              ))
                            : data?.data.map((course) => (
                                  <CourseCard key={course.id} course={course} />
                              ))}
                    </div>
                </div>
            </section>

            {/* AI Tutor Feature */}
            <section className="py-16 bg-muted/30">
                <div className="container grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Your Personal AI Tutor
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Get instant explanations, code reviews, and
                            personalized study guidance. Our AI tutor
                            understands your learning context and adapts to your
                            pace.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {[
                                "Context-aware answers based on your current course",
                                "Streaming responses for real-time learning",
                                "Covers programming, data science, cloud, and more",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2"
                                >
                                    <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard/chat">
                            <Button>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Start Chatting
                            </Button>
                        </Link>
                    </div>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                                    AI
                                </div>
                                <div className="rounded-xl bg-muted p-3 text-sm flex-1">
                                    What is the difference between useState and
                                    useReducer in React?
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                    AI
                                </div>
                                <div className="rounded-xl bg-primary/10 p-3 text-sm flex-1">
                                    Great question! useState is ideal for simple
                                    state, while useReducer handles complex
                                    state logic with multiple sub-values and
                                    actions...
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How SkillForge Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Choose Your Path",
                                desc: "Browse 13+ courses across web dev, data science, cloud, security, and AI.",
                            },
                            {
                                step: "2",
                                title: "Learn with Experts",
                                desc: "Follow structured modules with hands-on projects and real-world applications.",
                            },
                            {
                                step: "3",
                                title: "Get AI Support",
                                desc: "Ask your AI tutor anytime for explanations, debugging help, and study tips.",
                            },
                        ].map((item) => (
                            <Card key={item.step} className="text-center p-6">
                                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        What Learners Say
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Jordan Lee",
                                role: "Frontend Developer",
                                text: "The React course and AI tutor combo helped me land my first dev job in 4 months.",
                            },
                            {
                                name: "Emily Watson",
                                role: "Cloud Engineer",
                                text: "Passed AWS Solutions Architect on the first try. The labs are incredibly practical.",
                            },
                            {
                                name: "Chris Anderson",
                                role: "AI Engineer",
                                text: "Built a production RAG chatbot using exactly what I learned in the Generative AI course.",
                            },
                        ].map((t) => (
                            <Card key={t.name} className="p-6">
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4 fill-accent text-accent"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm mb-4">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div>
                                    <div className="font-semibold">
                                        {t.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t.role}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Explore by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "Web Development",
                            "Data Science",
                            "Cloud & DevOps",
                            "AI & ML",
                            "Cybersecurity",
                            "Mobile Dev",
                            "Design",
                            "Programming",
                        ].map((cat) => (
                            <Link
                                key={cat}
                                href={`/explore?search=${encodeURIComponent(cat.split(" ")[0])}`}
                            >
                                <Card className="p-4 text-center hover:border-primary transition-colors cursor-pointer">
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-sm">
                                            {cat}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 bg-muted/10">
                <div className="container text-center">
                    <h3 className="text-2xl font-semibold mb-2">
                        Join our Newsletter
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Get course updates, AI tips, and special offers
                        delivered weekly.
                    </p>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget as HTMLFormElement;
                            const fd = new FormData(form);
                            const email = fd.get("email");
                            if (!email) return alert("Please enter your email");
                            try {
                                await fetch("/api/newsletter", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ email }),
                                });
                                alert("Thanks — check your inbox!");
                                form.reset();
                            } catch (err) {
                                console.error(err);
                                alert("Failed to subscribe");
                            }
                        }}
                        className="max-w-md mx-auto flex items-center gap-2"
                    >
                        <input
                            name="email"
                            type="email"
                            placeholder="you@domain.com"
                            className="flex-1 rounded-md border px-3 py-2"
                        />
                        <Button type="submit">Subscribe</Button>
                    </form>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container">
                    <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-12 text-center">
                        <CardContent className="p-0">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Level Up Your Skills?
                            </h2>
                            <p className="mb-8 opacity-90 max-w-xl mx-auto">
                                Join thousands of learners mastering in-demand
                                tech skills with expert courses and AI-powered
                                guidance.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/sign-up">
                                    <Button size="lg" variant="secondary">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href="/explore">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white/30 bg-transparent text-white hover:bg-white/10"
                                    >
                                        Browse Courses
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}
