import { Brand } from "@/components/brand";
import GestureSwitch from "@/components/gesture/switch";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center">
        <Brand />
        <div className="flex items-center"></div>
      </div>

      <div className="flex items-center gap-2">
        <GestureSwitch />
      </div>
    </header>
  );
}

export const Search = () => (
  <div className="relative">
    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
    <Input
      placeholder="Search designs..."
      className="pl-10 w-80 h-9 bg-gray-50 border-gray-200"
    />
    <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-200 rounded">
      ⌘K
    </kbd>
  </div>
);
