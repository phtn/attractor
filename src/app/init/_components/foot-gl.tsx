"use client";

import { Scene } from "@/components/orbiter/scene";
import { XORGlass } from "@/components/shaders/xor-glass";
import { motion } from "motion/react";

export const FootGL = () => {
  return (
    <div className="md:absolute fixed bottom-0 flex h-[42lvh] lg:h-[100vh] flex-1 w-full z-0 flex-col items-start justify-start overflow-clip">
      <motion.div
        initial={{ x: -500, y: -180, scale: 1 }}
        animate={{ x: 0, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          delay: 0.5,
          visualDuration: 2.5,
          bounce: 0.3,
        }}
        className="absolute z-2 bottom-24 left-24 lg:bottom-48 flex bg-transparent items-start justify-start"
      >
        <Scene />
      </motion.div>
      <XORGlass />
      <div className="absolute bottom-0 h-20 mx-auto w-full flex items-center lg:max-w-7xl">
        <div className="absolute right-0 flex flex-col items-center">
          <div className="font-space text-[8px] text-muted dark:text-chalk opacity-90">
            re-up.ph
          </div>
        </div>
      </div>
    </div>
  );
};
