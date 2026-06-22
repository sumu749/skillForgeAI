import { Router, Request, Response } from "express";
import { courseQuerySchema } from "@skillforge/shared";
import {
  getCourseBySlug,
  getRelatedCourses,
  getReviewsByCourseId,
  queryCourses,
  getDashboardStats,
} from "../services/courseService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const parsed = courseQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const result = await queryCourses(parsed.data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const course = await getCourseBySlug(String(req.params.slug));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    const [reviews, related] = await Promise.all([
      getReviewsByCourseId(course.id),
      getRelatedCourses(course),
    ]);
    res.json({ course, reviews, related });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
