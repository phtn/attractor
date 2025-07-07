import GestureSwitch from "@/components/gesture/switch";
import { Breadcrumb } from "@/app/admin/components/breadcrumb";

export function Header() {
  return (
    <header className="flex items-center bg-gradient-to-r from-cream/60 to-chalk/30 dark:from-transparent/80 dark:to-transparent justify-between px-8">
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <GestureSwitch />
      </div>
    </header>
  );
}
