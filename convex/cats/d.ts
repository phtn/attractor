import { v } from "convex/values";
import { Infer } from "next/dist/compiled/superstruct";

export const CatSchema = v.object({
  cid: v.optional(v.string()),
  name: v.optional(v.string()),
  href: v.optional(v.string()),
  icon: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  desc: v.optional(v.string()),
  slug: v.optional(v.string()),
  image: v.optional(v.string()),
  style: v.optional(v.string()),
  active: v.optional(v.boolean()),
  updated_at: v.optional(v.float64()),
  created_at: v.optional(v.float64()),
  created_by: v.optional(v.string()),
});
export type Cat = Infer<typeof CatSchema>;

// const x = {
//   cid: "cid_x",
//   name: "apps",
//   slug: "apps",
//   desc: "launcher",
//   icon: "app-window",
//   tags: ["app launcher"],
//   href: "https://launch-day-pied.vercel.app",
//   image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
//   style: "col-span-1 row-span-1 bg-muted-foreground dark:bg-zinc-900",
//   updated_at: 1750990279969,
//   created_at: 1750990185000,
//   created_by: "xpriori",
// };
