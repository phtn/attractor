"use client";

import { DirectionAwareTabs, ITab } from "@/components/ui/direction-aware-tabs";

import { Icon } from "@/lib/icons";
import { IconSetCard } from "./_components/cards";

import { useMemo, memo } from "react";

export const Content = () => {
  const tabs = useMemo(
    () =>
      [
        {
          id: 0,
          label: "ICONS",
          content: () => <RenderIcons />,
        },

        {
          id: 1,
          label: "HOOKS",
          content: () => <RenderIcons />,
        },
      ] as ITab[],
    [],
  );

  return (
    <div className="flex border border-zinc-100/50 overflow-hidden w-full h-[70vh] relative rounded-md">
      <div className="absolute top-0 left-0 w-full bg-zinc-100/15 border-b flex items-center h-12 pl-2 pr-4">
        <Icon
          name="power-tool"
          className="size-8 text-zinc-800 -rotate-12 shrink-0"
        />{" "}
        <h1 className="text-xl font-light font-space">
          <span className="tracking-tighter">dev</span>
          <span className="font-extrabold">tools</span>
        </h1>
      </div>
      <DirectionAwareTabs tabs={tabs} />
    </div>
  );
};

const RenderIcons = memo(function RenderIcons() {
  return (
    <div className="bg-neutral-500/20 w-full h-[calc(70lvh)] flex flex-col justify-start items-start py-4 rounded-xs m-[0.33px]">
      <IconSetCard />
    </div>
  );
});
