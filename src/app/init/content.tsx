"use client";

import { AssetGallery } from "@/app/init/_components/asset-gallery";
import { XCardProps } from "@/components/hyper/xcard";

interface Props {
  data: XCardProps[];
}
export const Content = ({ data }: Props) => {
  return (
    <div>
      <AssetGallery category="apps" data={data} />
    </div>
  );
};
