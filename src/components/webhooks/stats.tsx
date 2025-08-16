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
      container="flex justify-around items-center space-x-4"
    />
  );
};

interface IStat {
  label: string;
  value?: number;
}
const StatItem = ({ label, value = 0 }: IStat) => (
  <div className="w-fit">
    <h3 className="whitespace-nowrap text-xs text-muted-foreground text-right font-light font-space uppercase tracking-wider">
      {label}
    </h3>
    <p className="text-lg text-right text-foreground/80 font-space font-semibold">
      {value}
    </p>
  </div>
);
