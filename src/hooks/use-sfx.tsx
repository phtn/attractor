import useSound from "use-sound";

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
export const useSFX = () => {
  const opts = {
    volume: 0.35,
    interrupt: true,
  };

  const [sfxSwitchOn] = useSound("/sfx/switch-on.mp3", opts);
  const [sfxSwitchOff] = useSound("/sfx/switch-on.mp3", opts);
  const [sfxToggle] = useSound("/sfx/toggle.mp3", opts);

  return {
    sfxToggle,
    sfxSwitchOn,
    sfxSwitchOff,
  };
};
