import "server-only"; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { c, ctx } from "./init";
import { makeQueryClient } from "@/trpc/query";
import { merged, type AppRouter } from "@/server/routers";
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
const caller = c(merged)(ctx);
export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
