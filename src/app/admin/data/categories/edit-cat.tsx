import { HyperCard } from "@/components/hyper/card";
import { EditCatForm } from "./edit-cat-form";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/icon-button";
import { Cat } from "vx/cats/d";

interface Props {
  show: boolean;
  toggleFn: VoidFunction;
  categoryData: Cat | null;
}

export const EditCat = ({ toggleFn, show, categoryData }: Props) => {
  if (!categoryData) return null;
  console.log(show);
  return (
    <HyperCard
      className={cn(
        "py-6 w-full xl:min-h-[calc(88lvh)] bg-mask translate-x-40 overflow-y-scroll ease-[cubic-bezier(0.34,1.56,0.64,1)] transition-[max-width] duration-1000",
        "max-w-[0px]",
        { "max-w-[calc(40vw)] px-4 flex-1 translate-x-0 delay-500": show },
      )}
    >
      <div className="flex items-center justify-between w-full ">
        <h2 className="text-2xl animate-in whitespace-nowrap dark:text-lime-100 fade-in-from-right-40 font-bold font-sans tracking-tight">
          Edit Category
        </h2>
        <IconButton
          solid
          icon="circle"
          fn={toggleFn}
          iconStyle="size-4"
          className="border-chalk/20"
        />
      </div>

      <h3 className="-mt-4 mb-4 text-xs font-ox tracking-widest text-muted-foreground uppercase">
        {categoryData.name}
      </h3>
      <EditCatForm toggleForm={toggleFn} initialData={categoryData} />
    </HyperCard>
  );
};
