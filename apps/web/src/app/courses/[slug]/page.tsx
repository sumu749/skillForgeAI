"use client";

import { useParams } from "next/navigation";
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

    const { data, isLoading } = useQuery({
        queryKey: ["course", slug],
        queryFn: async () => {
            const res = await api.get(`/courses/${slug}`);
            return res.data as {
                course: Course;
                reviews: Review[];
                related: Course[];
            };
        },
    });

    const { isSignedIn, getToken } = useAuth();

    const enrollMutation = useMutation({
        mutationFn: async () => {
            if (!isSignedIn) {
                throw new Error("Please sign in to enroll.");
            }

            const token = await getToken({ template: "single-factor" });
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
            queryClient.invalidateQueries(["course", slug]);
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

    const { course, reviews, related } = data;

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
                        <div className="flex gap-2 mb-3">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {CATEGORY_LABELS[course.category]}
                            </span>
                            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                                {LEVEL_LABELS[course.level]}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">
                            {course.title}
                        </h1>
                        <p className="text-muted-foreground">
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
                                    className="flex justify-between border-b pb-3 last:border-0"
                                >
                                    <span className="font-medium">
                                        {i + 1}. {mod.title}
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
                    <Card className="p-6 sticky top-20">
                        <div className="text-3xl font-bold text-primary mb-4">
                            {formatPrice(course.price)}
                        </div>
                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-accent text-accent" />
                                {formatRating(course.rating)} (
                                {course.reviewCount} reviews)
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {course.durationHours} hours
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {course.modules.reduce(
                                    (s, m) => s + m.lessons,
                                    0,
                                )}{" "}
                                lessons
                            </div>
                            {course.specs.certificate && (
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Certificate of completion
                                </div>
                            )}
                        </div>
                        <Button
                            className="w-full mb-2"
                            onClick={() => {
                                setMessage(null);
                                enrollMutation.mutate();
                            }}
                            disabled={enrollMutation.isLoading}
                        >
                            {enrollMutation.isLoading
                                ? "Enrolling..."
                                : "Enroll Now"}
                        </Button>
                        {message ? (
                            <p className="text-sm text-center text-secondary">
                                {message}
                            </p>
                        ) : null}
                        <p className="text-xs text-muted-foreground text-center">
                            Instructor: {course.instructor}
                        </p>
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
