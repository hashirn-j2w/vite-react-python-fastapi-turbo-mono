import { defineConfig } from "@hey-api/openapi-ts"

// Generated from the FastAPI schema (`turbo run generate` exports it first).
export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: {
    path: "src/gen",
    clean: true,
  },
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    "zod",
    // Validate responses at runtime against the generated Zod schemas.
    { name: "@hey-api/sdk", validator: true },
    "@tanstack/react-query",
  ],
})
