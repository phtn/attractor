"use client";

import { Cat } from "vx/cats/d";
import { AssetGallery } from "../_components/asset-gallery";

interface Props {
  cats: Cat[];
  category: string;
}
export const Content = ({ cats, category }: Props) => {
  return (
    <div className="flex-1 p-2">
      <AssetGallery data={cats} category={category} />
    </div>
  );
};
