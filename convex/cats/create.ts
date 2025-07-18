import { mutation } from "@@/server";
import { CatSchema } from "./d";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@@/dataModel";
import { generateId } from "ai";

const create = mutation({
  args: CatSchema,
  handler: async ({ db }, data) => {
    const cat = data?.name && (await checkItem(db, data.name));
    if (cat) {
      await db.patch(cat._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    return await db.insert("cats", {
      ...data,
      cid: generateId(),
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
    .query("categories")
    .withIndex("by_name", (q) => q.eq("name", name))
    .first();
