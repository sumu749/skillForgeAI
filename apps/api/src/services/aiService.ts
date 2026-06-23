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

function buildSystemPrompt(
    courseContext?: ChatRequest["courseContext"],
): string {
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
    userId?: string,
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
            { upsert: true, new: true },
        );
        return;
    }

    const interactions = readJsonFile<StoredInteraction[]>(CHAT_FILE, []);
    const idx = interactions.findIndex(
        (i) => i.conversationId === conversationId,
    );
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
    onError: (error: string) => void,
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
        const doc = (await ChatInteractionModel.findOne({
            conversationId,
        }).lean()) as {
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

// AI FEATURE 1: Content Generator
export interface GeneratedContent {
    description: string;
    objectives: string[];
    tags: string[];
    summary: string;
}

export async function generateCourseContent(
    topic: string,
    level: string,
    category: string,
): Promise<GeneratedContent> {
    const client = getOpenAIClient();

    if (!client) {
        // Demo mode
        return {
            description: `Learn ${topic} - A comprehensive course covering all aspects of ${topic} for ${level} learners in ${category}.`,
            objectives: [
                `Understand core concepts of ${topic}`,
                `Apply ${topic} principles in real-world projects`,
                `Build practical solutions using ${topic}`,
            ],
            tags: [topic.toLowerCase(), category, level],
            summary: `Master ${topic} with hands-on projects and expert instruction.`,
        };
    }

    try {
        const response = await client.chat.completions.create({
            model: config.openaiModel,
            messages: [
                {
                    role: "system",
                    content: `You are an expert course content creator. Generate compelling educational content. Return JSON only with no markdown.`,
                },
                {
                    role: "user",
                    content: `Generate course content for a ${level} ${category} course about "${topic}". Return JSON with: description (2-3 sentences), objectives (3-4 learning outcomes as array), tags (3-4 relevant tags), summary (1 sentence).`,
                },
            ],
            temperature: 0.7,
            max_tokens: 800,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "{}";
        return JSON.parse(content) as GeneratedContent;
    } catch (error) {
        console.error("Error generating course content:", error);
        throw new Error("Failed to generate course content");
    }
}

// AI FEATURE 2: Smart Recommendations
export interface CourseRecommendation {
    courseId: string;
    title: string;
    reason: string;
    matchScore: number;
}

export async function recommendCourses(
    userEnrolledCourses: Array<{
        title: string;
        category: string;
        level: string;
    }>,
    allCourses: Array<{
        id: string;
        title: string;
        category: string;
        level: string;
        tags: string[];
    }>,
    userId?: string,
): Promise<CourseRecommendation[]> {
    const client = getOpenAIClient();

    const enrolledTitles = userEnrolledCourses.map((c) => c.title).join(", ");
    const coursesList = allCourses
        .slice(0, 30) // Limit for prompt size
        .map(
            (c) =>
                `${c.id}:|${c.title}|${c.category}|${c.level}|${c.tags.join(",")}`,
        )
        .join("\n");

    if (!client || !enrolledTitles) {
        // Demo recommendations
        return allCourses.slice(0, 3).map((course) => ({
            courseId: course.id,
            title: course.title,
            reason: "Recommended based on your learning path",
            matchScore: 0.8,
        }));
    }

    try {
        const response = await client.chat.completions.create({
            model: config.openaiModel,
            messages: [
                {
                    role: "system",
                    content: `You are an expert learning advisor. Recommend relevant courses. Return JSON only with no markdown.`,
                },
                {
                    role: "user",
                    content: `User has completed: ${enrolledTitles}

Available courses:
${coursesList}

Recommend 3-5 courses that would best help them progress. Return JSON array with: [{ "courseId": "...", "title": "...", "reason": "...", "matchScore": 0.0-1.0 }]`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "[]";
        const parsed = JSON.parse(content);
        return (parsed.recommendations || parsed) as CourseRecommendation[];
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return allCourses.slice(0, 3).map((course) => ({
            courseId: course.id,
            title: course.title,
            reason: "Recommended course",
            matchScore: 0.7,
        }));
    }
}

// AI FEATURE 3: Learning Insights
export interface LearningInsight {
    progressSummary: string;
    strengths: string[];
    recommendations: string[];
    nextSteps: string[];
    motivationalMessage: string;
}

export async function generateLearningInsights(
    enrolledCourses: Array<{ title: string; category: string; level: string }>,
    totalHoursSpent?: number,
    coursesCompleted?: number,
): Promise<LearningInsight> {
    const client = getOpenAIClient();

    const coursesList = enrolledCourses
        .map((c) => `${c.title} (${c.level})`)
        .join(", ");

    if (!client || enrolledCourses.length === 0) {
        return {
            progressSummary:
                "Start your learning journey by enrolling in a course!",
            strengths: ["Ready to learn", "Curious mindset"],
            recommendations: [
                "Choose a course that interests you",
                "Set learning goals",
            ],
            nextSteps: ["Browse available courses", "Pick your first course"],
            motivationalMessage:
                "Every expert was once a beginner. Start today!",
        };
    }

    try {
        const response = await client.chat.completions.create({
            model: config.openaiModel,
            messages: [
                {
                    role: "system",
                    content: `You are a supportive learning coach. Provide personalized insights. Return JSON only with no markdown.`,
                },
                {
                    role: "user",
                    content: `A student has taken: ${coursesList}
Total hours spent: ${totalHoursSpent || 0}
Courses completed: ${coursesCompleted || 0}

Provide learning insights. Return JSON with: progressSummary (1-2 sentences), strengths (3 key strengths as array), recommendations (3 improvement suggestions), nextSteps (3 next steps), motivationalMessage (encouraging statement).`,
                },
            ],
            temperature: 0.7,
            max_tokens: 800,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "{}";
        return JSON.parse(content) as LearningInsight;
    } catch (error) {
        console.error("Error generating learning insights:", error);
        return {
            progressSummary: `You've enrolled in ${enrolledCourses.length} courses!`,
            strengths: ["Committed learner", "Exploring diverse topics"],
            recommendations: [
                "Focus on one course at a time",
                "Practice hands-on projects",
            ],
            nextSteps: [
                "Complete your current courses",
                "Join the community forums",
            ],
            motivationalMessage: "You're building valuable skills. Keep going!",
        };
    }
}
