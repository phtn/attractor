"use client";

import { Cat } from "vx/cats/d";
import { AssetGallery } from "../_components/asset-gallery";
import CategoryGrid from "../_components/category-grid";

interface Props {
  cats: Cat[];
  category: string;
}
export const Content = ({ cats, category }: Props) => {
  return (
    <div className="flex-1 p-4">
      <CategoryGrid cats={cats} />
      <AssetGallery data={cats} category={category} />
    </div>
  );
};
