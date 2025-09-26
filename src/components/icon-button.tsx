'use client'

import { ClassName } from '@/app/types'
import { Icon, type IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { ComponentProps, MouseEvent, useCallback, useState } from 'react'
import { Slot } from '@radix-ui/react-slot'

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
  asChild?: boolean;
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
  asChild = false,
}: ComponentProps<'button'> & IconButtonProps) => {
  const [_loading, setLoading] = useState(loading)
  const handleClick = useCallback(() => {
    setLoading(true)
    fn()
  }, [fn])

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      disabled={disabled || _loading}
      onClick={handleClick}
      onMouseEnter={onHover}
      className={cn(
        // "will-change-transform transition-all duration-300 ease-[cubic-bezier(0.37,0,0.63,1)] active:scale-85",
        // "shadow-[0px_0px_0px_2px_theme(colors.black/3%),0_1px_2px_theme(colors.black/4%),0_1px_0px_theme(colors.black/4%),0_2px_4px_theme(colors.black/6%)]",
        // "dark:inset-shadow-[0_0.5px_theme(colors.white/15%)]",
        // "text-slate-600 border-[0.33px] dark:hover:bg-card-origin/80 dark:bg-origin/20 _dark:bg-lime-50",
        'relative z-20 group/btn inline-flex items-center justify-center whitespace-nowrap',
        'size-8 aspect-square rounded-full bg-transparent hover:bg-background p-0',
        'dark:border-zinc-600/90 dark:hover:border-zinc-200/0',
        'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50 disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer disabled:cursor-auto',
        className
      )}
    >
      <div>
        <Icon
          name={icon}
          solid={solid}
          className={cn(
            'absolute shrink-0 z-2 size-5 scale-150 text-white/60 dark:text-lime-50/60 blur-xs'
          )}
        />
        <Icon
          solid={solid}
          name={_loading ? 'spinners-ring' : icon}
          className={cn(
            'relative z-10 shrink-0 size-5 text-muted-foreground group-hover/btn:text-foreground dark:text-white dark:group-hover/btn:text-white',
            iconStyle
          )}
        />
      </div>
    </Comp>
  )
}
