import { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { MouseEvent, useCallback } from "react";

interface IconButtonProps {
  icon: IconName;
  fn: VoidFunction;
  size?: number;
  solid?: boolean;
  iconStyle?: ClassName;
  className?: ClassName;
  loading?: boolean;
  disabled?: boolean;
  onHover?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export const IconButton = ({
  fn,
  icon,
  className,
  iconStyle,
  solid = false,
  loading = false,
  disabled = false,
  onHover,
}: IconButtonProps) => {
  const handleClick = useCallback(() => {
    fn();
  }, [fn]);
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={onHover}
      className={cn(
        "group/btn inline-flex items-center justify-center whitespace-nowrap bg-card p-0",
        "will-change-transform transition-all duration-300 ease-[cubic-bezier(0.37,0,0.63,1)] active:scale-85",
        "shadow-[0px_0px_0px_1px_theme(colors.black/4%),0_1px_1px_theme(colors.black/5%),0_1px_1px_theme(colors.black/5%),0_2px_4px_theme(colors.black/5%)]",
        "dark:inset-shadow-[0_0.5px_theme(colors.white/15%)] dark:hover:bg-card-origin/80 dark:bg-lime-50",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "hover:bg-background/95 hover:border-xy hover:text-accent-foreground",
        "dark:border-zinc-100 dark:hover:border-zinc-200",
        "transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50",
        "rounded-sm border border-slate-400/60",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 size-8",
        "cursor-pointer disabled:cursor-auto",
        className,
      )}
    >
      <Icon
        solid={solid}
        name={loading ? "spinners-3-dots-move" : icon}
        className={cn(
          "shrink-0 size-4 text-muted-foreground group-hover/btn:text-foreground dark:text-origin dark:group-hover/btn:text-lime-100",
          iconStyle,
        )}
      />
    </button>
  );
};
