"use client";

import { HyperTabs } from "@/components/hyper/tabs";
import AssetGallery from "@/app/init/_c_/asset-gallery";
import { Header } from "@/app/init/_c_/header";

export const Content = () => {
  return (
    <div className="h-screen bg-background flex flex-col w-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden w-full max-w-7xl mx-auto">
        <main className="flex-1 overflow-auto">
          <div className="space-y-10 pb-28">
            <div>
              <HyperTabs />
            </div>
            <AssetGallery category="apps" />
          </div>
        </main>
      </div>

      {/* <PromptInput /> */}
    </div>
  );
};
