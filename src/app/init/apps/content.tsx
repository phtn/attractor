"use client";

import { HyperTabs } from "@/components/hyper/tabs";
import AssetGallery from "@/app/init/_c_/asset-gallery";
import { Header } from "@/app/init/_c_/header";
import { Cat } from "vx/cats/d";
import { SynthGrid } from "@/components/synth";
import { Scene } from "@/components/orbiter/scene";

interface Props {
  data: Cat[];
}
export const Content = ({ data }: Props) => {
  return (
    <div className="h-screen bg-radial-[at_30%_10%] from-background to-muted-foreground/50 dark:from-foreground/60 dark:to-card-origin dark:bg-background flex flex-col w-screen">
      <Header />

      <div className="flex relative z-10 overflow-hidden w-full max-w-7xl mx-auto">
        <main className="flex-1 overflow-auto">
          <div className="space-y-10 pb-28">
            <div>
              <HyperTabs data={data} />
            </div>
            <AssetGallery category="apps" />
          </div>
        </main>
      </div>
      <div className="absolute bottom-0 flex h-[40vh] flex-1 w-full z-0 flex-col items-start justify-start overflow-clip">
        <div className="relative h-[calc(18vh)] bg-background z-2 w-full opacity-0 border-[0.33_px] px-4 xl:px-10"></div>
        <div className="flex justify-start">
          <Scene />
        </div>
        <SynthGrid angle={65} />
      </div>
    </div>
  );
};
