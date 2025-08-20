import { defineSchema, defineTable } from "convex/server";
import { AdminSchema } from "./admins/d";
import { UserSchema } from "vx/users/d";
import { CategorySchema } from "./categories/d";
import { CatSchema } from "./cats/d";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  /// == ADMINS ==
  admins: defineTable(AdminSchema)
    .index("by_aid", ["aid"])
    .index("by_name", ["name"])
    .index("by_creator", ["created_by"]),
  /// == USERS ==
  users: defineTable(UserSchema)
    .index("by_uid", ["uid"])
    .index("by_email", ["email"])
    .index("by_account_id", ["accountId"])
    .searchIndex("name", { searchField: "fullname" })
    .searchIndex("uid", { searchField: "uid" }),
  /// == CATEGORIES ==
  categories: defineTable(CategorySchema)
    .index("by_cid", ["cid"])
    .index("by_name", ["name"])
    .index("by_creator", ["creator"]),
  /// == CATS ==
  cats: defineTable(CatSchema)
    .index("by_cid", ["cid"])
    .index("by_name", ["name"])
    .index("by_creator", ["created_by"]),
});
