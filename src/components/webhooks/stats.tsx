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
    <HyperList
      data={data}
      component={StatItem}
      direction="right"
      container="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
    />
  );
};

interface IStat {
  label: string;
  value?: number;
}
const StatItem = ({ label, value = 0 }: IStat) => (
  <div className="bg-card/40 border-xy border-[0.33px] rounded-md space-y-1.5 px-4 py-2">
    <h3 className="text-xs font-medium font-mono uppercase tracking-widest text-muted-foreground">
      {label}
    </h3>
    <p className="text-2xl font-jet text-foreground/80">{value}</p>
  </div>
);
