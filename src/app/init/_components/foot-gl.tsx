"use client";

import { Scene } from "@/components/orbiter/scene";
import { XORGlass } from "@/components/shaders/xor-glass";
import { Icon } from "@/lib/icons";

export const FootGL = () => {
  return (
    <div className="md:absolute fixed bottom-1 flex h-[42lvh] lg:h-[60vh] flex-1 w-full z-0 flex-col items-start justify-start mask-alpha mask-t-from-0% mask-t-to-100% overflow-clip">
      <div className="flex bg-transparent items-start justify-start relative z-2 top-24 lg:top-40">
        <Scene />
      </div>
      <div className="h-[25vh] w-full">
        <XORGlass />
      </div>
      <div className="relative bottom-0 h-20 mx-auto w-full flex items-center lg:max-w-7xl">
        <div className="absolute right-0 flex flex-col items-center">
          <div className="h-fit flex items-center ">
            <Icon
              name="re-up.ph"
              className="size-2.5 text-muted dark:text-chalk opacity-20"
            />
            <Icon
              name="re-up.ph"
              className="size-3 text-muted dark:text-chalk opacity-40"
            />
            <Icon
              name="re-up.ph"
              className="size-3.5 text-muted dark:text-chalk opacity-60"
            />
            <Icon
              name="re-up.ph"
              className="size-4 text-muted dark:text-chalk opacity-80"
            />
          </div>
          <div className="font-space text-[8px] text-muted dark:text-chalk opacity-90">
            re-up.ph
          </div>
        </div>
      </div>
    </div>
  );
};
