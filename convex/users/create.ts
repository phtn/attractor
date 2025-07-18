import { mutation } from "@@/server";
import { CreateUserSchema } from "./d";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@@/dataModel";
import { Infer } from "convex/values";
import { generateId } from "ai";

const create = mutation({
  args: CreateUserSchema,
  handler: async (
    { db }: { db: GenericDatabaseWriter<DataModel> },
    data: Infer<typeof CreateUserSchema>,
  ) => {
    const user = await checkUser(db, data.uid);
    if (user !== null) {
      await db.patch(user._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    const { email, emailVerified, fullname, phone, metadata } = data;

    return await db.insert("users", {
      ...data,
      email,
      phone,
      fullname,
      metadata,
      emailVerified,
      uid: generateId(),
      accountId: generateId(),
      updated_at: Date.now(),
      created_at: Date.now(),
      username: data.email?.split("@").shift() ?? "",
      balance: { currencyCode: "PHP", fractionalDigits: 2, amount: 0 },
      contact: { email, phone, name: fullname },
      location: "",
    });
  },
});

export default create;

export const checkUser = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  uid: string,
) =>
  await db
    .query("users")
    .withIndex("by_uid", (q) => q.eq("uid", uid))
    .first();

export const findUserByEmail = async <
  DB extends GenericDatabaseWriter<DataModel>,
>(
  db: DB,
  email: string | undefined,
) =>
  email &&
  (await db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first());
