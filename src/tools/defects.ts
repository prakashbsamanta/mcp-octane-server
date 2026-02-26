import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "../octane";
import { SearchDefectsSchema, GetDefectDetailsSchema, CreateDefectSchema, UpdateDefectSchema } from "../schemas";

/**
 * Handle execution of defect-related tools.
 */
export async function handleDefectsTools(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "search_defects": {
            const { query, limit = 50 } = SearchDefectsSchema.parse(args);

            // Formatting the Octane query syntax for "name" and "description"
            const octaneQuery = `"*"*${query}*"*"`;
            // Basic text search or standard query logic fallback
            const queryParam = query.includes("=") ? query : `(name="*${query}*"||description="*${query}*")`;

            const result = await octaneClient
                .get("defects")
                .query(queryParam)
                .limit(limit)
                .fields("id", "name", "severity", "phase", "owner")
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "get_defect_details": {
            const { defect_id } = GetDefectDetailsSchema.parse(args);
            const result = await octaneClient
                .get("defects")
                .at(Number(defect_id))
                .fields("id", "name", "description", "severity", "phase", "owner", "author", "priority", "comments")
                .execute();
            // To fetch comments specifically if they are a separate endpoint
            // ALM Octane usually returns relational fields natively if requested or linked
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "create_defect": {
            const { name: defectName, description, severity, priority } = CreateDefectSchema.parse(args);

            const playload: any = {
                name: defectName,
                description,
                severity: { type: "list_node", id: severity },
                phase: { type: "phase", id: "phase.defect.new" } // Standard default phase
            };

            if (priority) {
                playload.priority = { type: "list_node", id: priority };
            }

            const result = await octaneClient
                .create("defects", playload)
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "update_defect": {
            const { defect_id, phase, severity } = UpdateDefectSchema.parse(args);

            const payload: any = {};
            if (phase) payload.phase = { type: "phase", id: phase };
            if (severity) payload.severity = { type: "list_node", id: severity };

            if (Object.keys(payload).length === 0) {
                return { content: [{ type: "text", text: "No fields provided to update." }] };
            }

            const result = await octaneClient
                .update("defects", { id: Number(defect_id), ...payload })
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
