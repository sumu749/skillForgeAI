import { Router, Request, Response } from "express";
import { config } from "../config";
import { requireClerkAuth } from "../middleware/auth";

const router = Router();

async function fetchClerkUsers() {
    const clerkSecret = config.clerkSecretKey;
    if (!clerkSecret) {
        throw new Error("Clerk secret key is not configured.");
    }

    const response = await fetch("https://api.clerk.com/v1/users?limit=100", {
        headers: {
            Authorization: `Bearer ${clerkSecret}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
            `Clerk API request failed: ${response.status} ${errorBody}`,
        );
    }

    const users = (await response.json()) as Array<{
        id: string;
        full_name?: string;
        primary_email_address?: { email_address: string } | null;
        email_addresses?: Array<{ email_address: string }>;
        public_metadata?: Record<string, unknown>;
        created_at?: string;
    }>;

    return users.map((user) => ({
        id: user.id,
        name: user.full_name || "Unknown",
        email:
            user.primary_email_address?.email_address ||
            user.email_addresses?.[0]?.email_address ||
            "Unknown",
        role: String(user.public_metadata?.role || "user"),
        joined: user.created_at || "Unknown",
    }));
}

router.get("/", requireClerkAuth(), async (_req: Request, res: Response) => {
    try {
        const users = await fetchClerkUsers();
        res.json({ data: users });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch users.";
        res.status(500).json({ error: message });
    }
});

export default router;
