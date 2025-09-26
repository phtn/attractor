import { Input } from '@/components/ui/input'
import { Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { useId, useRef } from 'react'

interface Props<T> {
  col: Column<string, keyof T>;
}
export const Search = <T,>({ col }: Props<T>) => {
  const { getFilterValue } = col
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  return (
    <div className='relative'>
      <Input
        id={`input-${id}`}
        ref={inputRef}
        className={cn(
          'peer min-w-60 ps-10 bg-zinc-100/80',

          Boolean(getFilterValue()) && 'pe-10'
        )}
        value={(col?.getFilterValue() ?? '') as string}
        onChange={(e) => col?.setFilterValue(e.target.value)}
        placeholder='Search'
        type='text'
        inputMode='text'
        aria-label='Search'
      />
      <div className='text-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
        <Icon
          name='search'
          aria-hidden='true'
          className='size-4 dark:text-chalk/20'
        />
      </div>
      {Boolean(col?.getFilterValue()) && (
        <button
          className='hidden text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 _flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='Clear filter'
          onClick={() => {
            col?.setFilterValue('')
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          <Icon name='close-small' size={16} aria-hidden='true' />
        </button>
      )}
    </div>
  )
}
