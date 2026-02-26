import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { octaneClient } from "../octane";
import { SearchAllSchema, GetManualTestSchema, GetSuiteRunsSchema, GetRunHistorySchema } from "../schemas";

/**
 * Handle execution of Quality-related tools (Tests, Suite Runs, Runs, Search All Work Items).
 */
export async function handleQualityTools(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "search_all": {
            const { query, limit = 50 } = SearchAllSchema.parse(args);

            // Use BK syntax for text search or fallback to literal query if already formatted
            const queryParam = query.includes("=") || query.includes(" BK ")
                ? query
                : `(name BK '*${query}*'||description BK '*${query}*')`;

            const result = await octaneClient
                .get("work_items")
                .query(queryParam)
                .limit(limit)
                .fields("id", "name", "subtype", "phase", "owner")
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "get_manual_test": {
            const { test_id } = GetManualTestSchema.parse(args);
            const result = await octaneClient
                .get("tests")
                .at(Number(test_id))
                .fields("id", "name", "script", "phase", "owner", "subtype")
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "get_suite_runs": {
            const { suite_id, limit = 100 } = GetSuiteRunsSchema.parse(args);

            // Querying for suite runs of a specific test suite
            const queryParam = `test_suite={id=${suite_id}}`;

            const result = await octaneClient
                .get("suite_runs")
                .query(queryParam)
                .limit(limit)
                .fields("id", "name", "status", "native_status", "test_suite")
                .execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        case "get_run_history": {
            const { suite_run_id, limit = 100 } = GetRunHistorySchema.parse(args);

            // Query runs associated with a specific suite run to see pass/fail status
            const queryParam = suite_run_id ? `suite_run={id=${suite_run_id}}` : "";

            const requestChain = octaneClient.get("runs").limit(limit).fields("id", "name", "status", "native_status", "test");

            if (queryParam) {
                requestChain.query(queryParam);
            }

            const result = await requestChain.execute();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
