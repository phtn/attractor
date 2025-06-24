import { Icon } from "@/lib/icons";

export function MissionStats() {
  return (
    <div className="p-6 font-jet">
      <h2 className="text-zinc-100 mb-6 tracking-wide">Recents</h2>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="circle" size={10} solid className="text-macd-green" />
            <span className="text-zinc-100">Successful Merge</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-zinc-400 text-xs mb-1">Lines of Code</div>
              <div className="text-2xl text-zinc-100">190</div>
            </div>
            <div>
              <div className="text-zinc-400 text-xs mb-1">
                Medium Risk Mission
              </div>
              <div className="text-2xl text-zinc-100">426</div>
            </div>
            <div>
              <div className="text-zinc-400 text-xs mb-1">Low Risk Mission</div>
              <div className="text-2xl text-zinc-100">920</div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="circle" size={10} solid className="text-macd-red" />
            <span className="text-zinc-100">Merge Conflicts</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-zinc-400 text-xs mb-1">
                High Risk Mission
              </div>
              <div className="text-2xl text-zinc-100">190</div>
            </div>
            <div>
              <div className="text-zinc-400 text-xs mb-1">
                Medium Risk Mission
              </div>
              <div className="text-2xl text-zinc-100">426</div>
            </div>
            <div>
              <div className="text-zinc-400 text-xs mb-1">Low Risk Mission</div>
              <div className="text-2xl text-zinc-100">920</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
