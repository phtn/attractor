import { initTRPC } from "@trpc/server";
import { cache } from "react";
export const ctx = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const r = t.router;
export const c = t.createCallerFactory;
export const p = t.procedure;
export const m = t.mergeRouters;
