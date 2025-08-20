import { query } from "@@/server";

export const all = query({
  handler: async ({ db }) => await db.query("admins").collect(),
});

export const active = query({
  handler: async ({ db }) =>
    await db
      .query("admins")
      .filter((q) => q.eq(q.field("active"), true))
      .collect(),
});
