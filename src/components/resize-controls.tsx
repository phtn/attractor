import { useResizeCtx } from "@/ctx/resize-ctx";
import { useSFX } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface ResizeControlProps {
  resizeFn: VoidFunction;
  onHover: VoidFunction;
  expanded: boolean;
}
export const ResizeControls = () => {
  const { toggleCenter, centerExpanded, handleToggle } = useResizeCtx();
  const { sfxStep: centerSfx } = useSFX({
    playbackRate: 1.5,
    volume: 0.07,
    interrupt: true,
  });
  const onHover = useCallback(
    (fn: VoidFunction) => () => {
      fn();
    },
    [],
  );
  return (
    <div className="flex items-center rounded-full justify-center w-full absolute z-10 -top-[9.5px] left-0">
      <div className="absolute pointer-events-none w-[32rem] top-2.5 h-1 bg-background" />
      <button
        onClick={handleToggle("left")}
        className="h-6 flex items-center rounded-full bg-transparent cursor-pointer group/left relative justify-center outline-none"
      >
        <div
          className={cn(
            "rounded-full h-1.5 absolute",
            "transition-all duration-700 ease-out",
            "opacity-0 group-hover/left:opacity-100",
            "w-[4.5rem] group-hover/left:scale-115",
            // DARK
            "dark:group-hover/left:bg-teal-300/45",
            "dark:group-hover/left:blur-xs",
            // FOCUS
            "group-focus/right:scale-115",
          )}
        />
        <div
          className={cn(
            "rounded-full h-[0.25rem]",
            "transition-all duration-500",
            "w-16 group-hover/left:scale-x-115",
            // LIGHT
            "bg-rose-700/40 group-hover/left:bg-rose-400/80",
            // DARK
            "dark:bg-teal-800 dark:group-hover/left:bg-geist-teal",
            "dark:group-hover/left:border-geist-teal",
            // FOCUS
            "dark:group-focus/left:bg-geist-teal",
          )}
        />
      </button>
      <CenterResizer
        onHover={onHover(centerSfx)}
        resizeFn={toggleCenter}
        expanded={centerExpanded}
      />
      <button
        onClick={handleToggle("right")}
        className="h-6 flex items-center rounded-full bg-transparent cursor-pointer group/right relative justify-center outline-none"
      >
        <div
          className={cn(
            // BLUR
            "h-[0.25rem] rounded-full absolute",
            "transition-all duration-500 ease-out",
            "group-hover/right:blur-xs",
            "w-[4.5rem] group-hover/right:scale-x-115",
            "opacity-0 group-hover/right:opacity-100",
            // LIGHT
            "group-hover/right:bg-indigo-300/60",
            // DARK
            "dark:group-hover/right:bg-teal-300/45",
            // FOCUS
            "group-focus/right:bg-indigo-300/60",
            "dark:group-focus/right:bg-teal-300/45",
            "group-focus/right:scale-x-115",
            "group-focus/right:opacity-100",
            "group-focus/right:blur-xs",
          )}
        />
        <div
          className={cn(
            "rounded-full w-16 transition-all duration-500",
            "group-hover/right:scale-115",
            // LIGHT
            "bg-blue-600/50 group-hover/right:bg-indigo-400 ",
            // DARK
            "dark:bg-teal-800 h-[0.25rem] dark:group-hover/right:bg-geist-teal",
            "dark:group-hover/left:bg-teal-300/45",
            // FOCUS
            "group-focus/right:bg-indigo-400",
            "dark:group-focus/right:bg-geist-teal",
          )}
        />
      </button>
    </div>
  );
};

const CenterResizer = ({ resizeFn, expanded, onHover }: ResizeControlProps) => (
  // BUTTON
  <button
    onClick={resizeFn}
    onMouseEnter={onHover}
    className={cn(
      "h-6 flex items-center cursor-pointer relative justify-center",
      "hover:mx-10 mx-6 transition-all duration-500",
      "rounded-full group/center outline-none",
    )}
  >
    {/* BLUR */}
    <div
      className={cn(
        "flex item-center",
        "w-[16.5rem] h-1.5 rounded-full absolute",
        "transition-all duration-500 ease-[cubic-bezier(0.45,0,0.55,1)]",
        "opacity-0 group-hover/center:opacity-100",
        // LIGHT
        "group-hover/center:scale-x-[120%]",
        // DARK
        "dark:group-hover/center:bg-teal-400/50",
        "dark:group-hover/center:blur-xs",
        { "dark:blur-xs": expanded },
        // FOCUS
        "dark:group-focus/center:bg-emerald-200/80",
        "dark:group-focus/center:blur-xs",
        "dark:group-focus/center:scale-x-[120%]",
        "",
      )}
    />
    {/* SOLID */}
    <div
      className={cn(
        "rounded-full w-64 h-[0.25rem]",
        "transition-all duration-500 ease-[cubic-bezier(0.45,0,0.55,1)]",
        // LIGHT STYLES
        "bg-gray-400 group-hover/center:scale-x-[120%]",
        "group-hover/center:bg-blue-950/70",
        // DARK STYLES
        "dark:bg-zinc-600 dark:group-hover/center:bg-teal-100",
        {
          "group-hover/center:mx-4 mx-10 scale-x-[120%] dark:bg-teal-50/60":
            expanded,
        },
        // FOCUS
        "group-focus/center:scale-x-[120%] group-focus/center:mx-14",
        "dark:group-focus/center:bg-teal-50 ",
      )}
    />
  </button>
);
