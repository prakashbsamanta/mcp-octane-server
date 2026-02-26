import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "../octane";
import { UpdateStoryStatusSchema, SearchStoriesSchema, CreateStorySchema } from "../schemas";

/**
 * Handle execution of story-related tools.
 */
export async function handleStoriesTools(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "search_stories": {
            const { query, limit = 50 } = SearchStoriesSchema.parse(args);

            // Basic text search or standard query logic fallback
            const queryParam = query.includes("=") ? query : `(name="*${query}*"||description="*${query}*")`;

            const result = await octaneClient
                .get("stories")
                .query(queryParam)
                .limit(limit)
                .fields("id", "name", "phase", "owner")
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "create_story": {
            const { name: storyName, description } = CreateStorySchema.parse(args);

            const payload: any = {
                name: storyName,
                description,
                phase: { type: "phase", id: "phase.story.new" } // Standard default phase
            };

            const result = await octaneClient
                .create("work_items", payload)
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "update_story_status": {
            const { story_id, phase } = UpdateStoryStatusSchema.parse(args);

            const playload: any = {
                phase: { type: "phase", id: phase }
            };

            const result = await octaneClient
                .update("work_items", { id: Number(story_id), ...playload })
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
