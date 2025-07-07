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
          "hidden absolute md:left-2 left-4 md:top-px top-2 translate-x-3 opacity-0",
          "group-hover/logo:flex",
          "dark:group-hover/logo:text-emerald-50 dark:scale-105 dark:blur-sm",
          "group-hover/logo:text-teal-50 group-hover/logo:blur-xs scale-115",
          "group-hover/logo:translate-x-0 group-hover/logo:opacity-100",
          "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "",
          {
            "dark:group-hover/logo:text-emerald-50 dark:scale-105 dark:blur-sm":
              dark,
          },
        )}
      />
      <Icon
        solid
        name="re-up.ph"
        className={cn(
          "relative z-10 size-5",
          "dark:group-hover/logo:text-white",
          "group-hover/logo:text-mac-gray",
          "transition-colors duration-500 ease-out",
          { "dark:text-lime-200": dark },
        )}
      />
      <div
        className={cn(
          "relative px-1 block border border-b-0 border-transparent rounded-md",
          "dark:group-hover/logo:border-border group-hover/logo:backdrop-blur-lg",
        )}
      >
        <h1
          className={cn(
            "font-sans translate-y-1.5 md:-pb-2 flex capitalize space-x-1.5 relative z-2",
            "group-hover/logo:translate-y-0.5 transition-transform duration-500 ease-[cubic-bezier(0,0.55,0.45,1)]",
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
                  className="first:font-bold tracking-tighter text-sm last:font-normal"
                >
                  {w}
                </p>
              ))
            : "re-up.ph"}
        </h1>
        <div
          className={cn(
            "h-2 dark:bg-teal-50 max-w-0 relative bottom-0 blur-sm left-0 z-0 opacity-50",
            "dark:group-hover/logo:max-w-full group-hover/logo:max-w-full dark:group-hover/logo:opacity-100",
            "transition-all duration-500",
            "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
        <div
          className={cn(
            "h-0.5 dark:bg-white max-w-0 bg-mac-gray md:-top-2 -top-1 opacity-50 z-2 relative",
            "group-hover/logo:max-w-full group-hover/logo:opacity-100",
            "transition-all duration-500 origin-center rounded-full",
            " ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
      </div>
    </div>
  </Link>
);
