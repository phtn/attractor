"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Copy, Heart } from "lucide-react";

const assets = [
  {
    id: 1,
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Desert Landscape",
    className: "col-span-2 row-span-2",
    category: "apps",
  },
  {
    id: 2,
    href: "",
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Launch Day",
    creator: "",
    tags: [],
    description: "",
    className: "col-span-1 row-span-1 dark:bg-zinc-900",
    hasActions: true,
    category: "apps",
  },
  {
    id: 3,
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Architecture Scene",
    className: "col-span-1 row-span-2",
    category: "components",
  },
  {
    id: 4,
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Abstract Form",
    className: "col-span-1 row-span-1",
    category: "templates",
  },
  {
    id: 5,
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Vehicle Model",
    className: "col-span-1 row-span-1",
    category: "themes",
  },
  {
    id: 6,
    image: "https://launch-day-pied.vercel.app/svg/logomark.svg",
    title: "Organic Shape",
    className: "col-span-1 row-span-1",
    category: "other",
  },
];

export default function AssetGallery({ category }: { category: string }) {
  const filteredAssets = assets.filter((asset) => asset.category === category);

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
      {filteredAssets.map((asset) => (
        <Card
          key={asset.id}
          className={`${asset.className} dark:bg-card-origin/40 border-xy relative overflow-hidden group cursor-pointer p-0 hover:shadow-lg transition-shadow shadow-md dark:inset-shadow-[0_0.5px_rgb(255_255_255/0.20)]`}
        >
          {asset.hasActions && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          )}

          {asset.creator && (
            <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
              {asset.creator}
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </Card>
      ))}
    </div>
  );
}
