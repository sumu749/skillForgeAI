"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { formatPrice } from "@/lib/utils";

export default function AdminCoursesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useQuery({
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
                    <h1 className="text-3xl font-bold tracking-tight">
                        Manage Courses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {data?.length ?? 0} courses in catalog
                    </p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="shadow-sm gap-1.5"
                >
                    <Plus className="h-4 w-4" />
                    Add Course
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Course Catalog</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                                <tr className="border-b border-border/70">
                                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Category
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Level
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Price
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Rating
                                    </th>
                                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 6 }).map((_, i) => (
                                          <tr
                                              key={i}
                                              className="border-b last:border-0"
                                          >
                                              <td className="py-3.5 px-6">
                                                  <Skeleton className="h-4 w-40" />
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-5 w-20 rounded-full" />
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-5 w-16 rounded-full" />
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-4 w-12" />
                                              </td>
                                              <td className="py-3.5 px-4">
                                                  <Skeleton className="h-4 w-8" />
                                              </td>
                                              <td className="py-3.5 px-6">
                                                  <Skeleton className="h-7 w-14 rounded-md" />
                                              </td>
                                          </tr>
                                      ))
                                    : data?.map(
                                          (course: {
                                              id: string;
                                              slug: string;
                                              title: string;
                                              category: string;
                                              level: string;
                                              price: number;
                                              rating: number;
                                          }) => (
                                              <tr
                                                  key={course.id}
                                                  className="border-b last:border-0 transition-colors hover:bg-muted/40"
                                              >
                                                  <td className="py-3.5 px-6 font-medium">
                                                      {course.title}
                                                  </td>
                                                  <td className="py-3.5 px-4">
                                                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                          {
                                                              CATEGORY_LABELS[
                                                                  course
                                                                      .category
                                                              ]
                                                          }
                                                      </span>
                                                  </td>
                                                  <td className="py-3.5 px-4">
                                                      <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                                                          {
                                                              LEVEL_LABELS[
                                                                  course.level
                                                              ]
                                                          }
                                                      </span>
                                                  </td>
                                                  <td className="py-3.5 px-4 font-medium">
                                                      {formatPrice(
                                                          course.price,
                                                      )}
                                                  </td>
                                                  <td className="py-3.5 px-4">
                                                      <span className="inline-flex items-center gap-1 text-accent font-medium">
                                                          ★ {course.rating}
                                                      </span>
                                                  </td>
                                                  <td className="py-3.5 px-6">
                                                      <Link
                                                          href={`/courses/${course.slug}`}
                                                      >
                                                          <Button
                                                              variant="ghost"
                                                              size="sm"
                                                          >
                                                              View
                                                          </Button>
                                                      </Link>
                                                  </td>
                                              </tr>
                                          ),
                                      )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade">
                    <div className="w-full max-w-2xl rounded-2xl bg-background p-6 shadow-xl animate-in-up">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Add New Course
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Create a course record for demo purposes.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                const formData = new FormData(
                                    event.currentTarget,
                                );
                                const title =
                                    formData.get("title")?.toString().trim() ||
                                    "";
                                const slug =
                                    formData.get("slug")?.toString().trim() ||
                                    "";
                                if (!title || !slug) {
                                    alert("Title and slug are required.");
                                    return;
                                }
                                alert(
                                    "Course creation is not connected to the backend in this demo.",
                                );
                                setIsModalOpen(false);
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">
                                        Title
                                    </label>
                                    <input
                                        name="title"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Course title"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Slug
                                    </label>
                                    <input
                                        name="slug"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="course-slug"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {Object.entries(CATEGORY_LABELS).map(
                                            ([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {Object.entries(LEVEL_LABELS).map(
                                            ([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">
                                        Price
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Rating
                                    </label>
                                    <input
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="4.5"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="shadow-sm">
                                    Add Course
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
