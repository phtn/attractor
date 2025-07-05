import { HyperButton } from "@/components/hyper";
import { HyperCard } from "@/components/hyper/card";
import { NewCatForm } from "./new-cat-form";
import { cn } from "@/lib/utils";

interface Props {
  toggleFn: VoidFunction;
  show: boolean;
}
export const CreateCat = ({ toggleFn, show }: Props) => {
  return (
    <HyperCard
      className={cn(
        "py-6 w-full min-h-[calc(90lvh)] bg-mask translate-x-40 ease-[cubic-bezier(0.34,1.56,0.64,1)] transition-[max-width] duration-1000",
        "max-w-[0px]",
        { "max-w-[calc(-40vw)] px-4 flex-1 translate-x-0 delay-500": show },
      )}
    >
      <h2 className="text-2xl animate-in whitespace-nowrap fade-in-from-right-40 font-bold font-sans tracking-tight mb-4">
        New Category
      </h2>
      <NewCatForm onSuccess={toggleFn} />
      <HyperButton label="close" icon="close-small" fn={toggleFn} />
    </HyperCard>
  );
};
