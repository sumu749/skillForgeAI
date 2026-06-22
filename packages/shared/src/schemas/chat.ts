import { z } from "zod";

export const chatRoleSchema = z.enum(["user", "assistant", "system"]);

export const chatMessageSchema = z.object({
  role: chatRoleSchema,
  content: z.string().min(1).max(8000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  conversationId: z.string().optional(),
  courseContext: z
    .object({
      courseId: z.string().optional(),
      courseTitle: z.string().optional(),
    })
    .optional(),
});

export const chatInteractionSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  conversationId: z.string(),
  messages: z.array(chatMessageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatInteraction = z.infer<typeof chatInteractionSchema>;
