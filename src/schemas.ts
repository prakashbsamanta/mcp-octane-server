import { z } from "zod";

export const SearchDefectsSchema = z.object({
    query: z.string().describe("Query string to search for defects. Use Octane query syntax or basic text."),
    limit: z.number().optional().describe("Maximum number of defects to return"),
});

export const GetDefectDetailsSchema = z.object({
    defect_id: z.union([z.string(), z.number()]).describe("ID of the defect to fetch details for"),
});

export const CreateDefectSchema = z.object({
    name: z.string().describe("Name/Summary of the new defect"),
    description: z.string().describe("Detailed description of the defect"),
    severity: z.string().describe("Severity ID or string, e.g., 'high', 'medium', 'low'"),
    priority: z.string().optional().describe("Priority ID or string"),
});

export const UpdateDefectSchema = z.object({
    defect_id: z.union([z.string(), z.number()]).describe("ID of the defect to update"),
    phase: z.string().optional().describe("Target phase literal, e.g., 'phase.defect.fixed'"),
    severity: z.string().optional().describe("Severity ID or string"),
});

export const UpdateStoryStatusSchema = z.object({
    story_id: z.union([z.string(), z.number()]).describe("ID of the user story"),
    phase: z.string().describe("Target phase literal, e.g., 'In Progress', 'Done'"),
});

export const SearchStoriesSchema = z.object({
    query: z.string().describe("Query string to search for user stories. Use Octane query syntax or basic text."),
    limit: z.number().optional().describe("Maximum number of stories to return"),
});

export const CreateStorySchema = z.object({
    name: z.string().describe("Name/Summary of the new user story"),
    description: z.string().describe("Detailed description of the user story"),
});

export const GetMyWorkSchema = z.object({
    user_email: z.string().optional().describe("Email of the user to get work for. Defaults to the authenticated user."),
});

// Zod schemas for Prompts
export const TriageAssistancePromptSchema = z.object({
    defect_id: z.string().describe("ID of the defect to triage"),
});
