import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage, ChatRequest } from "@skillforge/shared";
import { config } from "../config";
import { getStorageMode } from "../db/connection";
import { ChatInteractionModel } from "../models/ChatInteraction";
import { readJsonFile, writeJsonFile } from "../db/jsonStorage";

const CHAT_FILE = "chat-interactions.json";

interface StoredInteraction {
  id: string;
  userId?: string;
  conversationId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

function buildSystemPrompt(courseContext?: ChatRequest["courseContext"]): string {
  let prompt = `You are SkillForge AI Tutor, an expert learning assistant for the SkillForge AI online learning platform.

Your role:
- Help learners understand course concepts, programming, data science, cloud, and tech topics
- Provide clear explanations with examples and step-by-step guidance
- Recommend relevant SkillForge courses when appropriate
- Encourage hands-on practice and project-based learning
- Be supportive, concise, and educational

Guidelines:
- Use markdown formatting for code blocks and lists when helpful
- If asked about non-educational topics, gently redirect to learning
- Never make up course names — only reference real SkillForge courses if you know them
- Keep responses focused and actionable`;

  if (courseContext?.courseTitle) {
    prompt += `\n\nThe learner is currently viewing the course: "${courseContext.courseTitle}". Tailor your answers to this context when relevant.`;
  }

  return prompt;
}

function getOpenAIClient(): OpenAI | null {
  if (!config.openaiApiKey || config.openaiApiKey.startsWith("sk-your")) {
    return null;
  }
  return new OpenAI({ apiKey: config.openaiApiKey });
}

export async function saveInteraction(
  conversationId: string,
  messages: ChatMessage[],
  userId?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (getStorageMode() === "mongo") {
    await ChatInteractionModel.findOneAndUpdate(
      { conversationId },
      {
        id: uuidv4(),
        userId,
        conversationId,
        messages,
      },
      { upsert: true, new: true }
    );
    return;
  }

  const interactions = readJsonFile<StoredInteraction[]>(CHAT_FILE, []);
  const idx = interactions.findIndex((i) => i.conversationId === conversationId);
  const entry: StoredInteraction = {
    id: idx >= 0 ? interactions[idx].id : uuidv4(),
    userId,
    conversationId,
    messages,
    createdAt: idx >= 0 ? interactions[idx].createdAt : now,
    updatedAt: now,
  };
  if (idx >= 0) interactions[idx] = entry;
  else interactions.push(entry);
  writeJsonFile(CHAT_FILE, interactions);
}

export async function streamChat(
  request: ChatRequest,
  userId: string | undefined,
  onChunk: (text: string) => void,
  onDone: (conversationId: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const client = getOpenAIClient();
  const conversationId = request.conversationId || uuidv4();

  if (!client) {
    const demoResponse =
      "I'm SkillForge AI Tutor (demo mode). Configure your **OPENAI_API_KEY** in `apps/api/.env` to enable live AI responses.\n\nMeanwhile, I can tell you that SkillForge offers courses in web development, data science, cloud computing, cybersecurity, and more. What would you like to learn today?";
    for (const word of demoResponse.split(" ")) {
      onChunk(word + " ");
      await new Promise((r) => setTimeout(r, 30));
    }
    const allMessages: ChatMessage[] = [
      ...request.messages,
      { role: "assistant", content: demoResponse },
    ];
    await saveInteraction(conversationId, allMessages, userId);
    onDone(conversationId);
    return;
  }

  const systemMessage: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(request.courseContext),
  };

  const messages = [systemMessage, ...request.messages];

  try {
    const stream = await client.chat.completions.create({
      model: config.openaiModel,
      messages,
      stream: true,
      max_tokens: 1500,
      temperature: 0.7,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        fullResponse += text;
        onChunk(text);
      }
    }

    const allMessages: ChatMessage[] = [
      ...request.messages,
      { role: "assistant", content: fullResponse },
    ];
    await saveInteraction(conversationId, allMessages, userId);
    onDone(conversationId);
  } catch (error) {
    onError((error as Error).message || "Failed to generate response");
  }
}

export async function getChatHistory(conversationId: string, userId?: string) {
  if (getStorageMode() === "mongo") {
    const doc = await ChatInteractionModel.findOne({ conversationId }).lean() as {
      userId?: string;
      messages: ChatMessage[];
    } | null;
    if (!doc) return null;
    if (userId && doc.userId && doc.userId !== userId) return null;
    return doc.messages;
  }

  const interactions = readJsonFile<StoredInteraction[]>(CHAT_FILE, []);
  const found = interactions.find((i) => i.conversationId === conversationId);
  if (!found) return null;
  if (userId && found.userId && found.userId !== userId) return null;
  return found.messages;
}
