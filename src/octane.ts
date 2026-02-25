import { Octane } from "@microfocus/alm-octane-js-rest-sdk";
import { env } from "./config";

// Initialize the Octane SDK Client using environment variables
export const octaneClient = new Octane({
    server: env.OCTANE_URL,
    sharedSpace: Number(env.OCTANE_SHARED_SPACE_ID),
    workspace: Number(env.OCTANE_WORKSPACE_ID),
    user: env.OCTANE_CLIENT_ID,
    password: env.OCTANE_CLIENT_SECRET,
});

/**
 * Perform authentication to ensure the client is ready
 */
export async function authenticateOctane() {
    try {
        // The SDK automatically handles the authentication endpoint using the config
        await octaneClient.authenticate();
        console.error("✅ Octane SDK Authenticated Successfully.");
    } catch (error: any) {
        console.error("❌ Octane SDK Authentication Failed:");
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
        throw error;
    }
}
