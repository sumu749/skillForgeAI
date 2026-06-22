"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";
import type { Course } from "@skillforge/shared";

export default function MyCoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-enrolled"],
    queryFn: async () => {
      const res = await api.get("/courses", { params: { limit: 6, sort: "rating" } });
      return res.data.data as Course[];
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Courses</h1>
      <p className="text-muted-foreground mb-8">Continue where you left off</p>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((course) => (
            <div key={course.id} className="space-y-3">
              <CourseCard course={course} />
              <Link href={`/courses/${course.slug}`}>
                <Button className="w-full" variant="secondary">
                  Continue Learning
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
