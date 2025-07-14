"use client";

import { Scene } from "@/components/orbiter/scene";
import { XORGlass } from "@/components/shaders/xor-glass";

export const FootGL = () => {
  return (
    <div className="md:absolute fixed bottom-0 flex h-[60vh] flex-1 w-full z-0 flex-col items-start justify-start mask-alpha mask-t-from-0% mask-t-to-69% overflow-clip">
      <div className="flex bg-transparent items-start justify-start relative z-2 top-40">
        <Scene />
      </div>
      <div className="h-[25vh] w-full">
        <XORGlass />
      </div>
    </div>
  );
};
