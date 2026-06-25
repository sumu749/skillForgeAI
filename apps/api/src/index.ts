import express from "express";
import cors from "cors";
import { config } from "./config";
import { connectDatabase } from "./db/connection";
import { seedCourses, seedReviews } from "./seed/courses";
import { seedCourses as persistSeed } from "./services/courseService";
import { apiRateLimiter } from "./middleware/rateLimit";
import { optionalAuth } from "./middleware/auth";
import coursesRouter from "./routes/courses";
import aiRouter from "./routes/ai";
import usersRouter from "./routes/users";

async function bootstrap() {
    const storageMode = await connectDatabase();
    await persistSeed(seedCourses, seedReviews);

    const app = express();

    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                const allowedOrigins = [config.webUrl, "http://localhost:3000"];
                const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(
                    origin,
                );
                const is127 = /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

                if (
                    allowedOrigins.includes(origin) ||
                    (config.nodeEnv === "development" && (isLocalhost || is127))
                ) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
        }),
    );
    app.use(express.json({ limit: "1mb" }));
    app.use(apiRateLimiter);
    app.use(optionalAuth());

    app.get("/", (_req, res) => {
        res.json({
            success: true,
            message: "SkillForge API is running 🚀",
            docs: "/api/health",
        });
    });

    app.get("/api/health", (_req, res) => {
        res.json({
            status: "ok",
            storage: storageMode,
            timestamp: new Date().toISOString(),
        });
    });

    app.use("/api/courses", coursesRouter);
    app.use("/api/ai", aiRouter);
    app.use("/api/users", usersRouter);

    app.use((_req, res) => {
        res.status(404).json({ error: "Not found" });
    });

    app.listen(config.port, () => {
        console.log(
            `🚀 SkillForge API running on http://localhost:${config.port}`,
        );
        console.log(`📦 Storage mode: ${storageMode}`);
    });
}

bootstrap().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
