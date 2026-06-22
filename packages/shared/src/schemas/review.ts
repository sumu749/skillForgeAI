import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  userId: z.string(),
  userName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof reviewSchema>;
