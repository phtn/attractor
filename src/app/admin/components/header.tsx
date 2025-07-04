import GestureSwitch from "@/components/gesture/switch";
import { Breadcrumb } from "@/app/admin/components/breadcrumb";

export function Header() {
  return (
    <header className="flex items-center pt-1 -mb-1 bg-gradient-to-r from-chalk/60 to-transparent dark:from-transparent/80 dark:to-transparent justify-between border-b-[0.5px] dark:border-card-origin/40 px-8">
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <GestureSwitch />
      </div>
    </header>
  );
}
