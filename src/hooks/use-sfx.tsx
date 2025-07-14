"use client";

import { useCallback } from "react";
import useSound from "use-sound";
import { useToggle } from "./use-toggle";

export type HookOptions<T = unknown> = T & {
  id?: string;
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  sprite?: number[];
  onload?: VoidFunction;
};
/**
 * @name useSFX
 * @returns PlayFunction
 *
 * @example
 * ```typescript
 * // declare hook
 * const {switchOn, switchOff, toggle} = useSFX()
 *
 * // usage
 * const onToggle = useCallback(() => {
 *  toggle()
 * }, [toggle])
 * ```
 * @dependency use-sound by Josh Comeau
 * @link https://github.com/joshwcomeau/use-sound
 */

export const useSFX = ({
  playbackRate,
  volume,
  interrupt,
  soundEnabled,
}: HookOptions) => {
  const { on: up, toggle: toggleFn } = useToggle(false);
  const opts = {
    volume: volume ?? 0.35,
    interrupt: interrupt ?? true,
    playbackRate: playbackRate ?? 0.5,
    soundEnabled: soundEnabled ?? true,
  };

  const [sfxPopOn] = useSound("/sfx/pop-up-on.mp3", opts);
  const [sfxPopOff] = useSound("/sfx/pop-up-off.mp3", opts);
  const [sfxPopDown] = useSound("/sfx/pop-down.mp3", opts);
  const [sfxToggle] = useSound("/sfx/toggle.mp3", {
    // sprite: { dis: [50, 200] },
    volume: 0.2,
    playbackRate: 2.5,
    soundEnabled: true,
    interrupt: true,
  });
  const [sfxTick] = useSound("/sfx/tick.mp3", opts);
  const [sfxStep] = useSound("/sfx/step.mp3", opts);
  const [sfxTech] = useSound("/sfx/tech.wav", opts);
  const [sfxDisable] = useSound("/sfx/disable.mp3", {
    sprite: { dis: [0, 200] },
    playbackRate: 0.3,
  });
  const [sfxEnable] = useSound("/sfx/enable.mp3", opts);
  const [sfxDiamond] = useSound("/sfx/diamond.mp3", opts);
  const [sfxNumbers] = useSound("/sfx/numbers.mp3", {
    sprite: { dis: [0, 120] },
    volume: 0.2,
    playbackRate: 0.8,
  });

  const swipe = useCallback(
    (idx: number) => {
      toggleFn();
      sfxToggle({ playbackRate: idx * (up ? 0.4 : 1.6) });
      // setUp((prev) => !prev);
    },
    [sfxToggle, up, toggleFn],
  );

  return {
    sfxStep,
    sfxTick,
    sfxTech,
    sfxPopOn,
    sfxToggle,
    sfxPopOff,
    sfxEnable,
    sfxDiamond,
    sfxNumbers,
    sfxDisable,
    sfxPopDown,
    up,
    swipe,
  };
};
