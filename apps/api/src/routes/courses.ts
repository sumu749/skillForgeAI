import { Router, Request, Response } from "express";
import { courseQuerySchema } from "@skillforge/shared";
import {
    getCourseBySlug,
    getRelatedCourses,
    getReviewsByCourseId,
    queryCourses,
    getDashboardStats,
    enrollInCourse,
    getEnrolledCourses,
    isUserEnrolled,
} from "../services/courseService";
import { requireClerkAuth } from "../middleware/auth";

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

router.get(
    "/enrolled",
    requireClerkAuth(),
    async (req: Request, res: Response) => {
        try {
            const userId = (req as Request & { auth?: { userId?: string } })
                .auth?.userId;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const courses = await getEnrolledCourses(userId);
            res.json({ data: courses });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
);

router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const course = await getCourseBySlug(String(req.params.slug));
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }

        const userId = (req as Request & { auth?: { userId?: string } }).auth
            ?.userId;
        const enrolled = userId
            ? await isUserEnrolled(course.id, userId)
            : false;

        const [reviews, related] = await Promise.all([
            getReviewsByCourseId(course.id),
            getRelatedCourses(course),
        ]);
        res.json({ course, reviews, related, enrolled });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post(
    "/:slug/enroll",
    requireClerkAuth(),
    async (req: Request, res: Response) => {
        try {
            const course = await getCourseBySlug(String(req.params.slug));
            if (!course) {
                res.status(404).json({ error: "Course not found" });
                return;
            }

            const userId = (req as Request & { auth?: { userId?: string } })
                .auth?.userId;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const enrolled = await isUserEnrolled(course.id, userId);
            if (enrolled) {
                res.status(200).json({ message: "Already enrolled" });
                return;
            }

            await enrollInCourse(course.id, userId);
            res.status(201).json({ message: "Enrolled successfully" });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
);

export default router;
