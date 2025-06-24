import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "@@/convex/users/d";

export default defineSchema({
  users: defineTable(UserSchema)
    .index("by_uid", ["uid"])
    .index("by_email", ["email"])
    .index("by_account_id", ["accountId"])
    .searchIndex("name", { searchField: "fullname" })
    .searchIndex("uid", { searchField: "uid" }),
});
