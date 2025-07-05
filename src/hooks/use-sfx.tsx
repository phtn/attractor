import useSound from "use-sound";

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
  const opts = {
    volume: volume ?? 0.35,
    interrupt: interrupt ?? true,
    playbackRate: playbackRate ?? 0.5,
    soundEnabled: soundEnabled ?? true,
  };

  const [sfxPopOn] = useSound("/sfx/pop-up-on.mp3", opts);
  const [sfxPopOff] = useSound("/sfx/pop-up-off.mp3", opts);
  const [sfxPopDown] = useSound("/sfx/pop-down.mp3", opts);
  const [sfxToggle] = useSound("/sfx/toggle.mp3", opts);
  const [sfxTick] = useSound("/sfx/tick.mp3", opts);
  const [sfxStep] = useSound("/sfx/step.mp3", opts);
  const [sfxTech] = useSound("/sfx/tech.wav", opts);
  const [sfxDisable] = useSound("/sfx/disable.mp3", opts);
  const [sfxEnable] = useSound("/sfx/enable.mp3", opts);
  const [sfxDiamond] = useSound("/sfx/diamond.mp3", opts);
  const [sfxNumbers] = useSound("/sfx/numbers.mp3", opts);

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
  };
};
