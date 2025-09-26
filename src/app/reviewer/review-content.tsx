import { RefObject } from 'react'
import { MultiParser } from './new-entry'

interface ReviewContentProps {
  contentRef: RefObject<HTMLDivElement | null>;
  entry: string;
}
export const ReviewContent = ({ contentRef, entry }: ReviewContentProps) => {
  return (
    <div className='dark:bg-background/80 rounded-xs border-t'>
      <div className='h-px w-full bg-gradient-to-r from-transparent via-zinc-800/20 to-zinc-900 blur-sm' />
      {/* <div className="absolute z-0 pointer-events-none -left-1/3 top-10 rounded-full -rotate-90 w-3xl blur-xl opacity-10 size-80 select-none bg-gradient-to-b dark:from-cream/40 dark:via-creamy/40 dark:to-origin"></div> */}
      <div className='relative z-10 bg-background/70 dark:backdrop-blur-xl flex-1 h-[calc(94vh)] overflow-scroll pb-40'>
        <div ref={contentRef} className='p-0.5 max-w-none'>
          <MultiParser markdown={entry} />
        </div>
      </div>
    </div>
  )
}
