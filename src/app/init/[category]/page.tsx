import { convex } from "@/lib/convex/client";
import { api } from "@@/api";
import { Cat } from "vx/cats/d";
import { Content } from "./content";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const cats = (await convex.query(api.cats.get.active)) as Cat[];
  const category = (await params).category;
  return <Content cats={cats} category={category} />;
}
