export const Hero = () => {
  return (
    <div className='px-4 pt-4 '>
      <div className='dark:bg-card-origin/40 bg-card text-card-foreground flex flex-col rounded-xl py-5 shadow-sm dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] gap-4' />
    </div>
  )
}

interface ActionProps {
  label: string;
  fn: VoidFunction;
}
export const Action = ({ fn, label }: ActionProps) => (
  <button onClick={fn} className='text-center border p-2'>
    <div
      className='text-[9px] uppercase font-mono tracking-[0.20em] drop-shadow-xs dark:text-zinc-400/90 text-foreground'
    >
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
