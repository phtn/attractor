import { query } from "@@/server";

export const all = query({
  handler: async ({ db }) => await db.query("cats").collect(),
});

export const active = query({
  handler: async ({ db }) =>
    await db
      .query("cats")
      .filter((q) => q.eq(q.field("active"), true))
      .collect(),
});
