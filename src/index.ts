#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "./octane";
import { handleDefectsTools } from "./tools/defects";
import { handleStoriesTools } from "./tools/stories";
import { handleMyWorkTools } from "./tools/my_work";
import { getTriageAssistancePrompt } from "./prompts/triage_assistance";

const server = new Server(
    {
        name: "octane-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
            prompts: {},
        },
    }
);

// Authenticate on startup
octaneClient.authenticate();

// List Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_defects",
                description: "Search for defects using basic text query or Octane query syntax.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search term" },
                        limit: { type: "number", description: "Limit number of results" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_defect_details",
                description: "Fetch full details including comments for a specific defect.",
                inputSchema: {
                    type: "object",
                    properties: {
                        defect_id: { type: ["string", "number"], description: "ID of the defect" },
                    },
                    required: ["defect_id"],
                },
            },
            {
                name: "update_defect",
                description: "Update the status or severity of an existing defect.",
                inputSchema: {
                    type: "object",
                    properties: {
                        defect_id: { type: ["string", "number"], description: "ID of the defect" },
                        phase: { type: "string", description: "Target phase literal (optional)" },
                        severity: { type: "string", description: "Target severity literal (optional)" },
                    },
                    required: ["defect_id"],
                },
            },
            {
                name: "create_defect",
                description: "Create a new defect.",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Defect Name/Summary" },
                        description: { type: "string", description: "Detailed description" },
                        severity: { type: "string", description: "Severity list node ID" },
                        priority: { type: "string", description: "Priority list node ID (optional)" },
                    },
                    required: ["name", "description", "severity"],
                },
            },
            {
                name: "update_story_status",
                description: "Update the phase status of a user story.",
                inputSchema: {
                    type: "object",
                    properties: {
                        story_id: { type: ["string", "number"], description: "ID of the User Story" },
                        phase: { type: "string", description: "Target phase literal (e.g. 'phase.story.done')" },
                    },
                    required: ["story_id", "phase"],
                },
            },
            {
                name: "search_stories",
                description: "Search for user stories using basic text query or Octane query syntax.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search term" },
                        limit: { type: "number", description: "Limit number of results" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "create_story",
                description: "Create a new user story.",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "User Story Name/Summary" },
                        description: { type: "string", description: "Detailed description" },
                    },
                    required: ["name", "description"],
                },
            },
            {
                name: "get_my_work",
                description: "Fetch items assigned to a specific email (or the current user if omitted).",
                inputSchema: {
                    type: "object",
                    properties: {
                        user_email: { type: "string", description: "Email of the assigned user" },
                    },
                },
            },
        ],
    };
});

// Build Prompt Handlers Map
const promptRegistry = [
    {
        name: "triage_assistance",
        description: "Analyze a defect and suggest potential root causes based on error logs.",
        arguments: [
            {
                name: "defect_id",
                description: "ID of the defect to triage",
                required: true,
            },
        ],
    },
];

server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts: promptRegistry };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "triage_assistance") {
        // getTriageAssistancePrompt handles actual format mapping
        const promptDef = await getTriageAssistancePrompt(args);
        return promptDef as any;
    }
    throw new Error(`Prompt not found: ${name}`);
});

// Execute Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;

    try {
        if (["search_defects", "get_defect_details", "create_defect", "update_defect"].includes(name)) {
            return await handleDefectsTools(request);
        }
        if (["update_story_status", "search_stories", "create_story"].includes(name)) {
            return await handleStoriesTools(request);
        }
        if (name === "get_my_work") {
            return await handleMyWorkTools(request);
        }

        throw new Error(`Tool not found: ${name}`);
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing tool ${name}: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

// Start Server
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Octane MCP Server is running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
