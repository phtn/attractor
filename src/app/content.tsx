"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Repositories } from "@/components/repositories";
import { AgentList } from "@/components/agent-list";
import { PullRequests } from "@/components/pull-requests";
import { MissionChart } from "@/components/mission-chart";
import { EncryptedChat } from "@/components/encrypted-chat";
import { Sandbox } from "@/xdev/sandbox";

export const Content = () => {
  return (
    <main>
      <div className="bg-background font-mono text-sm">
        <div className="border border-double border-xy rounded-b-xl h-screen">
          <DashboardHeader />

          <div className="grid grid-cols-12 gap-0 h-[calc(100vh-50px)] overflow-hidden">
            {/* Left Column */}
            <div className="col-span-3 border-r border-xy">
              <Repositories />
              <AgentList />
            </div>

            {/* Center Column */}
            <div className="col-span-6 border-r border-xy">
              <PullRequests />
              <MissionChart />
              <Sandbox />
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
