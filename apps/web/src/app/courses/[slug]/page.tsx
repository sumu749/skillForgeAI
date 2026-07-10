"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, BookOpen, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/courses/course-card";
import { ChatAssistant } from "@/components/chat/chat-assistant";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { formatPrice, formatRating } from "@/lib/utils";
import type { Course, Review } from "@skillforge/shared";

export default function CourseDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [message, setMessage] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["course", slug],
        queryFn: async () => {
            const res = await api.get(`/courses/${slug}`);
            return res.data as {
                course: Course;
                reviews: Review[];
                related: Course[];
                enrolled: boolean;
            };
        },
    });

    const { isSignedIn, getToken } = useAuth();

    const enrollMutation = useMutation({
        mutationFn: async () => {
            if (!isSignedIn) {
                throw new Error("Please sign in to enroll.");
            }

            const token = await getToken();
            const res = await api.post(
                `/courses/${slug}/enroll`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return res.data;
        },
        onSuccess: (data) => {
            setMessage(data.message || "Enrolled successfully!");
            queryClient.setQueryData(["course", slug], (oldData) =>
                oldData
                    ? {
                          ...(oldData as {
                              course: Course;
                              reviews: Review[];
                              related: Course[];
                              enrolled: boolean;
                          }),
                          enrolled: true,
                      }
                    : oldData,
            );
            queryClient.invalidateQueries({ queryKey: ["my-enrolled"] });
        },
        onError: (error: unknown) => {
            const fallback =
                error instanceof Error
                    ? error.message
                    : "Enrollment failed. Please try again.";
            setMessage(fallback);
        },
    });

    if (isLoading) {
        return (
            <div className="container py-10">
                <Skeleton className="h-64 w-full rounded-xl mb-8" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }

    if (!data?.course) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
                <Link href="/explore">
                    <Button>Browse Courses</Button>
                </Link>
            </div>
        );
    }

    const { course, reviews, related, enrolled } = data;

    return (
        <div className="container py-10">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                        <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                                {CATEGORY_LABELS[course.category]}
                            </span>
                            <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary shadow-sm">
                                {LEVEL_LABELS[course.level]}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {course.longDescription}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>What You&apos;ll Learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {course.tags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle className="h-4 w-4 text-secondary" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Modules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {course.modules.map((mod, i) => (
                                <div
                                    key={mod.title}
                                    className="flex items-center gap-4 py-3 border-b last:border-0"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium flex-1">
                                        {mod.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {mod.lessons} lessons
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reviews ({reviews.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No reviews yet.
                                </p>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b pb-4 last:border-0"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium">
                                                {review.userName}
                                            </span>
                                            <div className="flex">
                                                {Array.from({
                                                    length: review.rating,
                                                }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-3 w-3 fill-accent text-accent"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-20 overflow-hidden shadow-lg">
                        <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />
                        <div className="p-6">
                            <div className="text-3xl font-bold text-primary mb-4">
                                {formatPrice(course.price)}
                            </div>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                    </span>
                                    {formatRating(course.rating)} (
                                    {course.reviewCount} reviews)
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                    </span>
                                    {course.durationHours} hours
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10">
                                        <BookOpen className="h-3.5 w-3.5 text-secondary" />
                                    </span>
                                    {course.modules.reduce(
                                        (s, m) => s + m.lessons,
                                        0,
                                    )}{" "}
                                    lessons
                                </div>
                                {course.specs.certificate && (
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                                            <Award className="h-3.5 w-3.5 text-accent" />
                                        </span>
                                        Certificate of completion
                                    </div>
                                )}
                            </div>
                            <Button
                                className="w-full mb-2 shadow-glow"
                                size="lg"
                                onClick={() => {
                                    setMessage(null);
                                    if (!isSignedIn) {
                                        router.push(
                                            `/sign-in?redirect_url=/courses/${slug}`,
                                        );
                                        return;
                                    }
                                    enrollMutation.mutate();
                                }}
                                disabled={enrollMutation.isPending || enrolled}
                            >
                                {enrollMutation.isPending
                                    ? "Enrolling..."
                                    : enrolled
                                      ? "Already Enrolled"
                                      : "Enroll Now"}
                            </Button>
                            {message ? (
                                <p className="text-sm text-center text-secondary font-medium">
                                    {message}
                                </p>
                            ) : null}
                            {enrolled ? (
                                <p className="text-sm text-center text-muted-foreground">
                                    You are enrolled in this course.
                                </p>
                            ) : null}
                            <p className="text-xs text-muted-foreground text-center mt-3 pt-3 border-t">
                                Instructor:{" "}
                                <span className="font-medium text-foreground">
                                    {course.instructor}
                                </span>
                            </p>
                        </div>
                    </Card>

                    <ChatAssistant
                        courseContext={{
                            courseId: course.id,
                            courseTitle: course.title,
                        }}
                    />
                </div>
            </div>

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {related.map((c) => (
                            <CourseCard key={c.id} course={c} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
