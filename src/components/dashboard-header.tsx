"use client";

import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import GestureSwitch from "./gesture/switch";
import { IconName } from "@/lib/icons/types";

export function DashboardHeader() {
  return (
    <div className="border-b border-xy h-16 ps-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6 ps-2">
        <div className="text-zinc-500 relative flex items-center justify-center">
          <Icon
            solid
            size={16}
            name="re-up.ph"
            className="text-zinc-500 absolute"
          />
        </div>
        <div className="justify-start items-center flex flex-1 px-2 gap-4">
          <div className="text-cream opacity-90 text-lg tracking-tight">
            re-up.ph
          </div>
          <div className="text-zinc-400 hidden text-sm leading-none font-jet">
            00:00
          </div>
        </div>
      </div>

      <div className="h-16 flex items-center justify-end">
        <div className="flex gap-x-2 h-full items-center justify-end">
          <ToolbarItem icon="git-commit" />
          <ToolbarItem icon="circle" />
          <div className="4order h-16 w-24 flex items-center justify-start">
            <GestureSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolbarItemProps {
  icon: IconName;
  label?: string;
}
const ToolbarItem = ({ icon }: ToolbarItemProps) => (
  <div className="flex flex-col justify-center items-center _py-8 _space-y-12">
    {/* Primary Interface */}
    <div className="relative">
      {/* Ambient Field */}

      {/* Main Control Surface */}
      <div
        className={cn(
          "group relative flex size-fit items-center p-1",
          " shadow-inner/5 select-none dark:bg-zinc-950",
          " cursor-pointer border-xy/20 border-[0.33px]",
          "transition-all duration-300 ease-out",
          "hover:scale-105 rounded-md",
        )}
      >
        {/* Precision Housing */}
        <div
          className={cn(
            "dark:bg-gradient-to-br relative transition-all duration-700 ease-out",
            "dark:from-zinc-900 dark:via-zinc-800/90 dark:to-zinc-800",
            "bg-gradient-to-r from-chalk via-cream to-white",
            "border border-xy",
            "w-8 h-7 rounded-sm",
            "flex items-center justify-center",
          )}
        >
          {/* Optical Element */}
          <div className="absolute h-5 rounded-sm bg-linear-to-r from-zinc-300 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900" />

          <Icon name={icon} size={14} solid className="text-foreground" />

          {/* Pressure Response Overlay */}
          <div className="absolute inset-0.5 rounded-xs border-[0.33px] bg-radial-[at_60%_100%] from-zinc-400/40 to-zinc-100/10 dark:from-zinc-600/10 dark:to-teal-600/5" />
        </div>

        {/* Haptic Feedback Ring */}
        <div className="absolute border-none inset-0 -m-3 rounded-full" />
      </div>
    </div>
  </div>
);
