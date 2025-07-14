import { Tracer } from "@/app/init/apps/animejs";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export const Loader = () => (
  <div className="size-64 scale-75 relative flex items-start w-full justify-center">
    <div className="size-96 flex flex-col items-center gap-2 justify-center">
      <div className="text-zinc-600 dark:text-zinc-900 font-space min-h-16 aspect-square h-full w-fit relative px-2 flex items-end justify-center space-x-4 size-12">
        <Icon
          solid
          name="re-up.ph"
          className={cn(
            "absolute translate-x-1 origin-center opacity-0",
            "flex size-16",
            "dark:text-emerald-50 dark:scale-105 dark:blur-sm",
            "text-teal-50 blur-sm",
            "opacity-100",
            "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
        <Icon
          solid
          name="re-up.ph"
          className={cn(
            "relative origin-center z-10 size-16",
            "dark:text-white",
            "text-slate-500",
            "transition-colors duration-500 ease-out",
          )}
        />
      </div>
      {/* <Icon
      name="spinners-3-dots-move"
      className="size-6 text-mac-red/80"
      solid
    /> */}
    </div>
    <div className="absolute w-full flex justify-center size-96 -top-12">
      <Tracer />
    </div>
  </div>
);
