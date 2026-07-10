"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

    const hasActiveFilters = Boolean(
        search || category || level || minRating || minPrice || maxPrice,
    );

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setLevel("");
        setMinRating("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    Explore Courses
                </h1>
                <p className="text-muted-foreground">
                    Discover {data?.total ?? "..."} courses to advance your
                    career
                </p>
            </div>

            <Card className="p-4 md:p-5 mb-8 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.6fr_1fr]">
                    <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2">
                        <div className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses, topics, instructors..."
                                className="pl-10 shadow-xs"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <select
                            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Categories</option>
                            {Object.entries(CATEGORY_LABELS).map(
                                ([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                        <select
                            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={level}
                            onChange={(e) => {
                                setLevel(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Levels</option>
                            {Object.entries(LEVEL_LABELS).map(
                                ([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min={0}
                                placeholder="Min $"
                                value={minPrice}
                                onChange={(e) => {
                                    setMinPrice(e.target.value);
                                    setPage(1);
                                }}
                                className="h-10 w-full rounded-lg shadow-xs"
                            />
                            <Input
                                type="number"
                                min={0}
                                placeholder="Max $"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    setPage(1);
                                }}
                                className="h-10 w-full rounded-lg shadow-xs"
                            />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <select
                            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="price-asc">
                                Price: Low to High
                            </option>
                            <option value="price-desc">
                                Price: High to Low
                            </option>
                            <option value="newest">Newest</option>
                        </select>
                        {hasActiveFilters && (
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-input bg-muted px-4 py-3 text-sm text-muted-foreground shadow-sm">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                    <span>Filters active</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="h-9 gap-2"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Reset
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

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
                <Card className="border-dashed border-border/40 bg-muted/80 p-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm">
                        <Search className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        No courses match your filters
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
                        Try broadening your search, changing the category or
                        level, or resetting the filters to discover more
                        courses.
                    </p>
                    <Button variant="secondary" onClick={resetFilters}>
                        Clear all filters
                    </Button>
                </Card>
            )}

            {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
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
