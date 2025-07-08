"use client";

import { AssetGallery } from "@/app/init/_c_/asset-gallery";
import { Breadcrumb } from "@/components/breadcrumb";
import { Cat } from "vx/cats/d";

interface Props {
  data: Cat[];
}
export const Content = ({ data }: Props) => {
  return (
    <>
      <div className="h-20 absolute z-2 flex w-full bg-zinc-300/20">
        <div className="px-4 flex items-center h-10 bg-zinc-300/30 w-full">
          <Breadcrumb root="/" />
        </div>
      </div>
      <AssetGallery category="apps" data={data} />
    </>
  );
};
