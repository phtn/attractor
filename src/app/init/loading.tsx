import { Loader } from '@/components/loader'
export default function Loading () {
  return (
    <div className='h-1/2 flex items-center justify-center'>
      <div className='size-full flex items-center w-full justify-center'>
        <Loader />
      </div>
    </div>
  )
}
