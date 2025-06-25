import { useResizeCtx } from "@/ctx/resize-ctx";
import { cn } from "@/lib/utils";

interface ResizeControlProps {
  resizeFn: VoidFunction;
  expanded: boolean;
}
export const ResizeControls = () => {
  const { toggleLeft, toggleRight, toggleCenter, centerExpanded } =
    useResizeCtx();
  return (
    <div className="flex items-center rounded-full justify-center w-full absolute z-10 -top-2 left-0">
      <button
        onClick={toggleLeft}
        className="h-3.5 flex items-center rounded-full bg-transparent cursor-pointer group/left relative justify-center outline-none"
      >
        <div className="rounded-full w-[4.5rem] h-1.5 dark:group-hover/left:bg-teal-400/80 absolute dark:group-hover/left:blur-xs group-hover/left:bg-mac-teal transition-all duration-700 ease-out opacity-0 group-hover/left:opacity-100" />
        <div className="rounded-full w-16 dark:bg-teal-700 h-[0.30rem] group-hover/left:border-t group-hover/left:border-x dark:group-hover/left:border-cyan-100 dark:group-hover/left:bg-teal-400 group-hover/left:bg-mac-teal transition-all duration-500 group-focus/left:bg-mac-blue" />
      </button>
      <CenterResizer resizeFn={toggleCenter} expanded={centerExpanded} />
      <button
        onClick={toggleRight}
        className="h-3.5 flex items-center rounded-full bg-transparent cursor-pointer group/right relative justify-center outline-none"
      >
        <div className="rounded-full w-[4.5rem] h-1.5 dark:group-hover/right:bg-teal-400/80 absolute dark:group-hover/right:blur-xs group-hover/right:bg-mac-teal transition-all duration-700 ease-out opacity-0 group-hover/right:opacity-100" />
        <div
          className={cn(
            "rounded-full w-16 transition-all duration-500",
            " group-hover/right:border-t group-hover/right:border-x group-hover/right:bg-mac-teal",
            "dark:bg-teal-700 h-[0.30rem] dark:group-hover/right:border-cyan-100 dark:group-hover/right:bg-teal-400",
            "group-focus/right:bg-mac-blue dark:group-focus/right:bg-mac-blue",
          )}
        />
      </button>
    </div>
  );
};

const CenterResizer = ({ resizeFn, expanded }: ResizeControlProps) => (
  // BUTTON
  <button
    onClick={resizeFn}
    className={cn(
      "h-3.5 flex items-center cursor-pointer relative justify-center",
      "hover:mx-10 mx-6 transition-all duration-500",
      "rounded-full group/center outline-none",
    )}
  >
    {/* BLUR */}
    <div
      className={cn(
        "flex item-center",
        "w-[16.5rem] h-1.5 rounded-full absolute",
        "transition-all duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]",
        "opacity-20 group-hover/center:opacity-100",
        // LIGHT
        "group-hover/center:scale-x-115",
        // DARK
        "dark:group-hover/center:bg-teal-400/50",
        "dark:group-hover/center:blur-xs",
        { "dark:blur-xs": expanded },
        // FOCUS
        "dark:group-focus/center:bg-emerald-200/80",
        "dark:group-focus/center:blur-xs dark:group-focus/center:opacity-100",
        "dark:group-focus/center:scale-x-115",
        "",
      )}
    />
    {/* SOLID */}
    <div
      className={cn(
        "rounded-full bg-zinc-400 w-64 h-[0.25rem]",
        "transition-all duration-500 ease-out",
        // LIGHT STYLES
        "group-hover/center:scale-x-115",
        "group-hover/center:bg-zinc-600 group-hover/right:border-t",
        // DARK STYLES
        "dark:group-hover/center:bg-teal-100",
        "dark:group-hover/center:border-teal-50 dark:group-hover/center:border-t",
        {
          "group-hover/center:mx-2 mx-10 scale-x-115 dark:bg-teal-50/60 dark:border-t dark:border-teal-100":
            expanded,
        },
        // FOCUS
        "group-focus/center:scale-x-115 group-focus/center:mx-10",
        "dark:group-focus/center:bg-teal-50 dark:group-focus/center:border-white",
      )}
    />
  </button>
);
