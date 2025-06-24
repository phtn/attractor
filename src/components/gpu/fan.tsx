import type { FanDirection, FanSpeed } from "@/components/gpu";
import { useCallback } from "react";

interface GPUFanProps {
  fanSpeed: FanSpeed;
  fanDirection: FanDirection;
  isOn: boolean;
}

export const GPUFanSVG = ({ fanSpeed, fanDirection, isOn }: GPUFanProps) => {
  const FanBlades = useCallback(
    () => (
      <g
        style={{
          transformOrigin: "100px 100px",
          animation: `spin ${fanSpeed} linear infinite ${fanDirection}`,
        }}
      >
        {/* Generate 9 realistic curved overlapping blades */}
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 360) / 9;
          const radian = (angle * Math.PI) / 180;

          // Create curved blade path that spirals outward
          const innerRadius = 26;
          const outerRadius = 84.5;
          const curveOffset = 0.8; // Controls the curve intensity

          // Start point (inner)
          const x1 = 100 + Math.cos(radian) * innerRadius;
          const y1 = 100 + Math.sin(radian) * innerRadius;

          // End point (outer)
          const x4 = 100 + Math.cos(radian + curveOffset) * outerRadius;
          const y4 = 100 + Math.sin(radian + curveOffset) * outerRadius;

          // Control points for smooth S-curve
          const x2 =
            100 + Math.cos(radian + curveOffset * 0.3) * (innerRadius + 15);
          const y2 =
            100 + Math.sin(radian + curveOffset * 0.3) * (innerRadius + 15);

          const x3 =
            100 + Math.cos(radian + curveOffset * 0.7) * (outerRadius - 15);
          const y3 =
            100 + Math.sin(radian + curveOffset * 0.7) * (outerRadius - 15);

          // Blade width points
          const widthOffset = 0.24;
          const x1b = 100 + Math.cos(radian - widthOffset) * innerRadius;
          const y1b = 100 + Math.sin(radian - widthOffset) * innerRadius;

          const x4b =
            100 + Math.cos(radian + curveOffset - widthOffset) * outerRadius;
          const y4b =
            100 + Math.sin(radian + curveOffset - widthOffset) * outerRadius;

          const x2b =
            100 +
            Math.cos(radian + curveOffset * 0.3 - widthOffset) *
              (innerRadius + 15);
          const y2b =
            100 +
            Math.sin(radian + curveOffset * 0.3 - widthOffset) *
              (innerRadius + 15);

          const x3b =
            100 +
            Math.cos(radian + curveOffset * 0.7 - widthOffset) *
              (outerRadius - 15);
          const y3b =
            100 +
            Math.sin(radian + curveOffset * 0.5 - widthOffset) *
              (outerRadius - 10);

          return (
            <g key={i}>
              {/* Main blade with gradient */}
              <path
                d={`M ${x1.toFixed(3)} ${y1.toFixed(3)} C ${x2.toFixed(3)} ${y2.toFixed(3)} ${x3.toFixed(3)} ${y3.toFixed(3)} ${x4.toFixed(3)} ${y4.toFixed(3)} L ${x4b.toFixed(3)} ${y4b.toFixed(3)} C ${x3b.toFixed(3)} ${y3b.toFixed(3)} ${x2b.toFixed(3)} ${y2b.toFixed(3)} ${x1b.toFixed(3)} ${y1b.toFixed(3)} Z`}
                fill={
                  i % 6 === 0 ? "url(#bladeGradient2)" : "url(#bladeGradient2)"
                }
                stroke="#202023"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.50"
              />

              {/* Blade highlight for 3D effect */}
              <path
                d={`M ${x1.toFixed(3)} ${y1.toFixed(3)} C ${x2.toFixed(3)} ${y2.toFixed(3)} ${x3.toFixed(3)} ${y3.toFixed(3)} ${x4.toFixed(3)} ${y4.toFixed(3)}`}
                fill="none"
                stroke="#52525b"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </g>
          );
        })}
      </g>
    ),
    [fanDirection, fanSpeed],
  );

  return (
    <div className="flex justify-center scale-[25%]">
      <div className="relative">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-lg"
        >
          {/* Define gradients for 3D effect */}
          <defs>
            <radialGradient id="bladeGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#666" />
              <stop offset="50%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#18181b" />
            </radialGradient>
            <radialGradient id="bladeGradient2" cx="0.7" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#555" />
              <stop offset="50%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#111" />
            </radialGradient>
            <radialGradient id="hubGradient" cx="0.3" cy="0.3" r="1">
              <stop offset="0%" stopColor="#222" />
              <stop offset="70%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
          </defs>

          {/* Outer ring/housing */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="#18181b"
            stroke="#1a1a1a"
            strokeWidth="3"
          />

          {/* Inner ring */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="#10101b"
            stroke="#404040"
            strokeWidth="1"
            className="relative z-10"
          />
          <FanBlades />

          {/* Center hub with realistic design */}
          <circle
            cx="100"
            cy="100"
            r="25"
            fill="url(#hubGradient)"
            stroke="#52525b"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
          />

          {/* Center logo area */}
          <circle
            cx="100"
            cy="100"
            r="15"
            fill="#2a2a2a"
            stroke="#666"
            strokeWidth="1"
          />

          {/* Brand text (simplified) */}
          <text
            x="100"
            y="102"
            textAnchor="middle"
            fontSize="6"
            fill="#888"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            AXIAL
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fontSize="4"
            fill="#666"
            fontFamily="Arial, sans-serif"
          >
            COOLING
          </text>

          {/* Center LED indicator */}
          <circle cx="100" cy="100" r="2" fill={isOn ? "#00ff41" : "#333"} />

          {/* Mounting points */}
          <circle
            cx="25"
            cy="25"
            r="5"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />
          <circle
            cx="175"
            cy="25"
            r="5"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />
          <circle
            cx="25"
            cy="175"
            r="5"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />
          <circle
            cx="175"
            cy="175"
            r="5"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />

          {/* Additional housing details */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="#18181b"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Inner Circle Overlap */}
          <circle
            cx="100"
            cy="100"
            r="84"
            fill="none"
            stroke="#202023"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};
