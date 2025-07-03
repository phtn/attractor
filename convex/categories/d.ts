import { v } from "convex/values";
import { Infer } from "next/dist/compiled/superstruct";

export const CategorySchema = v.object({
  cid: v.optional(v.string()),
  href: v.optional(v.string()),
  image: v.optional(v.string()),
  title: v.optional(v.string()),
  creator: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  description: v.optional(v.string()),
  className: v.optional(v.string()),
  hasActions: v.optional(v.boolean()),
  updated_at: v.optional(v.float64()),
  created_at: v.optional(v.float64()),
  created_by: v.optional(v.string()),
});
export type Category = Infer<typeof CategorySchema>;
