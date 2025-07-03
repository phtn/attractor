"use client";

import { useRouter } from "next/navigation";
import { icons } from "@/lib/icons/icons";
import { Icon } from "@/lib/icons";
import { IconName } from "@/lib/icons/types";
import { HyperCard } from "@/components/hyper/card";

interface IAssetSectionItem {
  name: string;
  path: string;
  count: number;
  icon: IconName;
}
const assetSections: IAssetSectionItem[] = [
  {
    name: "Icons",
    path: "/admin/assets/icons",
    count: Object.keys(icons).length,
    icon: "icons",
  },
  {
    name: "Images",
    path: "/admin/assets/images",
    count: 0,
    icon: "images",
  },
];

export default function AssetsPage() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Assets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {assetSections.map((section) => (
          <HyperCard
            key={section.name}
            className="flex flex-col aspect-square items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-accent"
            onClick={() => router.push(section.path)}
          >
            <Icon name={section.icon} solid size={32} />
            <span className="text-lg font-semibold mt-2">{section.name}</span>
            <span className="text-sm text-muted-foreground">
              {section.count} items
            </span>
          </HyperCard>
        ))}
      </div>
    </div>
  );
}
