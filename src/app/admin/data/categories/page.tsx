import { api } from "@@/api";
import { ConvexHttpClient } from "convex/browser";
import { Content } from "./content";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

export default async function CategoriesPage() {
  const cats = await convex.query(api.cats.get.active);

  return (
    <div className="p-4">
      <Content data={cats} />
    </div>
  );
}
