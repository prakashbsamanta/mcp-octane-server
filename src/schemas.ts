import { z } from "zod";

export const SearchAllSchema = z.object({
    query: z.string().describe("Query string to search across the workspace (e.g. Work Items). Using BK allows finding substrings."),
    limit: z.number().optional().describe("Maximum number of results to return"),
});

export const GetManualTestSchema = z.object({
    test_id: z.union([z.string(), z.number()]).describe("ID of the manual test (MT) to fetch details (script/steps) for"),
});

export const GetSuiteRunsSchema = z.object({
    suite_id: z.union([z.string(), z.number()]).describe("ID of the test suite (RC Suite) to fetch its past runs for"),
    limit: z.number().optional()
});

export const GetRunHistorySchema = z.object({
    suite_run_id: z.union([z.string(), z.number()]).optional().describe("ID of the suite_run to fetch the children runs' results (pass/fail status)."),
    limit: z.number().optional()
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
