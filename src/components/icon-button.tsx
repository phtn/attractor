import { ClassName } from "@/app/types";
import { useSFX } from "@/hooks/use-sfx";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface IconButtonProps {
  icon: IconName;
  fn: VoidFunction;
  size?: number;
  solid?: boolean;
  iconStyle?: ClassName;
  className?: ClassName;
}
export const IconButton = ({
  fn,
  icon,
  className,
  iconStyle,
  size = 16,
  solid = false,
}: IconButtonProps) => {
  const { sfxTick } = useSFX({ playbackRate: 1.25 });
  const handleClick = useCallback(() => {
    sfxTick();
    fn();
  }, [sfxTick, fn]);
  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap bg-card p-0",
        "will-change-transform transition-all duration-300 ease-[cubic-bezier(0.37,0,0.63,1)] active:scale-85",
        "shadow-[0px_0px_0px_1px_theme(colors.black/4%),0_1px_1px_theme(colors.black/5%),0_1px_1px_theme(colors.black/5%),0_2px_4px_theme(colors.black/5%)]",
        "dark:inset-shadow-[0_0.5px_theme(colors.white/15%)] dark:hover:bg-card-origin/80 dark:bg-card-origin/60",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "hover:bg-background/95 hover:border-xy hover:text-accent-foreground dark:hover:border-teal-50/30",
        "transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50",
        "rounded-md border-[0.5px] border-xy/80 dark:border-mac-gray",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 size-8",
        "cursor-pointer disabled:cursor-auto",
        className,
      )}
    >
      <Icon
        size={size}
        name={icon}
        solid={solid}
        className={cn(
          "shrink-0 text-muted-foreground dark:text-teal-50/60",
          iconStyle,
        )}
      />
    </button>
  );
};
