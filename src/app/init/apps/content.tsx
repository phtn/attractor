"use client";

import { AssetGallery } from "@/app/init/_components/asset-gallery";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "vx/_generated/api";

interface Props {
  preloaded: Preloaded<typeof api.cats.get.active>;
}
export const Content = ({ preloaded }: Props) => {
  const reactive = usePreloadedQuery(preloaded);
  return (
    <div>
      <AssetGallery category="apps" data={reactive} />
      <div>YOOO</div>
    </div>
  );
};
