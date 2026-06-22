import { Router, Request, Response } from "express";
import { chatRequestSchema } from "@skillforge/shared";
import { aiRateLimiter } from "../middleware/rateLimit";
import { streamChat, getChatHistory } from "../services/aiService";

const router = Router();

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

  const userId = (req as Request & { auth?: { userId?: string } }).auth?.userId;

  await streamChat(
    parsed.data,
    userId,
    (text) => {
      res.write(`data: ${JSON.stringify({ type: "chunk", content: text })}\n\n`);
    },
    (conversationId) => {
      res.write(`data: ${JSON.stringify({ type: "done", conversationId })}\n\n`);
      res.end();
    },
    (error) => {
      res.write(`data: ${JSON.stringify({ type: "error", error })}\n\n`);
      res.end();
    }
  );
});

router.get("/chat/:conversationId", async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { auth?: { userId?: string } }).auth?.userId;
    const messages = await getChatHistory(String(req.params.conversationId), userId);
    if (!messages) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
