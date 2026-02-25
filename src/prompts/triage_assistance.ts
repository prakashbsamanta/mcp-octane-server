import { octaneClient } from "../octane";
import { TriageAssistancePromptSchema } from "../schemas";

/**
 * Handle triage_assistance prompt
 */
export async function getTriageAssistancePrompt(args: unknown) {
    const { defect_id } = TriageAssistancePromptSchema.parse(args);

    const result = await octaneClient
        .get("defects")
        .at(Number(defect_id))
        .fields("id", "name", "description", "comments")
        .execute();

    const defectData = JSON.stringify(result, null, 2);

    return {
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Analyze the following defect and suggest 3 potential root causes based on the error logs provided.\n\nDefect Data:\n${defectData}`
                }
            }
        ]
    };
}
