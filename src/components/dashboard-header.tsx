"use client";

import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import GestureSwitch from "./gesture/switch";
import { IconName } from "@/lib/icons/types";
import { Badge } from "./ui/badge";
import { IconButton } from "./icon-button";

export function DashboardHeader() {
  return (
    <div className="border-b border-xy h-16 ps-4 py-4 flex items-center justify-between">
      <div className="flex items-center w-fit space-x-2">
        <div className="text-zinc-500 h-full w-9 relative flex items-center justify-center">
          <Icon solid size={16} name="re-up.ph" className="text-zinc-500" />
        </div>
        <Slash />
        <div className=" flex justify-center items-center">
          <Badge className="font-medium font-sans text-sm dark:bg-zinc-700 border-zy dark:text-cream">
            Team
          </Badge>
        </div>
        <div>
          <Icon
            solid
            size={8}
            name="triangle-right"
            className="mx-1.5 text-muted-foreground"
          />
        </div>
        <div className=" flex justify-center items-center">
          <Badge className="font-medium font-sans text-sm ">Project</Badge>
        </div>
        <div>
          <Icon
            name="triangle-right"
            size={8}
            className="text-muted-foreground mx-1.5"
            solid
          />
        </div>
        <Icon
          solid
          size={20}
          name="root-folder"
          className="text-muted-foreground"
        />
      </div>

      <div className="h-16 flex items-center justify-end">
        <div className="flex gap-x-2 h-full items-center justify-end">
          <IconButton icon="root-folder" solid fn={() => console.log()} />
          <div className="4order h-16 w-24 flex items-center justify-start">
            <GestureSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolbarItemProps {
  icon?: IconName;
  label?: string;
  type?: "icon" | "text";
}
export const ToolbarItem = ({
  icon,
  label,
  type = "icon",
}: ToolbarItemProps) => (
  <div className="flex justify-center items-center relative w-fit overflow-hidden">
    {/* Primary Interface */}
    <div className="relative">
      {/* Ambient Field */}

      {/* Main Control Surface */}
      <div
        className={cn(
          "group relative flex size-full p-1 items-center border-[0.33px]",
          " shadow-inner/5 select-none dark:bg-transparent",
          " cursor-pointer border-xy/20 ",
          "transition-all duration-300 ease-out",
          "active:scale-95 rounded-md",
          "overflow-hidden",
        )}
      >
        {/* Precision Housing */}
        <div
          className={cn(
            "bg-gradient-to-br relative transition-all duration-700 ease-out",
            "border border-xy dark:border-xy",
            "from-chalk via-cream to-white",
            "dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-600",
            "w-8 h-7 rounded-sm",
            "flex items-center justify-center",
            { "w-fit rounded-sm": type === "text" },
          )}
        >
          {/* Optical Element */}
          {/* <div
          className={cn(
            "absolute h-6 rounded-md bg-linear-to-r from-zinc-300 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900",
            "flex items-center justify-center",
            { "dark:from-zinc-800 dark:to-slate-700": type === "text" },
            "hidden",
          )}
        /> */}

          {/* Pressure Response Overlay */}
          {/* <div
          className={cn(
            "absolute inset-1 rounded-xs border-[0.33px] dark:border-cyan-400/80 overflow-hidden bg-radial-[at_60%_100%] from-zinc-400/40 to-zinc-100/10 dark:from-zinc-500/40 dark:to-zinc-900/10",

            { "opacity-90": type === "text" },
            "hidden",
          )}
        /> */}

          <div
            className={cn(
              "flex items-center bg-gradient-to-r h-full",
              "from-zinc-300/80 via-chalk to-cream",
              "rounded-[3px] border-[0.33px] border-white dark:border-zinc-700",
              "dark:from-zinc-900 dark:via-zinc-800/80 dark:to-zinc-800",
              "",
            )}
          >
            {icon ? (
              <Icon name={icon} size={14} solid className="text-foreground" />
            ) : (
              <span className="px-2.5 font-sans rounded-lg font-medium tracking-tight">
                {label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Slash = () => (
  <div className="flex items-center">
    <Icon
      solid
      size={20}
      name="slash-forward"
      className="text-muted-foreground/25"
    />
  </div>
);
