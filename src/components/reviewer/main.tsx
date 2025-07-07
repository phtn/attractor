import { GPUFan } from "../gpu";
import { Stats } from "../webhooks/stats";

export const ReviewerStats = () => {
  return (
    <div className="px-4 pt-2 inline-flex w-full">
      <div className="dark:bg-card-origin/40 bg-card text-card-foreground overflow-hidden flex flex-col rounded-xl py-5 shadow-sm dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] gap-4 w-full">
        <div className="flex items-start">
          <Stats />
          <div>
            <div className="h-1 w-16 bg-orange-200/30 -ml-1.5 rounded-full"></div>
            <div className="h-1 w-24 bg-void -ml-1.5 rounded-full"></div>
            <div className="flex flex-1 relative right-2 top-0 border border-slate-200/60 shadow-2xs border-t -space-x-6 h-20 px-0 rounded-tl-xs rounded-tr-xl rounded-b-xl justify-end items-center bg-gray-600 mr-2">
              <GPUFan on={false} suppressHydrationWarning />
              <GPUFan on={true} suppressHydrationWarning />
              <GPUFan on={true} suppressHydrationWarning />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionProps {
  label: string;
  fn: VoidFunction;
}
export const Action = ({ fn, label }: ActionProps) => (
  <button onClick={fn} className="text-center border p-2">
    <div
      className={`text-[9px] uppercase font-mono tracking-[0.20em] drop-shadow-xs dark:text-zinc-400/90 text-foreground`}
    >
      {label}
    </div>
  </button>
);

export const Tag = () => (
  <div className="px-8 text-center">
    <p className="text-gray-600 dark:text-gray-400 font-light tracking-wide">
      Precision Control Interface
    </p>
    <p className="text-gray-600 max-w-2xl dark:text-gray-400 font-light tracking-wide">
      <span>
        Illumi navigates the lattice of logic, discerning errors and
        illuminating paths to refined structure, reshaping itself as it gain
        knowledge about the systems design principles. Anchored in a deep well
        of combined programming mastery, with perception unadorned and precise
        engineering strategies.
      </span>
    </p>
  </div>
);
export const Specs = () => {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8">
      <div className="text-center space-y-1">
        <div className="text-xs font-mono uppercase text-gray-400 dark:text-gray-600 tracking-widest">
          {/* RESPONSE: {sendStatus} */}
        </div>
        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
          &lt;50ms
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className="text-xs font-mono text-gray-400 dark:text-gray-600 tracking-widest">
          PRECISION
        </div>
        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
          ±0.1%
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className="text-xs font-mono text-gray-400 dark:text-gray-600 tracking-widest">
          CYCLES
        </div>
        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
          10⁶
        </div>
      </div>
    </div>
  );
};
