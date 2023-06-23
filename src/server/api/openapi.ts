import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "@/server/api/root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
});