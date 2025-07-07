"use client";

import { AssetGallery } from "@/app/init/_c_/asset-gallery";
import { Header } from "@/app/init/_c_/header";
import { Breadcrumb } from "@/components/breadcrumb";
import { Scene } from "@/components/orbiter/scene";
import { XORGlass } from "@/components/shaders/xor-glass";
import { Cat } from "vx/cats/d";

interface Props {
  data: Cat[];
}
export const Content = ({ data }: Props) => {
  return (
    <div className="md:h-screen h-fit bg-radial-[at_30%_10%] from-chalk to-sky-200/60 dark:from-foreground/60 dark:to-card-origin dark:bg-background flex flex-col w-screen">
      <Header />

      <main className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="h-20 absolute z-2 flex w-full bg-zinc-300/20">
          <div className="px-4 flex items-center h-10 bg-zinc-300/30 w-full">
            <Breadcrumb root="/" />
          </div>
        </div>
        <AssetGallery category="apps" data={data} />
      </main>
      <div className="md:absolute fixed bottom-0 flex h-[30vh] flex-1 w-full z-0 flex-col items-start justify-start mask-alpha mask-t-from-zinc-200 mask-t-from-88% overflow-clip">
        {/* <div className="relative h-[calc(18vh)] bg-gradient-t from-white/20 to-background/90 z-2 w-full opacity-0 border-[0.33_px] px-4 xl:px-10"></div> */}
        <div className="flex bg-transarent items-start justify-start relative z-2">
          <Scene />
        </div>
        <div className="h-[25vh] dark:opacity-60 bg-gradient-to-t from-white to-black dark:from-transparent dark:to-zinc-400/60">
          <XORGlass />
        </div>
        {/* <SynthGrid angle={65} /> */}
      </div>
    </div>
  );
};
