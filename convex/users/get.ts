import { query } from "vx/_generated/server";

export const byId = query({
  handler: async ({ db }, { uid }: { uid: string }) =>
    await db
      .query("users")
      .filter((q) => q.eq(q.field("uid"), uid))
      .collect(),
});
