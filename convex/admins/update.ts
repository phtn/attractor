import { v } from "convex/values";
import { mutation } from "vx/_generated/server";
import { AdminSchema } from "./d";

export const update = mutation({
  args: { aid: v.id("admins"), data: AdminSchema },
  handler: async ({ db }, args) => {
    const { aid, data } = args;
    const admin = await db.get(aid);
    if (admin)
      // { text: "foo", status: { done: true }, _id: ... }

      // Add `tag` and overwrite `status`:
      await db.patch(admin._id, { ...data, updated_at: Date.now() });
    // { text: "foo", tag: "bar", status: { archived: true }, _id: ... }

    // Unset `tag` by setting it to `undefined`
    // await db.patch(id, { tag: undefined });
    // console.log(await db.get(id));
    // { text: "foo", status: { archived: true }, _id: ... }
  },
});

export default update;
