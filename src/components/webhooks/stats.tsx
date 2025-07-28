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
  <div className="dark:bg-transparent rounded-md px-4 py-3">
    <h3 className="text-xs font-medium font-space uppercase tracking-widest text-foreground">
      {label}
    </h3>
    <p className="text-xl font-space text-foreground/80">{value}</p>
  </div>
);
