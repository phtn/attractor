"use client";

import { HyperList } from "@/components/hyper";
import { CatZod } from "@/components/tanstack/form/schema";
import { CardImageItem } from "./image-item";

interface Props<T> {
  category?: string;
  data: T[];
}
export const AssetGallery = <T extends CatZod>({
  // category,
  data,
}: Props<T>) => {
  // const filteredAssets = assets.filter((asset) => asset.category === category);

  return (
    <HyperList
      data={data}
      component={CardImageItem}
      container="grid grid-cols-1 md:grid-cols-3 md:gap-8 md:p-0 p-4 w-full overflow-visible"
    />
  );
};
