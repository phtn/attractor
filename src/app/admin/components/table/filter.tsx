import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useId } from 'react'
import { Icon } from '@/lib/icons'
import { Badge } from '@/components/ui/badge'

interface Props {
  selected: string[];
  statusCount: Map<string | boolean, number>;
  uniqueValues: Array<string | boolean>;
  onStatusChange: (check: boolean) => (value: string) => void;
}
export const Filter = ({
  selected,
  statusCount,
  uniqueValues,
  onStatusChange,
}: Props) => {
  const baseId = useId()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='relative rounded-md bg-background/30'
        >
          <Icon name='add' />
          <span className='capitalize'>filter</span>
          {selected.length > 0 && (
            <Badge className='absolute rounded-full -top-2.5 left-full size-5 -translate-x-1/2 aspect-square px-1'>
              {selected.length > 99 ? '99+' : selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto min-w-36 p-0' align='start'>
        <div className=''>
          <div className='h-9 flex items-center px-3 italic text-foreground/80 text-xs font-medium'>
            Filters
          </div>
          <div className=''>
            {uniqueValues.map((value, i) => {
              const id = `v-${baseId}-${i}`
              const vStr = String(value)
              const labelText =
                vStr === 'true'
                  ? 'Active'
                  : vStr === 'false'
                    ? 'Inactive'
                    : vStr
              return (
                <div
                  key={id}
                  className='flex px-3 py-2.5 last:pb-3 items-center gap-2 hover:bg-accent'
                >
                  <Checkbox
                    id={id}
                    checked={selected.includes(vStr)}
                    onCheckedChange={(checked) =>
                      onStatusChange(Boolean(checked))(vStr)}
                  />
                  <Label
                    htmlFor={id}
                    className='flex grow justify-between gap-2 font-sans'
                  >
                    {labelText}{' '}
                    <span className='text-muted-foreground ms-2 text-xs'>
                      {statusCount.get(value)}
                    </span>
                  </Label>
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
