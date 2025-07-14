"use client";

import { AssetGallery } from "@/app/init/_c_/asset-gallery";
import { XCardProps } from "@/components/hyper/xcard";

interface Props {
  data: XCardProps[];
}
export const Content = ({ data }: Props) => {
  return <AssetGallery category="apps" data={data} />;
};
