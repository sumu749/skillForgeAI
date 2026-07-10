import Link from "next/link";
import Image from "next/image";
import { Star, Clock, BarChart3 } from "lucide-react";
import type { Course } from "@skillforge/shared";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatRating } from "@/lib/utils";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course.slug}`} className="group block h-full">
            <Card
                interactive
                className="h-full overflow-hidden flex flex-col transition-all duration-300 ease-smooth hover:border-primary/30 hover:shadow-lg"
            >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {course.featured && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm backdrop-blur-sm">
                            ★ Featured
                        </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-xl bg-background/90 px-3 py-1 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">
                        {formatPrice(course.price)}
                    </span>
                </div>
                <CardHeader className="pb-2 flex-1">
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                            {CATEGORY_LABELS[course.category]}
                        </span>
                        <span className="rounded-full bg-secondary/10 px-2.5 py-1 font-medium text-secondary">
                            {LEVEL_LABELS[course.level]}
                        </span>
                    </div>
                    <h3 className="font-semibold line-clamp-2 leading-snug transition-colors duration-200 group-hover:text-primary">
                        {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.description}
                    </p>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                        by{" "}
                        <span className="font-medium text-foreground">
                            {course.instructor}
                        </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm border-t pt-3">
                        <span className="flex items-center gap-1 font-medium text-accent">
                            <Star className="h-4 w-4 fill-accent" />
                            {formatRating(course.rating)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {course.durationHours}h
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
                            {course.reviewCount}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export function CourseCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden flex flex-col">
            <Skeleton className="aspect-video w-full rounded-none" />
            <CardHeader className="pb-2 flex-1">
                <div className="flex gap-2 mb-2.5">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-1" />
                <Skeleton className="h-4 w-3/5" />
            </CardHeader>
            <CardContent className="pt-0">
                <Skeleton className="h-4 w-28 mb-3" />
                <div className="flex gap-4 border-t pt-3">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                </div>
            </CardContent>
        </Card>
    );
}
