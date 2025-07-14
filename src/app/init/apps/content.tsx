"use client";

import { AssetGallery } from "@/app/init/_c_/asset-gallery";
import { Cat } from "vx/cats/d";

interface Props {
  data: Cat[];
}
export const Content = ({ data }: Props) => {
  return <AssetGallery category="apps" data={data} />;
};
