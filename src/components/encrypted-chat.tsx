"use client";

import { Events } from "@/components/webhooks/events";
import { Icon } from "@/lib/icons";
import { GPUFan } from "./gpu";
// import dynamic from "next/dynamic";

// const Blades = dynamic(({on}: {on?: boolean}) => import("@/components/gpu"), {ssr: false})

export function EncryptedChat() {
  return (
    <div className="bg-zinc-300/10 dark:bg-creamy/10 h-[calc(100vh-48px)] overflow-hidden flex flex-col relative pointer-events-auto">
      {/* WEBHOOKS */}
      <Events />
      <div className="fixed -bottom-1 right-1.5 w-fit px-2">
        <div className="flex space-x-2 flex-1 relative overflow-hidden border-slate-200/60 shadow-2xs border-t h-20 rounded-e-xl rounded-tl-xl justify-end items-center bg-muffin dark:bg-gray-600">
          <GPUFan on={false} suppressHydrationWarning />
          <GPUFan on={true} suppressHydrationWarning />
          <GPUFan on={true} suppressHydrationWarning />
        </div>
        <div className="h-2.5 w-24 bg-void ml-2.5 rounded-xs"></div>
        <div className="h-0.5 w-16 bg-orange-200/40 ml-3.5"></div>
      </div>
    </div>
  );
}
export const ChatLogs = () => {
  return (
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
  );
};
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
