"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useThemes } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useSFX } from "@/hooks/use-sfx";

// Constants moved outside component to prevent recreation
const GOLDEN_RATIO = 1.618;
const BASE_SIZE = 56;
const HEIGHT = BASE_SIZE / GOLDEN_RATIO;

const SPRING_CONFIG = { stiffness: 400, damping: 30 };
const SCALE_RANGE: [number, number] = [1, 0.96];
const BRIGHTNESS_RANGE: [number, number] = [1, 1.2];
const BLUR_RANGE: [number, number] = [0, 0.5];

export default function GestureSwitch() {
  const { theme, toggleTheme } = useThemes();
  const isDark = useMemo(() => theme === "dark", [theme]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressureLevel, setPressureLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [playbackRate, setPlaybackRate] = useState(isDark ? 0.35 : 1.05);
  const { sfxToggle } = useSFX({ playbackRate });

  // Motion hooks - these need to be called directly, not inside useMemo
  const pressure = useMotionValue(0);
  const springPressure = useSpring(pressure, SPRING_CONFIG);

  // Transform values - these are stable references from framer-motion
  const scale = useTransform(springPressure, SCALE_RANGE, SCALE_RANGE);
  const brightness = useTransform(
    springPressure,
    SCALE_RANGE,
    BRIGHTNESS_RANGE,
  );
  const blur = useTransform(springPressure, SCALE_RANGE, BLUR_RANGE);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    pressure.set(1);
    setPressureLevel(1);
  }, [pressure]);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    pressure.set(0);
    setPressureLevel(0);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Trigger toggle with sophisticated timing
    timeoutRef.current = setTimeout(() => {
      setPlaybackRate(() => (isDark ? 1.1 : 0.35));
      sfxToggle();
      toggleTheme();
      timeoutRef.current = null;
    }, 50);
  }, [pressure, isDark, sfxToggle, toggleTheme]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized style calculations
  const containerStyle = useMemo(
    () => ({
      scale,
      filter: `brightness(${brightness}) blur(${blur}px)`,
      borderRadius: `${HEIGHT * 0.18}px`,
    }),
    [scale, brightness, blur],
  );

  const housingStyle = useMemo(
    () => ({
      width: `${BASE_SIZE}px`,
      height: `${HEIGHT}px`,
      borderRadius: `${HEIGHT * 0.12}px`,
    }),
    [],
  );

  // Memoized class names
  const containerClasses = useMemo(
    () =>
      cn(
        "group flex-1 cursor-pointer border-xy/60 dark:bg-lime-50/15 select-none flex items-center p-2",
        "shadow-[0px_0px_1px_1px_theme(colors.black/4%),0_0px_1px_theme(colors.black/4%),0_1px_2px_theme(colors.black/4%),0_2px_4px_theme(colors.black/6%)]",
      ),
    [],
  );

  const housingClasses = useMemo(
    () =>
      cn(
        "dark:bg-gradient-to-br relative transition-all duration-700 ease-out",
        "dark:from-zinc-900 dark:via-zinc-800/90 dark:to-zinc-800",
        "bg-radial-[at_20%_60%] from-background to-accent",
        "border-[0.5px] border-slate-400 dark:border-zinc-950",
      ),
    [],
  );

  return (
    <div className="flex flex-col justify-center items-start z-100 relative scale-[56%] rotate-180 _py-8 _space-y-12">
      {/* Primary Interface */}
      <div className="relative" ref={containerRef}>
        {/* Main Control Surface */}
        <motion.div
          className={containerClasses}
          style={containerStyle}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          // onMouseLeave={handlePressEnd}
          // onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          whileHover={{ scale: 1.0 }}
        >
          {/* Precision Housing */}
          <div className={housingClasses} style={housingStyle}>
            {/* Optical Element */}
            <motion.div
              className="absolute hidden inset-1 rounded-sm bg-linear-to-r from-zinc-100 to-slate-300 dark:from-zinc-800 dark:to-zinc-900"
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
            <StateIndicator isDark={isDark} baseSize={BASE_SIZE} />

            <PrecisionMarkings isDark={isDark} />

            {/* Pressure Response Overlay */}
            <motion.div
              className="absolute inset-0 rounded-full bg-radial-[at_0%_60%] from-orange-100/20 to-orange-300/10 dark:from-zinc-600/10 dark:to-teal-600/5"
              animate={{
                opacity: pressureLevel,
                scale: 1 + pressureLevel * 0.05,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Haptic Feedback Ring */}
          <motion.div
            className="absolute inset-0 -m-2 rounded-full"
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

// Memoized sub-components to prevent unnecessary re-renders
const StateIndicator = React.memo(
  ({ isDark, baseSize }: { isDark: boolean; baseSize: number }) => {
    const indicatorClasses = useMemo(
      () =>
        cn(
          "absolute bg-radial-[at_15%_65%] rounded-full",
          "top-1/2 left-2 w-1 h-6 -translate-y-1/2",
          "dark:group-hover:bg-gradient-to-t",
          "from-orange-300 to-orange-500",
          "dark:from-teal-200 dark:to-zinc-300/60",
          "dark:border-xy border-[0.33px] border-transparent drop-shadow-2xs",
        ),
      [],
    );

    const animateProps = useMemo(
      () => ({
        x: isDark ? baseSize - 26 : 8,
        opacity: [0.7, 1, 0.7],
      }),
      [isDark, baseSize],
    );

    const transitionProps = useMemo(
      () => ({
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
      }),
      [],
    );

    return (
      <motion.div
        className={indicatorClasses}
        animate={animateProps}
        transition={transitionProps}
      />
    );
  },
);
StateIndicator.displayName = "StateIndicator";

const PrecisionMarkings = React.memo(({ isDark }: { isDark: boolean }) => {
  const markings = useMemo(() => [0, 1], []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex space-x-3 -mr-2 dark:mr-4">
        {markings.map((i) => (
          <motion.div
            key={i}
            className="dark:w-0.5 dark:h-2.5 w-0.5 h-3 rounded-full dark:bg-cream/60 bg-slate-500/60"
            animate={{
              opacity: (isDark ? 1 - i : i) === 1 ? 0.95 : 0.4,
              scaleY: (isDark ? 1 - i : i) === 1 ? 1.2 : 0.8,
            }}
            transition={{
              duration: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
});
PrecisionMarkings.displayName = "PrecisionMarkings";

interface StateProps {
  isDark: boolean;
}
export const State = React.memo(({ isDark }: StateProps) => {
  const modeText = useMemo(
    () => (isDark ? "NIGHT MODE" : "DAY MODE"),
    [isDark],
  );

  return (
    <div className="hidden absolute -bottom-8 left-1/2 -translate-x-1/2">
      <motion.div
        className="text-xs font-mono tracking-wider dark:text-slate-400 text-gray-500"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {modeText}
      </motion.div>
    </div>
  );
});
State.displayName = "State";

export const Efficiency = React.memo(({ isDark }: StateProps) => {
  const efficiencyValue = useMemo(() => (isDark ? "47%" : "94%"), [isDark]);

  return (
    <div className="hidden flex-col items-center space-y-2">
      <div className="text-[10px] font-mono tracking-widest dark:text-slate-500 text-gray-400">
        EFF
      </div>
      <div className="text-xs font-mono dark:text-teal-400 text-amber-600">
        {efficiencyValue}
      </div>
    </div>
  );
});
Efficiency.displayName = "Efficiency";

export const Power = React.memo(({ isDark }: StateProps) => {
  const powerBars = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
  const activeCount = useMemo(() => (isDark ? 2 : 4), [isDark]);
  const headerClass = useMemo(
    () =>
      `text-[10px] font-mono tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`,
    [isDark],
  );

  return (
    <div className="hidden flex-col items-center space-y-2">
      <div className={headerClass}>PWR</div>
      <div className="flex space-x-0.5">
        {powerBars.map((i) => {
          const isActive = i < activeCount;
          // Calculate class name directly without useMemo inside callback
          const barClass = `w-0.5 h-4 ${
            isActive
              ? isDark
                ? "bg-indigo-500"
                : "bg-amber-500"
              : isDark
                ? "bg-slate-700"
                : "bg-gray-300"
          }`;

          return (
            <motion.div
              key={i}
              className={barClass}
              animate={{
                opacity: isActive ? [0.4, 1, 0.4] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
});
Power.displayName = "Power";

export const Sys = React.memo(({ isDark }: StateProps) => {
  const headerClass = useMemo(
    () =>
      `text-[10px] font-mono tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`,
    [isDark],
  );
  const indicatorClass = useMemo(
    () => `w-2 h-2 rounded-full ${isDark ? "bg-indigo-500" : "bg-amber-500"}`,
    [isDark],
  );

  return (
    <div className="hidden flex-col items-center space-y-2">
      <div className={headerClass}>SYS</div>
      <motion.div
        className={indicatorClass}
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
});
Sys.displayName = "Sys";

export const EngrSig = React.memo(() => (
  <div className="hidden text-center">
    <div className="text-[9px] font-mono tracking-[0.20em] drop-shadow-xs dark:text-zinc-400/90 text-foreground">
      PRECISION ENGINEERED
    </div>
  </div>
));
EngrSig.displayName = "EngrSig";
