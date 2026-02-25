import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file if present
dotenv.config();

const configSchema = z.object({
    OCTANE_URL: z.string().url("OCTANE_URL must be a valid URL"),
    OCTANE_SHARED_SPACE_ID: z.string().min(1, "OCTANE_SHARED_SPACE_ID is required"),
    OCTANE_WORKSPACE_ID: z.string().min(1, "OCTANE_WORKSPACE_ID is required"),
    OCTANE_CLIENT_ID: z.string().min(1, "OCTANE_CLIENT_ID is required"),
    OCTANE_CLIENT_SECRET: z.string().min(1, "OCTANE_CLIENT_SECRET is required"),
});

// Validate environment variables on startup
const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
    console.error("❌ Invalid environment variables:", parsedConfig.error.format());
    process.exit(1);
}

export const env = parsedConfig.data;
