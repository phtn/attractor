"use client";

import { Icon } from "@/lib/icons";
import { Events } from "@/components/webhooks/events";
import { GPUFan } from "@/components/gpu";
// import dynamic from "next/dynamic";

// const Blades = dynamic(({on}: {on?: boolean}) => import("@/components/gpu"), {ssr: false})

export function EncryptedChat() {
  return (
    <div className="bg-zinc-300/10 dark:bg-transparent p-4 space-y-4 h-[calc(100vh-48px)] overflow-hidden w-full flex flex-col relative">
      {/* FANS */}
      <div className="flex absolute -space-x-4 right-0 top-0 justify-end items-start">
        <GPUFan on={false} suppressHydrationWarning />
        <GPUFan on={true} suppressHydrationWarning />
      </div>

      {/* WEBHOOKS */}
      <Events />
      {/* CHATS */}
      <div className="flex-1 overflow-y-auto space-y-4 text-xs">
        {chatLogs.map((log, index) => (
          <div key={index} className="space-y-1">
            <div className="text-zinc-500 text-xs"># {log.time}</div>
            {log.messages.map((message, msgIndex) => (
              <div
                key={msgIndex}
                className="text-zinc-400 flex items-start gap-2 font-mono text-xs leading-relaxed"
              >
                <Icon name="triangle-right" size={8} className="opacity-60" />
                <span>{message}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
const chatLogs = [
  {
    time: "2025-06-17 14:23 UTC",
    messages: [
      " [AGENT:gh0stfire] ::: INIT >> ΔΔΔ loading secure channel",
      " CMFZ | 1231.9082456.500...xR3",
      " KEY LOCKED",
      ' MSG >> "...mission override initiated... awaiting delta node clearance"',
    ],
  },
  {
    time: "2025-06-17 14:34 UTC",
    messages: ["> [AGENT:zer0Night] :: RESP >> ...ACK...syncing #546.⚫"],
  },
  {
    time: "2025-06-17 14:37 UTC",
    messages: [
      " [AGENT:bl4ckRaven] ::: relay ⚫ channel 3.2 ...xΔΔ",
      " COMMS STATUS: distorted",
    ],
  },
  {
    time: "2025-06-17 14:39 UTC",
    messages: [
      '> DECRYPT LOG: "requesting visual on suspect-41 triangulating path..."',
      "> SYSTEM WARNING ::: *** UNUSUAL TRAFFIC FROM NODE-6",
      "> attempting firewall reroute ::: [ACCESS CODE 4657...LF]",
      "> backup relay :: standby channel 9-B activated",
    ],
  },
];
