import { api } from "@@/api";
import { Content } from "./content";
import { convex } from "@/lib/convex/client";

export default async function CategoriesPage() {
  const cats = await convex.query(api.cats.get.active);

  return (
    <div className="p-4">
      <Content data={cats} />
    </div>
  );
}
