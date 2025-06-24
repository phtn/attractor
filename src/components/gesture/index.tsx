import GestureSwitch from "@/components/gesture/switch";

export const LightSwitch = () => {
  return (
    <div className="transition-all py-8 duration-1000 bg-gradient-to-br from-gray-50 via-zinc-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center p-8">
      <div className="text-center space-y-16">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Illumination
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 font-light tracking-wide">
            Precision control interface
          </p>
        </div>

        {/* Main Interface */}
        <GestureSwitch />

        {/* Technical Specifications */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-gray-400 dark:text-gray-600 tracking-widest">
              RESPONSE
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
      </div>
    </div>
  );
};
