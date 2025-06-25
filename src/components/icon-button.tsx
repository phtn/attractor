import { ClassName } from "@/app/types";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: IconName;
  fn: VoidFunction;
  solid?: boolean;
  iconStyle?: ClassName;
  className?: ClassName;
}
export const IconButton = ({
  fn,
  icon,
  className,
  iconStyle,
  solid = false,
}: IconButtonProps) => {
  return (
    <button
      onClick={fn}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap bg-card p-0",
        "transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 size-9",
        "shadow-[0px_0px_0px_1px_theme(colors.black/4%),0_1px_1px_theme(colors.black/5%),0_2px_2px_theme(colors.black/5%),0_2px_4px_theme(colors.black/5%)]",
        "dark:inset-shadow-[0_0.5px_theme(colors.white/15%)] dark:hover:bg-card/80 dark:bg-card-origin/80",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[1rem] [&_svg]:shrink-0",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50",
        "hover:bg-background/80 hover:border-border hover:text-accent-foreground cursor-pointer disabled:cursor-auto",
        "rounded-md border-[0.5px] border-xy",
        className,
      )}
    >
      <Icon
        size={16}
        name={icon}
        solid={solid}
        className={cn("shrink-0 text-muted-foreground", iconStyle)}
      />
    </button>
  );
};
