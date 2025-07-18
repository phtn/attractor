import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  label: string;
  dark?: boolean;
}
export const Brand = ({ label, dark = false }: Props) => (
  <Link href={"/"} className="flex items-center w-fit">
    <div className="group/logo text-zinc-600 dark:text-zinc-900 font-space h-full w-fit relative md:px-2 px-4 flex items-center justify-center md:space-x-4 space-x-2">
      <Icon
        solid
        size={16}
        name="re-up.ph"
        className={cn(
          "absolute dark:flex hidden md:left-2 left-4 md:top-1.5 top-2 translate-x-0 opacity-90",
          "group-hover/logo:flex dark:text-emerald-50",
          "dark:group-hover/logo:text-emerald-50 scale-115 dark:scale-105 dark:blur-sm",
          "group-hover/logo:text-teal-50 group-hover/logo:blur-xs group-hover/logo:scale-125",
          "group-hover/logo:translate-x-0 group-hover/logo:opacity-100",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "",
          {
            "dark:group-hover/logo:text-emerald-50 dark:scale-105  dark:blur-sm":
              dark,
          },
        )}
      />
      <Icon
        solid
        name="re-up.ph"
        className={cn(
          "relative z-10 size-5 dark:text-white",
          "dark:group-hover/logo:text-white",
          "text-slate-600 group-hover/logo:text-slate-500",
          "transition-colors duration-300 ease-out",
          { "dark:text-lime-200": dark },
        )}
      />
      <div
        className={cn(
          "relative px-1 block border border-b-[0.0px] rounded-md",
          "dark:group-hover/logo:border-border group-hover/logo:backdrop-blur-lg",
        )}
      >
        <h1
          className={cn(
            "text-mac-gray font-sans translate-y-px md:-pb-2 flex capitalize space-x-1.5 relative z-2",
            "transition-transform duration-500 ease-[cubic-bezier(0,0.55,0.45,1)]",
            "group-hover/logo:translate-y-px group-hover/logo:drop-shadow-xs",
            "text-slate-600 dark:text-slate-700 group-hover/logo:text-slate-500",
            {
              "dark:text-cyan-200 font-mono font-light md:text-lg tracking-tight capitalize":
                dark,
            },
          )}
        >
          {label
            ? label.split(" ").map((w) => (
                <p
                  key={w}
                  className="first:font-bold tracking-tighter md:text-base text-sm last:font-normal"
                >
                  {w}
                </p>
              ))
            : "re-up.ph"}
        </h1>
        <div
          className={cn(
            "h-2 dark:bg-teal-50 max-w-full relative bottom-0 blur-sm md:-top-1 left-0 z-0 opacity-90",
            "dark:group-hover/logo:max-w-full group-hover/logo:max-w-full dark:group-hover/logo:opacity-100",
            "transition-all duration-500",
            "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
        <div
          className={cn(
            "h-0.5 dark:bg-white max-w-full bg-mac-gray md:-top-2 -top-1 opacity-90 z-2 relative",
            "group-hover/logo:max-w-full group-hover/logo:opacity-100",
            "transition-all duration-500 origin-center rounded-full",
            " ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
      </div>
    </div>
  </Link>
);
