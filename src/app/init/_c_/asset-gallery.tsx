import { HyperList } from "@/components/hyper";
import { XCard, XCardProps } from "@/components/hyper/xcard";
import { Cat } from "vx/cats/d";

interface Props<T extends Cat> {
  category?: string;
  data: T[];
}
export const AssetGallery = <T extends XCardProps>({ data }: Props<T>) => {
  // const filteredAssets = assets.filter((asset) => asset.category === category);

  return (
    <div className=" h-[calc(80lvh)]">
      <HyperList
        data={data.map((e, idx) => ({ ...e, idx }))}
        component={XCard}
        container="grid grid-cols-1 md:grid-cols-3 md:mt-16 md:gap-8 md:p-0 p-4 h-fit max-h-[80lvh] w-full overflow-visible"
      />
    </div>
  );
};
