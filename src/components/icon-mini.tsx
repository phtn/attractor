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
export const IconMini = ({
  fn,
  icon,
  className,
  iconStyle,
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
        'group/btn inline-flex items-center justify-center p-0',
        'will-change-transform transition-all duration-300 ease-[cubic-bezier(0.37,0,0.63,1)] active:scale-85',
        'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'hover:bg-background/30 hover:border-xy',
        'transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50',
        'aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 size-7 aspect-square',
        'cursor-pointer disabled:cursor-auto',
        'relative z-20 rounded-md',
        className
      )}
    >
      <div>
        <Icon
          solid
          name={icon}
          className={cn(
            'absolute shrink-0 z-2 size-4 scale-115 text-creamy/25 dark:text-creamy/80 blur-xs'
          )}
        />
        <Icon
          solid
          name={icon}
          className={cn(
            'relative z-10 shrink-0 size-4 text-muted-foreground group-hover/btn:text-foreground dark:text-creamy dark:group-hover/btn:text-white',
            iconStyle
          )}
        />
      </div>
    </Comp>
  )
}
