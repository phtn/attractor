import { query } from "@@/server";

export const all = query({
  handler: async ({ db }) => await db.query("categories").collect(),
});
