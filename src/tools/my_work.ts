import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "../octane";
import { GetMyWorkSchema } from "../schemas";

/**
 * Handle execution of my_work tools.
 */
export async function handleMyWorkTools(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "get_my_work": {
            const { user_email } = GetMyWorkSchema.parse(args);

            // If user_email is provided we could query by author/owner email instead.
            // E.g., owner={email='user@domain.com'}
            const queryParam = user_email ? `owner={email='${user_email}'}` : undefined;

            let queryBuilder = octaneClient.get("work_items");
            if (queryParam) {
                queryBuilder = queryBuilder.query(queryParam);
            }

            const result = await queryBuilder
                .limit(50)
                .fields("id", "name", "phase", "author", "owner", "subtype")
                .execute();

            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
