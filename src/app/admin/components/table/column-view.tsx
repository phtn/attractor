import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/lib/icons'
import { Column } from '@tanstack/react-table'

interface Props<T> {
  cols: Column<string, keyof T>[];
}
export const ColumnView = <T,>({ cols }: Props<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='bg-background/30 select-none'>
          <Icon name='eye' />
          <span>View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {cols.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className='uppercase text-xs dark:text-cyan-200'
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(event) => event.preventDefault()}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
