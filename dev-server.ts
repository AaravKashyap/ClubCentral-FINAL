#!/usr/bin/env bun
import { serve } from "@hono/node-server";
import app from "./backend/hono";

const port = 3000;

console.log(`🚀 Server is running on http://localhost:${port}`);
console.log(`📡 tRPC endpoint: http://localhost:${port}/api/trpc`);

serve({
  fetch: app.fetch,
  port,
});