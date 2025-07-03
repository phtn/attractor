import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "vx/users/d";
import { CategorySchema } from "./categories/d";
import { CatSchema } from "./cats/d";

export default defineSchema({
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
    .index("by_title", ["title"])
    .index("by_creator", ["creator"]),
  /// == CATS ==
  cats: defineTable(CatSchema)
    .index("by_cid", ["cid"])
    .index("by_name", ["name"])
    .index("by_creator", ["created_by"]),
});
