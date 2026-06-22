import { z } from "zod";

export const courseCategorySchema = z.enum([
  "web-development",
  "data-science",
  "cloud-devops",
  "cybersecurity",
  "mobile-development",
  "ai-machine-learning",
  "design",
  "programming",
]);

export const courseLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const courseSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  category: courseCategorySchema,
  level: courseLevelSchema,
  price: z.number().min(0),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  durationHours: z.number().min(1),
  instructor: z.string().min(1),
  instructorBio: z.string().min(1),
  imageUrl: z.string().url(),
  tags: z.array(z.string()),
  modules: z.array(
    z.object({
      title: z.string(),
      lessons: z.number().int().min(1),
    })
  ),
  specs: z.object({
    language: z.string(),
    certificate: z.boolean(),
    lifetimeAccess: z.boolean(),
    projects: z.number().int().min(0),
  }),
  featured: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const courseQuerySchema = z.object({
  search: z.string().optional(),
  category: courseCategorySchema.optional(),
  level: courseLevelSchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "rating", "popular"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Course = z.infer<typeof courseSchema>;
export type CourseQuery = z.infer<typeof courseQuerySchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
