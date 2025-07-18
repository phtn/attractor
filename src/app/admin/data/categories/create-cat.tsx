import { HyperCard } from "@/components/hyper/card";
import { NewCatForm } from "./new-cat-form";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/icon-button";

interface Props {
  toggleFn: VoidFunction;
  show: boolean;
}
export const CreateCat = ({ toggleFn, show }: Props) => {
  return (
    <HyperCard
      className={cn(
        "py-6 w-full xl:min-h-[calc(88lvh)] bg-mask translate-x-40 overflow-y-scroll ease-[cubic-bezier(0.34,1.56,0.64,1)] transition-[max-width] duration-1000",
        "max-w-[0px]",
        { "max-w-[calc(-40vw)] px-4 flex-1 translate-x-0 delay-500": show },
      )}
    >
      <div className="flex items-center justify-between w-full ">
        <h2 className="text-2xl animate-in whitespace-nowrap dark:text-lime-100 fade-in-from-right-40 font-bold font-sans tracking-tight">
          Add New Category
        </h2>
        <IconButton
          icon="circle"
          iconStyle="size-4"
          className="border-chalk/20"
          solid
          fn={toggleFn}
        />
      </div>

      <h3 className="-mt-4 mb-4 text-xs font-ox tracking-widest text-muted-foreground uppercase">
        App Categories
      </h3>
      <NewCatForm onSuccess={toggleFn} />
    </HyperCard>
  );
};
