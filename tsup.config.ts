import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: true,
    clean: true,
    platform: 'node',
    minify: true,
    noExternal: ['@microfocus/alm-octane-js-rest-sdk'],
    shims: true
});
