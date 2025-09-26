import { HyperCard } from '@/components/hyper/card'
import { NewCatForm } from './new-cat-form'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/icon-button'

interface Props {
  toggleFn: VoidFunction;
  show: boolean;
}
export const CreateCat = ({ toggleFn, show }: Props) => {
  return (
    <HyperCard
      className={cn(
        'py-6 bg-zinc-300 transition-[max-width,opacity] duration-500 ease-in-out overflow-hidden opacity-0 max-w-0 w-0 pointer-events-none',
        {
          'opacity-100 xl:min-h-[calc(88vh)] px-4 max-w-[42vw] w-full flex-1 overflow-y-auto pointer-events-auto': show,
        }
      )}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl animate-in whitespace-nowrap dark:text-lime-100 fade-in-from-right-40 font-bold font-sans tracking-tight'>
          New Category
        </h2>
        <IconButton
          icon='circle'
          iconStyle='size-4'
          className='border-chalk/20'
          solid
          fn={toggleFn}
        />
      </div>

      <h3 className='-mt-4 mb-4 text-xs font-ox tracking-widest text-muted-foreground uppercase'>
        App Categories
      </h3>
      <NewCatForm toggleForm={toggleFn} />
    </HyperCard>
  )
}
