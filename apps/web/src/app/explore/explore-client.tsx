"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    CourseCard,
    CourseCardSkeleton,
} from "@/components/courses/course-card";
import { api } from "@/lib/api";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@skillforge/shared";
import type { Course } from "@skillforge/shared";

function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function ExplorePage() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(
        searchParams.get("category") || "",
    );
    const [level, setLevel] = useState(searchParams.get("level") || "");
    const [minRating, setMinRating] = useState(
        searchParams.get("minRating") || "",
    );
    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") || "",
    );
    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") || "",
    );
    const [sort, setSort] = useState(searchParams.get("sort") || "popular");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    const debouncedSearch = useDebounce(search, 400);

    const { data, isLoading } = useQuery({
        queryKey: [
            "courses",
            debouncedSearch,
            category,
            level,
            minRating,
            minPrice,
            maxPrice,
            sort,
            page,
        ],
        queryFn: async () => {
            const res = await api.get("/courses", {
                params: {
                    search: debouncedSearch || undefined,
                    category: category || undefined,
                    level: level || undefined,
                    minRating: minRating || undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    sort,
                    page,
                    limit: 12,
                },
            });
            return res.data as {
                data: Course[];
                total: number;
                page: number;
                totalPages: number;
            };
        },
    });

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
            <p className="text-muted-foreground mb-8">
                Discover {data?.total ?? "..."} courses to advance your career
            </p>

            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses, topics, instructors..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={level}
                    onChange={(e) => {
                        setLevel(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Levels</option>
                    {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min={0}
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => {
                            setMinPrice(e.target.value);
                            setPage(1);
                        }}
                        className="h-10 w-32 rounded-md border border-input bg-background px-3 text-sm"
                    />
                    <Input
                        type="number"
                        min={0}
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => {
                            setMaxPrice(e.target.value);
                            setPage(1);
                        }}
                        className="h-10 w-32 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                          <CourseCardSkeleton key={i} />
                      ))
                    : data?.data.map((course) => (
                          <CourseCard key={course.id} course={course} />
                      ))}
            </div>

            {!isLoading && data?.data.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                    No courses match your filters.
                </p>
            )}

            {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Page {page} of {data.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page >= data.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
