import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: true,
    clean: true,
    platform: 'node',
    noExternal: ['@microfocus/alm-octane-js-rest-sdk', 'axios', 'dotenv', 'zod', '@modelcontextprotocol/sdk'],
    shims: true
});
