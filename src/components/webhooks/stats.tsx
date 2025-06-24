"use client";

import { trpc } from "@/trpc/react";
import { useMemo, type JSX } from "react";
import { HyperList } from "../hyper/list";

export const Stats = (): JSX.Element | null => {
  const { data: stats, isLoading, error } = trpc.getStats.useQuery();

  const data = useMemo(
    () =>
      isLoading
        ? [
            {
              label: "loading events",
              value: 0,
            },
          ]
        : error
          ? [
              {
                label: "Error",
                value: 1,
              },
            ]
          : [
              {
                label: "events",
                value: stats?.total,
              },
              {
                label: "success",
                value: stats?.successRate,
              },
              {
                label: "1 hour",
                value: stats?.recentHour,
              },
              {
                label: "today",
                value: stats?.dailyTotal,
              },
            ],
    [stats, isLoading, error],
  );

  return (
    <div className="h-24 relative border-b border-xy">
      <div className="flex items-center rounded-full justify-center w-full absolute z-10 -top-1.5 left-0">
        <button className="h-2.5 flex flex-shrink items-center rounded-full cursor-pointer group/left relative justify-center">
          <div className="rounded-full w-[4.25rem] bg-xy h-1.5 dark:group-hover/left:bg-cyan-400/80 absolute group-hover/left:blur-xs group-hover/left:bg-cyan-600 transition-all duration-700 ease-out" />
          <div className="rounded-full w-16 bg-border h-[3px] group-hover/left:border-t dark:group-hover/left:border-cyan-100 border-cyan-400 dark:group-hover/left:bg-cyan-400 group-hover/left:bg-cyan-500 transition-all duration-300" />
        </button>
        <button className="h-2.5 flex items-center rounded-full cursor-pointer group/center relative justify-center hover:mx-10 mx-6 transition-all duration-500">
          <div className="rounded-full group-hover/center:scale-x-[119%] w-64 bg-zinc-700/90 h-1.5 dark:group-hover/center:bg-cyan-400/50 absolute group-hover/center:blur-xs group-hover/center:bg-cyan-500 transition-all duration-300 ease-in" />
          <div className="rounded-full group-hover/center:scale-x-115 opacity-20 group-hover/center:opacity-100 w-64 h-[3px] dark:group-hover/center:bg-cyan-400/80 group-hover/center:border-t-[0.33px] dark:group-hover/center:border-b dark:group-hover/center:border-cyan-600 border-cyan-400 group-hover/center:bg-cyan-500 transition-all duration-500 ease-out " />
        </button>
        <button className="h-2.5 flex items-center rounded-full cursor-pointer group/right relative justify-center">
          <div className="rounded-full w-[4.25rem] bg-xy h-1.5 dark:group-hover/right:bg-cyan-400/80 absolute group-hover/right:blur-xs group-hover/right:bg-cyan-600 transition-all duration-300" />
          <div className="rounded-full w-16 bg-border h-[3px] group-hover/right:border-t dark:group-hover/right:border-cyan-100 border-cyan-400 dark:group-hover/right:bg-cyan-300 group-hover/right:bg-cyan-500 transition-all duration-300" />
        </button>
      </div>
      <HyperList
        data={data}
        component={StatItem}
        direction="right"
        container="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3 pt-4"
      />
    </div>
  );
};

interface IStat {
  label: string;
  value?: number;
}
const StatItem = ({ label, value = 0 }: IStat) => (
  <div className="bg-card/40 dark:bg-transparent rounded-md space-y-1.5 px-4 py-2">
    <h3 className="text-xs font-medium font-mono uppercase tracking-widest text-muted-foreground">
      {label}
    </h3>
    <p className="text-2xl font-jet text-foreground/80">{value}</p>
  </div>
);
