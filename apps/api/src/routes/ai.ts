import { Router, Request, Response } from "express";
import { chatRequestSchema } from "@skillforge/shared";
import { aiRateLimiter } from "../middleware/rateLimit";
import {
    streamChat,
    getChatHistory,
    generateCourseContent,
    recommendCourses,
    generateLearningInsights,
} from "../services/aiService";
import { getEnrolledCourses, getAllCourses } from "../services/courseService";

const router = Router();

// Existing Chat endpoint
router.post("/chat", aiRateLimiter, async (req: Request, res: Response) => {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const userId = (req as Request & { auth?: { userId?: string } }).auth
        ?.userId;

    await streamChat(
        parsed.data,
        userId,
        (text) => {
            res.write(
                `data: ${JSON.stringify({ type: "chunk", content: text })}\n\n`,
            );
        },
        (conversationId) => {
            res.write(
                `data: ${JSON.stringify({ type: "done", conversationId })}\n\n`,
            );
            res.end();
        },
        (error) => {
            res.write(`data: ${JSON.stringify({ type: "error", error })}\n\n`);
            res.end();
        },
    );
});

router.get("/chat/:conversationId", async (req: Request, res: Response) => {
    try {
        const userId = (req as Request & { auth?: { userId?: string } }).auth
            ?.userId;
        const messages = await getChatHistory(
            String(req.params.conversationId),
            userId,
        );
        if (!messages) {
            res.status(404).json({ error: "Conversation not found" });
            return;
        }
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// AI FEATURE 1: Content Generator
router.post(
    "/generate-content",
    aiRateLimiter,
    async (req: Request, res: Response) => {
        try {
            const { topic, level, category } = req.body;

            if (!topic || !level || !category) {
                res.status(400).json({
                    error: "Missing required fields: topic, level, category",
                });
                return;
            }

            const content = await generateCourseContent(topic, level, category);
            res.json(content);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
);

// AI FEATURE 2: Smart Recommendations
router.post(
    "/recommendations",
    aiRateLimiter,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as Request & { auth?: { userId?: string } })
                .auth?.userId;

            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            // Get user's enrolled courses
            const enrolledCourses = await getEnrolledCourses(userId);
            const enrolledData = enrolledCourses.map((c) => ({
                title: c.title,
                category: c.category,
                level: c.level,
            }));

            // Get all available courses
            const allCourses = await getAllCourses();
            const availableCourses = allCourses
                .filter((c) => !enrolledCourses.find((ec) => ec.id === c.id))
                .map((c) => ({
                    id: c.id,
                    title: c.title,
                    category: c.category,
                    level: c.level,
                    tags: c.tags,
                }));

            const recommendations = await recommendCourses(
                enrolledData,
                availableCourses,
                userId,
            );
            res.json({ recommendations });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
);

// AI FEATURE 3: Learning Insights
router.get(
    "/learning-insights",
    aiRateLimiter,
    async (req: Request, res: Response) => {
        try {
            const userId = (req as Request & { auth?: { userId?: string } })
                .auth?.userId;

            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            // Get user's enrolled courses
            const enrolledCourses = await getEnrolledCourses(userId);
            const enrolledData = enrolledCourses.map((c) => ({
                title: c.title,
                category: c.category,
                level: c.level,
            }));

            const insights = await generateLearningInsights(enrolledData);
            res.json(insights);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },
);

export default router;
