"use client";

import { HyperList } from "@/components/hyper";
import { HyperStat, HyperStatProps } from "@/components/hyper/stat";
import { useMemo } from "react";

export const AdminContent = () => {
  const data = useMemo(
    () =>
      [
        {
          group: "general",
          label: "pages",
          desc: "pages",
          value: 0,
          path: "/pages",
          subitems: [
            {
              label: "designs",
              path: "/designs",
              status: "disabled",
              k: "designs",
              v: "/designs",
            },
          ],
        },
        {
          group: "data",
          label: "lists",
          desc: "data",
          value: 0,
          path: "/admin/data/lists/categories",
          subitems: [
            {
              label: "categories",
              path: "categories",
              status: "active",
              k: "categories",
              v: "categories",
            },
          ],
        },
        {
          group: "assets",
          label: "icons",
          desc: "icon list",
          value: 40,
          path: "/admin/assets/icons",
          subitems: [{ label: "icons", path: "icons", k: "icons", v: "icons" }],
        },
        {
          group: "assets",
          label: "images",
          desc: "icon list",
          value: 0,
          path: "/admin/assets/images",
          subitems: [
            { label: "images", path: "images", k: "images", v: "images" },
          ],
        },
      ] as HyperStatProps[],
    [],
  );
  //dark:from-void dark:to-origin/20
  return (
    <div className="px-6 py-4 w-full h-[calc(100lvh-50px)] overflow-scroll bg-radial-[at_42%_69%] from-zinc-500/30 to-card dark:from-background dark:via-background dark:to-void">
      <HyperList
        data={data}
        direction="right"
        component={HyperStat}
        itemStyle="mx-auto w-full flex justify-center"
        container="grid pb-8 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      />
      <div className="px-6">
        {/* <div className="w-full rounded-3xl h-20 flex items-center justify-center border-[0.33px] border-zinc-400 dark:border-origin bg-radial-[at_10%_70%] dark:from-lime-100/80 dark:via-black/30 dark:to-transparent from-black/5 _to-black/5 shadow-sm"></div> */}
        {/* <div className="w-full rounded-2xl h-20 flex items-center justify-center border-[0.33px] dark:border-origin/64 border-zinc-400 dark:bg-black/30 bg-radial-[at_20%_40%] from-black/5 _to-black/5 shadow-sm">
          <span className="tracking-tight text-xs font-medium text-mac-blue underline underline-offset-2"></span>
        </div> */}
      </div>
      <div className="h-4"></div>
    </div>
  );
};
