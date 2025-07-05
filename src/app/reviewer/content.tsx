"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { EncryptedChat } from "@/components/encrypted-chat";
import { LeftSidebar } from "@/components/main/left-sidebar";
import { ResizeControls } from "@/components/resize-controls";
import { ReviewerHeader } from "@/components/reviewer/main";
import { EventsCtxProvider } from "@/ctx/events-ctx";
import { useResizeCtx } from "@/ctx/resize-ctx";
import { cn } from "@/lib/utils";

export const Content = () => {
  const { centerExpanded, rightExpanded } = useResizeCtx();
  return (
    <EventsCtxProvider>
      <main className="h-screen bg-radial-[at_30%_10%] from-background to-muted-foreground/50 dark:from-foreground/60 dark:to-card-origin dark:bg-background flex flex-col w-screen">
        <div className="border border-origin/30 rounded-b-xl h-screen overflow-hidden">
          <DashboardHeader />

          <div className="flex flex-[12] justify-center gap-0 h-[calc(100vh-50px)]">
            <LeftSidebar />

            <div
              className={cn(
                "flex-[7] will-change-transform bg-background/25 transition-all duration-500 relative border-r dark:border-origin/40",
                {
                  "flex-[12]": centerExpanded,
                },
              )}
            >
              <ResizeControls />
              <ReviewerHeader />
            </div>

            <div
              className={cn(
                "flex-1 will-change-transform transition-all duration-500",
                { "flex-1": centerExpanded },
                { "flex-[3]": rightExpanded },
              )}
            >
              <EncryptedChat />
            </div>
          </div>
        </div>
      </main>
    </EventsCtxProvider>
  );
};
