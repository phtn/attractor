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
      <main className="bg-gradient-to-t dark:from-zinc-950 dark:via-zinc-950/10 to-background font-mono text-sm w-screen">
        <div className="border border-double border-xy rounded-b-xl h-screen overflow-hidden">
          <DashboardHeader />

          <div className="flex flex-[12] justify-center gap-0 h-[calc(100vh-50px)]">
            {/* Left Column */}
            {/* <div
              className={cn("flex-[2] border-r border-zed", {
                "flex-1": centerExpanded,
              })}
            >
              <Repositories />
              <AgentList />
            </div> */}
            <LeftSidebar />

            {/* Center Column */}
            <div
              className={cn(
                "flex-[7] will-change-transform transition-all duration-500 relative border-r border-zed",
                {
                  "flex-[12]": centerExpanded,
                },
              )}
            >
              <ResizeControls />
              <ReviewerHeader />
            </div>

            {/* Right Column */}
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
