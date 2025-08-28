import { HyperList } from "@/components/hyper";
import { XCardProps } from "@/components/hyper/xcard";
import { Cat } from "vx/cats/d";
import { Icon } from "@/lib/icons";

interface Props<T> {
  category?: string;
  data: T[];
}
export const AssetGallery = ({ data }: Props<Cat & XCardProps>) => {
  return (
    <HyperList
      delay={5}
      data={data}
      component={IconCard}
      container="grid grid-cols-1 md:grid-cols-3 md:mt-2 md:gap-12 md:p-0 p-4 h-fit max-h-[80lvh] w-full overflow-visible"
    ></HyperList>
  );
};

const IconCard = (item: XCardProps) => (
  <div className="flex items-center justify-center size-10">
    {item.name}
    <Icon name="re-up.ph" className="w-10 h-10 text-foreground shrink-0" />
  </div>
);
