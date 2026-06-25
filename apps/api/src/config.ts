import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/skillforge",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
    clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
    webUrl: process.env.WEB_URL || "http://localhost:3000",
    webUrls: process.env.WEB_URLS?.split(",")
        .map((url) => url.trim())
        .filter(Boolean) || [process.env.WEB_URL || "http://localhost:3000"],
    useMongo: process.env.USE_MONGO !== "false",
};
