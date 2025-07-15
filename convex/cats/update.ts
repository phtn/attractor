import { v } from "convex/values";
import { mutation } from "vx/_generated/server";
import { CatSchema } from "./d";

export const update = mutation({
  args: { id: v.id("cats"), data: CatSchema },
  handler: async ({ db }, args) => {
    const { id, data } = args;
    console.log(await db.get(id));
    // { text: "foo", status: { done: true }, _id: ... }

    // Add `tag` and overwrite `status`:
    await db.patch(id, { ...data, updated_at: Date.now() });
    console.log(await db.get(id));
    // { text: "foo", tag: "bar", status: { archived: true }, _id: ... }

    // Unset `tag` by setting it to `undefined`
    // await db.patch(id, { tag: undefined });
    // console.log(await db.get(id));
    // { text: "foo", status: { archived: true }, _id: ... }
  },
});

export default update;
