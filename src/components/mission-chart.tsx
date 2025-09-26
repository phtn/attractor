import { Icon } from '@/lib/icons'
import { CSSProperties, useCallback, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'

export function MissionChart () {
  return (
    <div className='p-4'>
      <div className='bg-card dark:bg-card/44 text-card-foreground flex flex-col rounded-xl py-5 shadow-md dark:inset-shadow-[0_0.5px_rgb(255_255_255/0.20)] gap-4'>
        <div className='px-4 flex items-center justify-start gap-2'>
          <Icon
            solid
            size={16}
            name='pulse'
            className='text-zinc-500 -scale-x-[1]'
          />
          <h2
            className='text-xs font-bold uppercase font-mono tracking-[0.20em] dark:text-zinc-400/90 text-foreground'
          >
            code review activity
          </h2>
          <div
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap bg-background p-0',
              'transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 size-8',
              'shadow-[0px_0px_0px_1px_theme(colors.black/4%),0_1px_1px_theme(colors.black/5%),0_2px_2px_theme(colors.black/5%),0_2px_4px_theme(colors.black/5%)]',
              'dark:inset-shadow-[0_1px_theme(colors.white/15%)] dark:hover:bg-card/80 dark:bg-card/64',
              "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
              'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50 border-none',
              'hover:bg-muted/40 hover:text-accent-foreground cursor-pointer disabled:cursor-auto',
              'rounded-md border border-input'
            )}
          >
            <Icon
              name='arrow-small-right'
              solid
              size={16}
              className='shrink-0'
            />
          </div>
        </div>

        <div className='p-4'>
          <HyperTabs />
        </div>
      </div>
    </div>
  )
}

const HyperTabs = () => {
  const [v, setv] = useState('1d')
  const [idx, setidx] = useState(0)

  const onClick = useCallback(
    (i: number) => () => {
      setidx(i)
    },
    []
  )

  return (
    <div>
      <div className='bg-accent dark:bg-background/40 w-fit inline-flex h-9 font-jet rounded-[9px] p-1 shrink-0'>
        <RadioGroup
          dir='ltr'
          onValueChange={setv}
          className={cn(
            'group relative inline-grid grid-cols-5 items-center gap-1.5 font-medium text-xs outline-0',
            'after:transition-[transform, box-shadow] after:duration-300',
            'has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 has-focus-visible:after:ring-[3px]',
            'after:translate-x-[calc(var(--selected-index)*100%)]',
            'after:absolute after:inset-y-0 after:w-1/5 after:rounded-md after:shadow-sm shadow-muted after:bg-white',
            'dark:after:bg-card dark:after:drop-shadow-md dark:after:inset-shadow-[0_0.5px_rgb(255_255_255/0.15)]',
            `--selected-index: ${idx}`,
            ///
            'after:[cubic-bezier(0.12,0,0.39,0)]' /// what is set
            /// after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
            // "ease-[cubic-bezier(0.45,0,0.55,1)]",
            // "ease-[cubic-bezier(0.32,0,0.67,0)]",
            // "ease-[cubic-bezier(0.65,0,0.35,1)]",
            // "ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            // "ease-[cubic-bezier(0.12,0,0.39,0)]", /// ease-in-sine
            // "ease-[cubic-bezier(0.42,0,0.58,1)]", /// ease-in-out
          )}
          style={{ '--selected-index': idx } as CSSProperties}
          defaultValue={v}
        >
          {data.map(({ value }, i) => (
            <Label
              key={value}
              className={cn(
                'relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-1 whitespace-nowrap transition-colors select-none uppercase has-data-[state=unchecked]:text-muted-foreground ',
                { ' text-mac-blue': value === v }
              )}
            >
              {value}
              <RadioGroupItem
                checked={value === v}
                // tabIndex={value !== v ? -1 : 0}
                onClick={onClick(i)}
                value={v}
                className='border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 sr-only'
              />
            </Label>
          ))}

          {/* <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none uppercase text-foreground has-data-[state=unchecked]:text-muted-foreground">
          1y
          <button
            type="button"
            role="radio"
            aria-checked="false"
            data-state="unchecked"
            value="1y"
            data-slot="radio-group-item"
            className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 sr-only"
            id="«Rqhtb»-1y"
            tabIndex={-1}
            data-radix-collection-item=""
          ></button>
        </label> */}
          {/* {v} */}
        </RadioGroup>
      </div>

      <div className='p-8'>
        <span>{v}</span>
      </div>
    </div>
  )
}
const data = [
  {
    value: '1d',
  },
  {
    value: '2w',
  },
  {
    value: '3m',
  },
  {
    value: '4y',
  },
  {
    value: '5D',
  },
]

export const ChartExample = () => (
  <div className='relative h-48'>
    <svg className='w-full h-full' viewBox='0 0 400 150'>
      {/* Grid lines */}
      <defs>
        <pattern id='grid' width='40' height='30' patternUnits='userSpaceOnUse'>
          <path
            d='M 40 0 L 0 0 0 30'
            fill='none'
            stroke='#27272a'
            strokeWidth='0.5'
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)' />

      {/* Y-axis labels */}
      <text x='10' y='20' className='fill-zinc-500 text-xs'>
        500
      </text>
      <text x='10' y='50' className='fill-zinc-500 text-xs'>
        400
      </text>
      <text x='10' y='80' className='fill-zinc-500 text-xs'>
        300
      </text>
      <text x='10' y='110' className='fill-zinc-500 text-xs'>
        200
      </text>

      {/* Main line */}
      <polyline
        fill='none'
        stroke='#71717a'
        strokeWidth='1'
        points='40,80 80,60 120,70 160,50 200,45 240,55 280,40 320,35 360,30'
      />

      {/* Dashed line */}
      <polyline
        fill='none'
        stroke='#3f3f46'
        strokeWidth='1'
        strokeDasharray='3,3'
        points='40,100 80,105 120,100 160,110 200,105 240,100 280,110 320,105 360,100'
      />

      {/* X-axis labels */}
      <text x='40' y='145' className='fill-zinc-500 text-xs'>
        Jan 28, 2025
      </text>
      <text x='320' y='145' className='fill-zinc-500 text-xs'>
        Feb 28, 2025
      </text>
    </svg>
  </div>
)
