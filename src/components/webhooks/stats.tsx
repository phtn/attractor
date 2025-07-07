"use client";

import { HyperList } from "@/components/hyper";
import { useEventsCtx } from "@/ctx/events-ctx";
import { useMemo, type JSX } from "react";

export const Stats = (): JSX.Element | null => {
  const { eventStats } = useEventsCtx();
  const { isLoading, data, error } = eventStats;

  const stats = useMemo(
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
                value: data?.total,
              },
              {
                label: "success",
                value: data?.successRate,
              },
              {
                label: "1 hour",
                value: data?.recentHour,
              },
              {
                label: "today",
                value: data?.dailyTotal,
              },
            ],
    [data, isLoading, error],
  );

  return (
    <HyperList
      data={stats}
      component={StatItem}
      direction="right"
      container="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3"
    />
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
