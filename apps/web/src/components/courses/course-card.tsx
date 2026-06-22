import Link from "next/link";
import Image from "next/image";
import { Star, Clock, BarChart3 } from "lucide-react";
import type { Course } from "@skillforge/shared";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice, formatRating } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 25vw"
          />
          {course.featured && (
            <span className="absolute top-3 left-3 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
              Featured
            </span>
          )}
        </div>
        <CardHeader className="pb-2 flex-1">
          <div className="flex gap-2 text-xs text-muted-foreground mb-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {CATEGORY_LABELS[course.category]}
            </span>
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-secondary">
              {LEVEL_LABELS[course.level]}
            </span>
          </div>
          <h3 className="font-semibold line-clamp-2 leading-snug">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
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
            <span className="font-bold text-primary">{formatPrice(course.price)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardHeader>
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-full bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
      </CardHeader>
    </Card>
  );
}
