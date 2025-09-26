import { HyperCard } from '@/components/hyper/card'
import { EditCatForm } from './edit-cat-form'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/icon-button'
import { Cat } from 'vx/cats/d'

interface Props {
  show: boolean;
  toggleFn: VoidFunction;
  categoryData: Cat | null;
}

export const EditCat = ({ toggleFn, show, categoryData }: Props) => {
  if (!categoryData) return null
  console.log(show)
  return (
    <HyperCard
      className={cn(
        'py-6 bg-mask transition-[max-width,opacity] duration-500 ease-in-out overflow-hidden opacity-0 max-w-0 w-0 pointer-events-none',
        {
          'opacity-100 xl:min-h-[calc(88vh)] px-4 max-w-[40vw] w-full flex-1 overflow-y-auto pointer-events-auto': show,
        }
      )}
    >
      <div className='flex items-center justify-between w-full '>
        <h2 className='text-2xl animate-in whitespace-nowrap dark:text-lime-100 fade-in-from-right-40 font-bold font-sans tracking-tight'>
          Edit Category
        </h2>
        <IconButton
          solid
          icon='circle'
          fn={toggleFn}
          iconStyle='size-4'
          className='border-chalk/20'
        />
      </div>

      <h3 className='-mt-4 mb-4 text-xs font-ox tracking-widest text-muted-foreground uppercase'>
        {categoryData.name}
      </h3>
      <EditCatForm toggleForm={toggleFn} initialData={categoryData} />
    </HyperCard>
  )
}
