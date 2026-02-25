import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "../octane";
import { UpdateStoryStatusSchema } from "../schemas";

/**
 * Handle execution of story-related tools.
 */
export async function handleStoriesTools(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
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
