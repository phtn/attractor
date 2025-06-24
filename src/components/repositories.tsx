import { Icon } from "@/lib/icons";

export function Repositories() {
  return (
    <div className="border-b border-xy p-6 h-[10.5rem] font-jet">
      <div className="flex items-center justify-start gap-2">
        <Icon name="repo" size={14} solid className="text-zinc-500" />
        <h2 className="text-cream leading-none font-bold tracking-wide font-jet">
          Repositories
        </h2>
      </div>

      <div className="grid grid-cols-3 mt-10 gap-4 font-jet">
        <div className="text-center border-zinc-300">
          <div className="text-3xl font-light text-zinc-100 mb-2">190</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-light text-zinc-100 mb-2">990</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-light text-zinc-100 mb-2">290</div>
        </div>
      </div>

      <div className="grid grid-cols-3 tracking-wider gap-4 text-xs text-zinc-500">
        <div className="text-center">Watching</div>
        <div className="text-center">Reviewing</div>
        <div className="text-center">Merged</div>
      </div>
    </div>
  );
}
