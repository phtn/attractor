"use client";

import { AgentList } from "@/components/agent-list";
import { DashboardHeader } from "@/components/dashboard-header";
import { EncryptedChat } from "@/components/encrypted-chat";
import { MissionChart } from "@/components/mission-chart";
import { Repositories } from "@/components/repositories";
import { Stats } from "@/components/webhooks/stats";
import { Sandbox } from "@/xdev/sandbox";

export const Content = () => {
  return (
    <main>
      <div className="bg-background font-mono text-sm">
        <div className="border border-double border-xy rounded-b-xl h-screen overflow-hidden">
          <DashboardHeader />

          <div className="grid grid-cols-12 gap-0 h-[calc(100vh-50px)]">
            {/* Left Column */}
            <div className="col-span-2 border-r border-xy">
              <Repositories />
              <AgentList />
            </div>

            {/* Center Column */}
            <div className="col-span-7 border-r border-xy">
              {/* tRPC-powered stats */}
              <Stats />
              <Sandbox />
              <MissionChart />
            </div>

            {/* Right Column */}
            <div className="col-span-3">
              <EncryptedChat />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
