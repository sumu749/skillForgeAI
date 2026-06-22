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

async function bootstrap() {
  const storageMode = await connectDatabase();
  await persistSeed(seedCourses, seedReviews);

  const app = express();

  app.use(
    cors({
      origin: [config.webUrl, "http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimiter);
  app.use(optionalAuth());

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      storage: storageMode,
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/courses", coursesRouter);
  app.use("/api/ai", aiRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.listen(config.port, () => {
    console.log(`🚀 SkillForge API running on http://localhost:${config.port}`);
    console.log(`📦 Storage mode: ${storageMode}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
