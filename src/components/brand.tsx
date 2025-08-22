import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  label: string;
  dark?: boolean;
}
export const Brand = ({ label, dark = false }: Props) => (
  <Link href={"/"} className="flex items-center w-fit">
    <div className="group/logo text-zinc-600 dark:text-zinc-900 font-space h-full w-fit relative md:px-2 px-2.5 flex items-center justify-center md:space-x-4 space-x-2">
      <Icon
        solid
        name="re-up.ph"
        className={cn(
          "absolute dark:flex hidden md:left-2 left-4 md:top-1.5 top-2",
          " translate-x-0 opacity-90 size-9",
          "group-hover/logo:flex dark:text-zinc-100",
          "dark:group-hover/logo:text-creamy scale-115 dark:scale-105 dark:blur-sm",
          "group-hover/logo:text-teal-50 group-hover/logo:blur-xs group-hover/logo:scale-125",
          "group-hover/logo:translate-x-0 group-hover/logo:opacity-100",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "",
          {
            "dark:group-hover/logo:text-creamy dark:scale-105  dark:blur-sm":
              dark,
          },
        )}
      />
      <Icon
        solid
        name="re-up.ph"
        className={cn(
          "relative z-10 size-8 md:size-9 dark:text-white",
          "dark:group-hover/logo:text-white",
          "text-slate-600 group-hover/logo:text-slate-500",
          "transition-colors duration-300 ease-out",
          { "dark:text-lime-200": dark },
        )}
      />
      <div className={cn("relative md:p-1 p-0.5 rounded-md", "")}>
        <BrandLabel label={label} dark={dark} />
        <div
          className={cn(
            "h-1.5 dark:bg-teal-50 max-w-16 relative bottom-0 blur-sm md:-top-1 left-0 z-0 opacity-90",
            "dark:group-hover/logo:max-w-full group-hover/logo:max-w-full dark:group-hover/logo:opacity-100",
            "transition-all duration-500",
            "ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        />
      </div>
    </div>
  </Link>
);

interface BrandTitleProps {
  dark: boolean;
  label: string;
}

const BrandLabel = ({ dark, label }: BrandTitleProps) => {
  return (
    <h1
      className={cn(
        "text-mac-gray font-sans translate-y-px flex capitalize space-x-0.5 relative z-2",
        "transition-transform duration-500 ease-[cubic-bezier(0,0.55,0.45,1)]",
        "group-hover/logo:translate-y-px group-hover/logo:drop-shadow-xs",
        "text-slate-600 dark:text-slate-700 group-hover/logo:text-slate-500",
        {
          "dark:text-cyan-200 font-mono font-light md:text-lg tracking-tight capitalize":
            dark, // dark
        },
      )}
    >
      <div className="flex items-center justify-center">
        <div className="h-11 w-fit text-slate-700 whitespace-nowrap pe-2 font-medium tracking-tight">
          <span className="font-jet font-medium text-slate-100 drop-shadow-xs dark:text-lime-100 tracking-tight lowercase">
            re-up
            <span className="text-slate-100 dark:text-lime-100 px-px text-[4px]">
              ●
            </span>
            ph
          </span>
          {label
            .split("|")
            .filter((t) => t !== "&")
            .map((text, idx) => (
              <div
                key={text}
                className={cn(
                  "font-space h-5 text-slate-900 dark:text-white flex items-center",
                  {
                    "font-extrabold tracking-tighter text-xl drop-shadow-xs":
                      idx === 0,
                    "font-semibold rounded-xs tracking-tight text-sm dark:text-lime-200 font-space":
                      idx === 1,
                  },
                )}
              >
                {idx === 1
                  ? ""
                  : text.split(" ").map((word, i) => (
                      <span
                        key={word}
                        className={cn({
                          "font-zinc-900 mr-1.5": i === 0,
                        })}
                      >
                        {word}
                      </span>
                    ))}
              </div>
            ))}
        </div>
      </div>
    </h1>
  );
};

export const OldBrand = ({ dark, label }: BrandTitleProps) => (
  <h1
    className={cn(
      "text-mac-gray font-sans translate-y-px md:-pb-2 flex capitalize space-x-1.5 relative z-2",
      "transition-transform duration-500 ease-[cubic-bezier(0,0.55,0.45,1)]",
      "group-hover/logo:translate-y-px group-hover/logo:drop-shadow-xs",
      "text-slate-600 dark:text-slate-700 group-hover/logo:text-slate-500",
      {
        "dark:text-cyan-200 font-mono font-light md:text-lg tracking-tight capitalize":
          dark, // dark
      },
    )}
  >
    {label
      ? label.split(" ").map((w) => (
          <div
            key={w}
            className="first:font-bold flex flex-col tracking-tighter md:text-base text-sm last:font-normal"
          >
            <span>{w}</span>
          </div>
        ))
      : "re-up.ph"}
  </h1>
);
