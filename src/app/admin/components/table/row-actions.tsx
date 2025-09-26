import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/lib/icons'
import { Row } from '@tanstack/react-table'
import { useCallback } from 'react'

interface Props<T> {
  row: Row<T>;
  onEditCategory: (category: T) => void;
}

export const RowActions = <T,>({ row, onEditCategory }: Props<T>) => {
  const handleEdit = useCallback(() => {
    onEditCategory(row.original)
  }, [row.original, onEditCategory])

  const handleDelete = useCallback(() => {
    // TODO: Implement delete functionality
    console.log('Delete category:', row.original)
  }, [row.original])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex justify-center'>
          <Button
            size='icon'
            variant='ghost'
            className='shadow-none w-9 rounded-lg cursor-pointer'
            aria-label='More'
          >
            <Icon
              solid
              name='more-vertical'
              className='text-muted-foreground'
            />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleEdit}>
            <Icon name='px-pen' className='size-4 mr-2' />
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icon name='px-pen' className='size-4 mr-2' />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name='px-pen' className='size-4 mr-2' />
            <span>Duplicate</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name='px-pen' className='size-4 mr-2' />
              More
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Icon name='px-pen' className='size-4 mr-2' />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name='px-pen' className='size-4 mr-2' />
                  Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icon name='px-pen' className='size-4 mr-2' />
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive'
          onClick={handleDelete}
        >
          <Icon name='px-pen' className='size-4 mr-2' />
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
