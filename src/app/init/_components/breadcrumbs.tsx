import { Breadcrumb } from '@/components/breadcrumb'

export const BreadCrumbs = () => (
  <div className='relative max-w-7xl z-40 mx-auto w-full'>
    <div className='h-20 absolute flex w-full bg-zinc-300/0'>
      <div className='px-2 flex items-center h-10 bg-zinc-300/0 w-full'>
        <Breadcrumb root='/' />
      </div>
    </div>
  </div>
)
