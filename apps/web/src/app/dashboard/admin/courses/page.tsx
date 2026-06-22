"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { formatPrice } from "@/lib/utils";

export default function AdminCoursesPage() {
  const { data } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const res = await api.get("/courses", { params: { limit: 48 } });
      return res.data.data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="text-muted-foreground">{data?.length ?? 0} courses in catalog</p>
        </div>
        <Button disabled>Add Course (Coming Soon)</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Title</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Level</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Rating</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((course: {
                  id: string;
                  slug: string;
                  title: string;
                  category: string;
                  level: string;
                  price: number;
                  rating: number;
                }) => (
                  <tr key={course.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{course.title}</td>
                    <td className="py-3 px-2">{CATEGORY_LABELS[course.category]}</td>
                    <td className="py-3 px-2">{LEVEL_LABELS[course.level]}</td>
                    <td className="py-3 px-2">{formatPrice(course.price)}</td>
                    <td className="py-3 px-2">{course.rating}</td>
                    <td className="py-3 px-2">
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
