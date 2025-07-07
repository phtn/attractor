import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="size-scren bg-background flex items-start w-full justify-center">
      <div className="size-96 flex flex-col items-center gap-2 justify-center">
        <div className="text-zinc-600 dark:text-zinc-900 font-space h-full w-fit relative px-2 flex items-end justify-center space-x-4">
          <Icon
            solid
            size={16}
            name="re-up.ph"
            className={cn(
              "hidden absolute left-2 opacity-0",
              "flex",
              "dark:text-emerald-50 dark:scale-105 dark:blur-sm",
              "text-teal-50 blur-xs scale-115",
              "opacity-100",
              "animate-pulse",
              "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            )}
          />
          <Icon
            solid
            name="re-up.ph"
            className={cn(
              "relative z-10 size-6",
              "dark:text-white",
              "text-mac-gray",
              "transition-colors duration-500 ease-out",
            )}
          />
        </div>
        <Icon
          name="spinners-3-dots-move"
          className="size-6 text-orange-300"
          solid
        />{" "}
      </div>
    </div>
  );
}
