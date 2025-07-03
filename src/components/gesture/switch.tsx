"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { useThemes } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useSFX } from "@/hooks/use-sfx";

export default function GestureSwitch() {
  const { theme, toggleTheme } = useThemes();
  const isDark = theme === "dark";
  const [isPressed, setIsPressed] = useState(false);
  const [pressureLevel, setPressureLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { sfxToggle } = useSFX({ playbackRate });

  // Physics-based values
  const pressure = useMotionValue(0);
  const springPressure = useSpring(pressure, { stiffness: 400, damping: 30 });

  // Transform pressure into visual effects
  const scale = useTransform(springPressure, [0, 1], [1, 0.96]);
  const brightness = useTransform(springPressure, [0, 1], [1, 1.2]);
  const blur = useTransform(springPressure, [0, 1], [0, 0.5]);

  const handlePressStart = () => {
    setIsPressed(true);
    pressure.set(1);
    setPressureLevel(1);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    pressure.set(0);
    setPressureLevel(0);

    // Trigger toggle with sophisticated timing
    setTimeout(() => {
      setPlaybackRate((value) => value + (isDark ? 0.1 : -0.1));
      sfxToggle();
      toggleTheme();
    }, 50);
  };

  // Golden ratio proportions (1.618)
  const goldenRatio = 1.618;
  const baseSize = 56;
  const height = baseSize / goldenRatio;

  return (
    <div className="flex flex-col justify-center items-start scale-[56%] rotate-180 _py-8 _space-y-12">
      {/* Primary Interface */}
      <div className="relative" ref={containerRef}>
        {/* Main Control Surface */}
        <motion.div
          className={cn(
            "group relative flex-1 cursor-pointer border-xy/60 shadow-inner/15 dark:bg-zinc-950/10 select-none flex border-[0.33px] items-center p-2",
          )}
          style={{
            scale,
            filter: `brightness(${brightness}) blur(${blur}px)`,
            borderRadius: `${height * 0.18}px`,
          }}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          // onMouseLeave={handlePressEnd}
          // onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          whileHover={{ scale: 1.0 }}
        >
          {/* Precision Housing */}
          <div
            className={cn(
              "dark:bg-gradient-to-br relative transition-all duration-700 ease-out",
              "dark:from-zinc-900 dark:via-zinc-800/90 dark:to-zinc-800",
              "bg-gradient-to-r from-white via-cream to-chalk",
              "border-[2px] border-xy",
            )}
            style={{
              width: `${baseSize}px`,
              height: `${height}px`,
              borderRadius: `${height * 0.12}px`,
            }}
          >
            {/* Optical Element */}
            <motion.div
              className="absolute hidden inset-1 rounded-sm bg-linear-to-r from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900"
              animate={{
                opacity: isDark ? [0.3, 0.6, 0.3] : [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* State Indicator */}
            <motion.div
              className={cn(
                "absolute bg-gradient-to-b rounded-full",
                " top-1/2 left-2 w-1 h-6 -translate-y-1/2",
                "dark:group-hover:bg-gradient-to-t",
                "from-orange-200 to-orange-400",
                "dark:from-teal-200 dark:to-zinc-300/60",
                "border-xy border-[0.33px]",
              )}
              animate={{
                x: isDark ? baseSize - 28 : 12,
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
            />

            {/* Precision Markings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-4">
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-0.5 h-3 rounded-full dark:bg-card-origin bg-zinc-400/80`}
                    animate={{
                      opacity: (isDark ? 1 - i : i) === 1 ? 0.8 : 0.3,
                      scaleY: (isDark ? 1 - i : i) === 1 ? 1.2 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Pressure Response Overlay */}
            <motion.div
              className="absolute inset-0 border rounded-full bg-radial-[at_0%_60%] from-orange-100/20 to-orange-300/10 dark:from-zinc-600/10 dark:to-teal-600/5"
              animate={{
                opacity: pressureLevel,
                scale: 1 + pressureLevel * 0.05,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Haptic Feedback Ring */}
          <motion.div
            className="absolute border inset-0 -m-2 rounded-full"
            animate={{
              scale: isPressed ? 1.1 : 1,
              opacity: isPressed ? 0.6 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </div>

      {/* <div className="hidden items-center space-x-8"> */}
      {/* System Status */}
      {/* <State isDark={isDark} /> */}
      {/* Efficiency */}
      {/* <Efficiency isDark={isDark} /> */}
      {/* Power */}
      {/* <Power isDark={isDark} /> */}
      {/* Status Indicator */}
      {/* <Sys isDark={isDark} /> */}
      {/* </div> */}

      {/* Engineering Signature */}
      {/* <EngrSig /> */}
    </div>
  );
}

interface StateProps {
  isDark: boolean;
}
export const State = ({ isDark }: StateProps) => (
  <div className="hidden absolute -bottom-8 left-1/2 -translate-x-1/2">
    <motion.div
      className={`text-xs font-mono tracking-wider dark:text-slate-400 text-gray-500`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {isDark ? "NIGHT MODE" : "DAY MODE"}
    </motion.div>
  </div>
);

export const Efficiency = ({ isDark }: StateProps) => (
  <div className="hidden flex-col items-center space-y-2">
    <div
      className={`text-[10px] font-mono tracking-widest dark:text-slate-500 text-gray-400`}
    >
      EFF
    </div>
    <div className={`text-xs font-mono dark:text-teal-400 text-amber-600`}>
      {isDark ? "47%" : "94%"}
    </div>
  </div>
);

export const Power = ({ isDark }: StateProps) => {
  return (
    <div className="hidden flex-col items-center space-y-2">
      <div
        className={`text-[10px] font-mono tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}
      >
        PWR
      </div>
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-0.5 h-4 ${
              i < (isDark ? 2 : 4)
                ? isDark
                  ? "bg-indigo-500"
                  : "bg-amber-500"
                : isDark
                  ? "bg-slate-700"
                  : "bg-gray-300"
            }`}
            animate={{
              opacity: i < (isDark ? 2 : 4) ? [0.4, 1, 0.4] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Sys = ({ isDark }: StateProps) => {
  return (
    <div className="hidden flex-col items-center space-y-2">
      <div
        className={`text-[10px] font-mono tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}
      >
        SYS
      </div>
      <motion.div
        className={`w-2 h-2 rounded-full ${isDark ? "bg-indigo-500" : "bg-amber-500"}`}
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
};

export const EngrSig = () => (
  <div className="hidden text-center">
    <div
      className={`text-[9px] font-mono tracking-[0.20em] drop-shadow-xs dark:text-zinc-400/90 text-foreground`}
    >
      PRECISION ENGINEERED
    </div>
  </div>
);
