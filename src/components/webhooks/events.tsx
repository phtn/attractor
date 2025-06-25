"use client";

import type { WebhookEvent } from "@/app/types";
import { useEventsCtx } from "@/ctx/events-ctx";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type JSX } from "react";
import { HyperList } from "../hyper/list";

export const Events = (): JSX.Element => {
  const { events, connectionStatus } = useEventsCtx();

  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <div className="flex items-center justify-start mb-20">
          <Icon name="github" size={12} className="text-muted-foreground" />
          <h2
            className={`text-xs font-semibold ml-2 uppercase font-sans tracking-[0.20em] dark:text-cream text-foreground`}
          >
            Webhook Events
          </h2>
          <Icon
            solid
            name={
              connectionStatus === "connected"
                ? "circle-filled"
                : connectionStatus === "connecting"
                  ? "log-unverified"
                  : "unsupported"
            }
            size={13}
            className={cn("text-macd-red", {
              "text-green-500/90": connectionStatus === "connected",
              "text-macd-orange animate-pulse":
                connectionStatus === "connecting",
            })}
          />
        </div>
      </div>

      <div className="">
        {events.length === 0 ? (
          <div className="text-center py-12">
            No webhook events received yet.
          </div>
        ) : (
          <HyperList
            data={events}
            component={EventItem}
            container="space-y-4 rounded-md h-[calc(100vh-300px)]"
          />
        )}
      </div>
    </div>
  );
};

const EventItem = (event: WebhookEvent) => (
  <div
    key={event.id}
    className={cn(
      "border-[0.33px] p-4 border-red-400 bg-red-50",
      "dark:bg-card/40 dark:border-xy",
      {
        "border-xy bg-card dark:border-zed": event.isValid,
        "border-xy bg-card dark:border-transparent dark:bg-card":
          event.isValid && event.eventType === "push",
      },
      "bg-card dark:bg-card-origin/44 text-card-foreground flex flex-col rounded-xl py-5 shadow-md dark:inset-shadow-[0_0.5px_rgb(255_255_255/0.20)] gap-4",
    )}
  >
    <div className="flex items-start space-y-2 justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon
          solid
          size={event.isValid ? 16 : 16}
          name={
            event.isValid
              ? event.eventType === "push"
                ? "git-commit"
                : "pull-request"
              : "warning"
          }
          className={cn(
            "p-[2px] rounded-md shrink-0 bg-mac-red/10 text-red-400",
            {
              "dark:text-teal-500 text-teal-600 bg-mac-teal/10 dark:bg-teal-200/5":
                event.isValid,
              "dark:text-blue-500 text-blue-500 bg-blue-50":
                event.eventType === "push" && event.isValid,
            },
          )}
        />
        <span
          className={cn(
            "font-bold font-sans uppercase text-red-400 dark:text-red-300/80",
            {
              "text-blue-400 dark:text-blue-400": event.isValid,
              "text-teal-500 dark:text-teal-300":
                event.isValid && event.eventType === "pull_request",
            },
          )}
        >
          {event.eventType.split("_").flat().join(" ")}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="font-medium font-jet text-muted-foreground">
          {event.repository?.split("/").pop()?.trim()}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-muted-foreground/80 font-jet">
          {formatTimestamp(event.timestamp).split(",").shift()?.trim()}
        </span>
        <span className="text-xs ml-2 hidden text-muted-foreground/80 2xl:flex font-jet">
          {formatTimestamp(event.timestamp).split(",").pop()?.trim()}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-9 gap-y-2 gap-x-0 text-sm">
      <div className="flex col-span-6 items-center space-x-4 ">
        <FieldName name="sender" />
        <span className="font-jet tracking-tight">{event.sender}</span>
      </div>

      {event.data.action && (
        <div className="flex cols-span-3 rounded-sm items-center space-x-2 w-fit">
          <FieldName name="action" />
          <span className="font-jet tracking-tight">{event.data.action}</span>
        </div>
      )}

      {event.data.ref && (
        <div className="flex border-t-[0.33px] border-xy border-dotted pt-2 col-span-6 items-center space-x-4">
          <FieldName name="Branch" />
          <span className="font-jet">{event.data.ref?.split("/").pop()}</span>
        </div>
      )}

      {event.data.commitCount !== undefined && (
        <div className="flex border-t-[0.33px] border-xy border-dotted pt-2 col-span-3 items-center space-x-3">
          <FieldName name="commits" />
          <span className="text-blue-400">{event.data.commitCount}</span>
          {event.data.url && (
            <Link href={event.data.url}>
              <Icon name="sync" size={10} className="" />
            </Link>
          )}
        </div>
      )}

      {event.data.pullRequestNumber && (
        <div className="flex border-t-[0.33px] border-xy border-dotted pt-2 col-span-9 items-center space-x-4">
          <FieldName name="pr" />
          <span className="">
            #{event.data.pullRequestNumber} - {event.data.pullRequestTitle}
          </span>
        </div>
      )}
    </div>

    {event.error && (
      <div className="mt-3 p-3 bg-red-300/20 border border-red-300/0 rounded-sm text-sm">
        <strong>Error:</strong> {event.error}
      </div>
    )}
  </div>
);

interface FieldNameProps {
  name: string;
}
const FieldName = ({ name }: FieldNameProps) => (
  <p className="text-muted-foreground uppercase text-xs font-mono tracking-widest">
    {name}
  </p>
);
const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};
