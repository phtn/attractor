import { HyperList } from "@/components/hyper";
import { XCard, XCardProps } from "@/components/hyper/xcard";
import { Cat } from "vx/cats/d";

interface Props<T> {
  category?: string;
  data: T[];
}
export const AssetGallery = ({ data }: Props<Cat & XCardProps>) => {
  return (
    <HyperList
      delay={5}
      data={data}
      component={XCard}
      container="grid grid-cols-1 md:grid-cols-3 md:mt-2 md:gap-12 md:p-0 p-4 h-fit max-h-[80lvh] w-full overflow-visible"
    />
  );
};
