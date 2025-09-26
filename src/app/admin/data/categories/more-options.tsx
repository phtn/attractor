import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { TrashIcon, CircleAlertIcon } from 'lucide-react'

interface Props {
  rows: number;
  deleteRows: VoidFunction;
}
export const MoreOptions = ({ rows, deleteRows }: Props) => {
  return (
    rows > 0 && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='ml-auto' variant='outline'>
            <TrashIcon
              className='-ms-1 opacity-60'
              size={16}
              aria-hidden='true'
            />
            Delete
            <span className='bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium'>
              {rows}
            </span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
            <div
              className='flex size-9 shrink-0 items-center justify-center rounded-full border'
              aria-hidden='true'
            >
              <CircleAlertIcon className='opacity-80' size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                {rows} selected {rows === 1 ? 'row' : 'rows'}.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRows}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  )
}
