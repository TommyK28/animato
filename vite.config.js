import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    root: "src",
    publicDir: "../public",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        assetsDir: "assets",
    },
    server: {
        open: true,
        port: 5173,
    },
    resolve: {
        alias: {
            "@": path.resolve(process.cwd(), "src"),
        },
    },
});
