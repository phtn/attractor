import { mutation } from "@@/server";
import { AdminSchema } from "./d";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@@/dataModel";
import { generateId } from "ai";

const create = mutation({
  args: AdminSchema,
  handler: async ({ db }, data) => {
    const admin = data?.name && (await checkItem(db, data.name));
    if (admin) {
      await db.patch(admin._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    return await db.insert("admins", {
      ...data,
      aid: generateId(),
      updated_at: Date.now(),
      created_at: Date.now(),
    });
  },
});

export default create;

export const checkItem = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  name: string,
) =>
  await db
    .query("admins")
    .withIndex("by_name", (q) => q.eq("name", name))
    .first();
