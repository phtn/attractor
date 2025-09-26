import { Stats } from '@/components/webhooks/stats'

export const ReviewerStats = () => {
  return (
    <div className='flex p-4 w-full justify-between dark:bg-background dark:backdrop-blur-lg bg-gray-300 rounded-t-lg rounded-b-none'>
      <div className='w-full flex font-mono'>phtn/repo.git</div>
      <div>
        <Stats />
      </div>
    </div>
  )
}

interface ActionProps {
  label: string;
  fn: VoidFunction;
}
export const Action = ({ fn, label }: ActionProps) => (
  <button onClick={fn} className='text-center border p-2'>
    <div className='text-[9px] uppercase font-mono tracking-[0.20em] drop-shadow-xs dark:text-zinc-400/90 text-foreground'>
      {label}
    </div>
  </button>
)

export const Tag = () => (
  <div className='px-8 text-center'>
    <p className='text-gray-600 dark:text-gray-400 font-light tracking-wide'>
      Precision Control Interface
    </p>
    <p className='text-gray-600 max-w-2xl dark:text-gray-400 font-light tracking-wide'>
      <span>
        Illumi navigates the lattice of logic, discerning errors and
        illuminating paths to refined structure, reshaping itself as it gain
        knowledge about the systems design principles. Anchored in a deep well
        of combined programming mastery, with perception unadorned and precise
        engineering strategies.
      </span>
    </p>
  </div>
)
export const Specs = () => {
  return (
    <div className='grid grid-cols-3 gap-8 max-w-md mx-auto pt-8'>
      <div className='text-center space-y-1'>
        <div className='text-xs font-mono uppercase text-gray-400 dark:text-gray-600 tracking-widest'>
          {/* RESPONSE: {sendStatus} */}
        </div>
        <div className='text-sm font-mono text-gray-600 dark:text-gray-400'>
          &lt;50ms
        </div>
      </div>
      <div className='text-center space-y-1'>
        <div className='text-xs font-mono text-gray-400 dark:text-gray-600 tracking-widest'>
          PRECISION
        </div>
        <div className='text-sm font-mono text-gray-600 dark:text-gray-400'>
          ±0.1%
        </div>
      </div>
      <div className='text-center space-y-1'>
        <div className='text-xs font-mono text-gray-400 dark:text-gray-600 tracking-widest'>
          CYCLES
        </div>
        <div className='text-sm font-mono text-gray-600 dark:text-gray-400'>
          10⁶
        </div>
      </div>
    </div>
  )
}
