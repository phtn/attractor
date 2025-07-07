"use client";

import { EncryptedChat } from "@/components/encrypted-chat";
import { HyperCard } from "@/components/hyper/card";
import { Repositories } from "@/components/repositories";
import { ResizeControls } from "@/components/resize-controls";
import { ReviewerHeader } from "@/components/reviewer-header";
import { ReviewerStats } from "@/components/reviewer/main";
import { EventsCtxProvider } from "@/ctx/events-ctx";
import { useResizeCtx } from "@/ctx/resize-ctx";
import { cn } from "@/lib/utils";

export const Content = () => {
  const { centerExpanded, rightExpanded, leftExpanded } = useResizeCtx();
  return (
    <EventsCtxProvider>
      <main className="h-screen bg-radial-[at_30%_10%] from-background to-muted-foreground/50 dark:from-foreground/60 dark:to-card-origin flex flex-col w-screen">
        <div className="border border-origin/30 rounded-b-xl h-screen overflow-hidden">
          <ReviewerHeader />

          <div className="flex flex-[12] justify-center gap-0 h-[calc(100vh-50px)]">
            <div
              className={cn(
                " will-change-transform transition-all duration-500 flex-[4] translate-x-0",
                {
                  "flex-[0] -translate-x-64": leftExpanded,
                },
              )}
            >
              <Repositories />
            </div>
            {/* <LeftSidebar /> */}

            <div
              className={cn(
                "flex-[7] will-change-transform transition-all duration-500 relative",
                {
                  "flex-[7]": centerExpanded,
                  "flex-[8]": rightExpanded,
                },
              )}
            >
              <ResizeControls />
              <div className="flex items-center justify-between w-full">
                <ReviewerStats />
              </div>
            </div>

            <HyperCard
              light
              className={cn(
                "will-change-transform translate-x-0 transition-all duration-500 rounded rounded-tl-[2rem] ",
                { "translate-x-96 origin-right flex-2": centerExpanded },
                { "translate-x-[32rem] flex-1": rightExpanded },
              )}
            >
              <EncryptedChat />
            </HyperCard>
          </div>
        </div>
      </main>
    </EventsCtxProvider>
  );
};
