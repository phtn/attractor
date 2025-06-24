import { Icon } from "@/lib/icons";

export function MissionChart() {
  return (
    <div className="border-b border-xy p-6">
      <div className="flex items-center justify-start gap-2">
        <Icon
          solid
          size={16}
          name="pulse"
          className="text-zinc-500 -scale-x-[1]"
        />
        <h2
          className={`text-xs font-bold uppercase font-mono tracking-[0.20em] dark:text-zinc-400/90 text-foreground`}
        >
          code review activity
        </h2>
      </div>

      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 30"
                fill="none"
                stroke="#27272a"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          <text x="10" y="20" className="fill-zinc-500 text-xs">
            500
          </text>
          <text x="10" y="50" className="fill-zinc-500 text-xs">
            400
          </text>
          <text x="10" y="80" className="fill-zinc-500 text-xs">
            300
          </text>
          <text x="10" y="110" className="fill-zinc-500 text-xs">
            200
          </text>

          {/* Main line */}
          <polyline
            fill="none"
            stroke="#71717a"
            strokeWidth="1"
            points="40,80 80,60 120,70 160,50 200,45 240,55 280,40 320,35 360,30"
          />

          {/* Dashed line */}
          <polyline
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
            strokeDasharray="3,3"
            points="40,100 80,105 120,100 160,110 200,105 240,100 280,110 320,105 360,100"
          />

          {/* X-axis labels */}
          <text x="40" y="145" className="fill-zinc-500 text-xs">
            Jan 28, 2025
          </text>
          <text x="320" y="145" className="fill-zinc-500 text-xs">
            Feb 28, 2025
          </text>
        </svg>
      </div>
    </div>
  );
}
