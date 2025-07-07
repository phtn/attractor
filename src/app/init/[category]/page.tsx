import { AssetGallery } from "@/app/init/_c_/asset-gallery";
import CategoryGrid from "@/app/init/_c_/category-grid";
import { convex } from "@/lib/convex/client";
import { api } from "@@/api";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cats = await convex.query(api.cats.get.active);
  return (
    <div className="flex-1 p-4">
      <CategoryGrid cats={cats} />
      <AssetGallery data={cats} category={params.category} />
    </div>
  );
}
