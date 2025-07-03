import AssetGallery from "@/app/init/_c_/asset-gallery";
import CategoryGrid from "@/app/init/_c_/category-grid";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@@/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cats = await convex.query(api.cats.get.active);
  return (
    <div className="flex-1 p-4">
      <CategoryGrid cats={cats} />
      <AssetGallery category={params.category} />
    </div>
  );
}
