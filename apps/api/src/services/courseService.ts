import type { Course, CourseQuery, Review } from "@skillforge/shared";
import { getStorageMode } from "../db/connection";
import { CourseModel } from "../models/Course";
import { ReviewModel } from "../models/Review";
import { EnrollmentModel } from "../models/Enrollment";
import { readJsonFile, writeJsonFile, updateJsonFile } from "../db/jsonStorage";

const COURSES_FILE = "courses.json";
const REVIEWS_FILE = "reviews.json";
const ENROLLMENTS_FILE = "enrollments.json";

export async function getAllCourses(): Promise<Course[]> {
    if (getStorageMode() === "mongo") {
        const docs = await CourseModel.find().lean();
        return docs.map((d) => ({
            ...(d as Record<string, unknown>),
            id:
                (d as { id?: string }).id ||
                String((d as { _id?: unknown })._id),
        })) as Course[];
    }
    return readJsonFile<Course[]>(COURSES_FILE, []);
}

export async function queryCourses(query: CourseQuery) {
    let courses = await getAllCourses();

    if (query.search) {
        const term = query.search.toLowerCase();
        courses = courses.filter(
            (c) =>
                c.title.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term) ||
                c.tags.some((t) => t.toLowerCase().includes(term)) ||
                c.instructor.toLowerCase().includes(term),
        );
    }

    if (query.category)
        courses = courses.filter((c) => c.category === query.category);
    if (query.level) courses = courses.filter((c) => c.level === query.level);
    if (query.minPrice !== undefined)
        courses = courses.filter((c) => c.price >= query.minPrice!);
    if (query.maxPrice !== undefined)
        courses = courses.filter((c) => c.price <= query.maxPrice!);
    if (query.minRating !== undefined)
        courses = courses.filter((c) => c.rating >= query.minRating!);

    switch (query.sort) {
        case "price-asc":
            courses.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            courses.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            courses.sort((a, b) => b.rating - a.rating);
            break;
        case "popular":
            courses.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        default:
            courses.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const total = courses.length;
    const page = query.page || 1;
    const limit = query.limit || 12;
    const start = (page - 1) * limit;
    const data = courses.slice(start, start + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    const courses = await getAllCourses();
    return courses.find((c) => c.slug === slug) || null;
}

export async function getCourseById(id: string): Promise<Course | null> {
    const courses = await getAllCourses();
    return courses.find((c) => c.id === id) || null;
}

export async function getEnrolledCourses(userId: string): Promise<Course[]> {
    const enrollments =
        getStorageMode() === "mongo"
            ? await EnrollmentModel.find({ userId }).lean()
            : readJsonFile<
                  {
                      courseId: string;
                      userId: string;
                      enrolledAt: string;
                  }[]
              >(ENROLLMENTS_FILE, []);

    const courseIds = new Set(
        enrollments.map((enrollment) =>
            getStorageMode() === "mongo"
                ? String((enrollment as Record<string, unknown>).courseId)
                : enrollment.courseId,
        ),
    );

    const courses = await getAllCourses();
    return courses.filter((course) => courseIds.has(course.id));
}

export async function getRelatedCourses(
    course: Course,
    limit = 4,
): Promise<Course[]> {
    const courses = await getAllCourses();
    return courses
        .filter((c) => c.id !== course.id && c.category === course.category)
        .slice(0, limit);
}

export async function getReviewsByCourseId(
    courseId: string,
): Promise<Review[]> {
    if (getStorageMode() === "mongo") {
        const docs = await ReviewModel.find({ courseId })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((d) => ({
            id: d.id,
            courseId: d.courseId,
            userId: d.userId,
            userName: d.userName,
            rating: d.rating,
            comment: d.comment,
            createdAt:
                (d as { createdAt?: Date }).createdAt?.toISOString() ||
                new Date().toISOString(),
        }));
    }
    const reviews = readJsonFile<Review[]>(REVIEWS_FILE, []);
    return reviews.filter((r) => r.courseId === courseId);
}

export async function enrollInCourse(courseId: string, userId: string) {
    if (getStorageMode() === "mongo") {
        await EnrollmentModel.create({
            courseId,
            userId,
            enrolledAt: new Date(),
        });
        return;
    }

    updateJsonFile<
        {
            courseId: string;
            userId: string;
            enrolledAt: string;
        }[]
    >(ENROLLMENTS_FILE, [], (enrollments) => {
        const exists = enrollments.some(
            (enrollment) =>
                enrollment.courseId === courseId &&
                enrollment.userId === userId,
        );
        if (exists) return enrollments;

        return [
            ...enrollments,
            { courseId, userId, enrolledAt: new Date().toISOString() },
        ];
    });
}

export async function isUserEnrolled(courseId: string, userId: string) {
    if (getStorageMode() === "mongo") {
        const exists = await EnrollmentModel.exists({ courseId, userId });
        return Boolean(exists);
    }

    const enrollments = readJsonFile<
        {
            courseId: string;
            userId: string;
            enrolledAt: string;
        }[]
    >(ENROLLMENTS_FILE, []);
    return enrollments.some(
        (enrollment) =>
            enrollment.courseId === courseId && enrollment.userId === userId,
    );
}

export async function seedCourses(courses: Course[], reviews: Review[]) {
    if (getStorageMode() === "mongo") {
        const count = await CourseModel.countDocuments();
        if (count === 0) {
            await CourseModel.insertMany(courses);
            await ReviewModel.insertMany(reviews);
            console.log(
                `✅ Seeded ${courses.length} courses and ${reviews.length} reviews to MongoDB`,
            );
        }
        return;
    }
    writeJsonFile(COURSES_FILE, courses);
    writeJsonFile(REVIEWS_FILE, reviews);
    console.log(
        `✅ Seeded ${courses.length} courses and ${reviews.length} reviews to JSON storage`,
    );
}

export async function getDashboardStats() {
    const courses = await getAllCourses();
    const reviews =
        getStorageMode() === "mongo"
            ? await ReviewModel.find().lean()
            : readJsonFile<Review[]>(REVIEWS_FILE, []);

    const categoryCounts: Record<string, number> = {};
    courses.forEach((c) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const monthlyEnrollments = [
        { month: "Jan", count: 142 },
        { month: "Feb", count: 198 },
        { month: "Mar", count: 256 },
        { month: "Apr", count: 312 },
        { month: "May", count: 389 },
        { month: "Jun", count: 445 },
    ];

    return {
        totalCourses: courses.length,
        totalReviews: reviews.length,
        avgRating:
            courses.reduce((s, c) => s + c.rating, 0) / courses.length || 0,
        totalStudents: 2847,
        categoryCounts,
        monthlyEnrollments,
        topCourses: courses
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, 5),
    };
}
