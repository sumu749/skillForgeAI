"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import { formatPrice } from "@/lib/utils";

export default function AdminCoursesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                    <p className="text-muted-foreground">
                        {data?.length ?? 0} courses in catalog
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>Add Course</Button>
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
                                    <th className="text-left py-3 px-2">
                                        Title
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Category
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Level
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Price
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Rating
                                    </th>
                                    <th className="text-left py-3 px-2">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map(
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
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 px-2 font-medium">
                                                {course.title}
                                            </td>
                                            <td className="py-3 px-2">
                                                {
                                                    CATEGORY_LABELS[
                                                        course.category
                                                    ]
                                                }
                                            </td>
                                            <td className="py-3 px-2">
                                                {LEVEL_LABELS[course.level]}
                                            </td>
                                            <td className="py-3 px-2">
                                                {formatPrice(course.price)}
                                            </td>
                                            <td className="py-3 px-2">
                                                {course.rating}
                                            </td>
                                            <td className="py-3 px-2">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl">
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
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Course title"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Slug
                                    </label>
                                    <input
                                        name="slug"
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                <Button type="submit">Add Course</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
