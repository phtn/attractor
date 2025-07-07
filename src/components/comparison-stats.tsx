export const ComparisonStats = () => {
  return (
    <div className="w-full max-w-sm rounded-[2.5rem] border dark:border-origin/64 border-accent dark:bg-black/20 bg-radial-[at_20%_40%] from-black/15 to-black/10 px-8 pt-10 pb-7 shadow-sm">
      <div className="mb-10 space-y-3">
        <p className="text-xs font-normal uppercase tracking-wider dark:text-muted-foreground text-cream">
          deliverability
        </p>
        <h2 className="mt-1 text-4xl tracking-tight text-white">Good</h2>
      </div>

      <div className="flex tracking-tight items-center py-2 text-base">
        <div className="size-3 aspect-square flex-shrink-0 rounded-full bg-sky-500" />
        <span className="ml-3 text-base font-medium text-foreground">Sent</span>
        <span className="ml-auto dark:text-muted-foreground">69,486</span>
        <span className="ml-3 font-semibold text-teal-600">86%</span>
      </div>

      <div className="my-3 h-[3px] rounded-full dark:bg-origin/40 bg-muted/60 -mx-3" />

      <div className="flex tracking-tight items-center py-2 text-base">
        <div className="size-3 aspect-square flex-shrink-0 rounded-full bg-teal-600" />
        <span className="ml-3 text-cream/90">Delivered</span>
        <span className="ml-auto dark:text-muted-foreground">22,486</span>
        <span className="ml-3 font-semibold text-teal-600">86%</span>
      </div>
    </div>
  );
};
