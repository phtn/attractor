"use client";

import { useState } from "react";
import { Icon, IconName } from "@/lib/icons";
import { icons } from "@/lib/icons/icons";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function IconsPage() {
  const [copiedIcon, setCopiedIcon] = useState<IconName | null>(null);
  const [iconSize, setIconSize] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = (name: IconName) => () => {
    const componentString = `<Icon name="${name}" size={${iconSize}} />`;
    navigator.clipboard.writeText(componentString);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const filteredIcons = Object.keys(icons).filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <div className="p-4 h-[calc(100vh-64px)] overflow-scroll">
      <div className="flex items-center space-x-12">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center space-x-4">
          <span className="">Icons</span>
          <span
            className={cn(
              "flex font-jet w-8 rounded-md aspect-square bg-accent text-base px-2 text-foreground items-center justify-center",
              { "text-mac-orange": filteredIcons.length === 0 },
            )}
          >
            {filteredIcons.length}
          </span>

          {copiedIcon && (
            <div className="bg-mac-green dark:text-foreground dark:border-mac-green dark:bg-transparent border border-transparent  text-white text-xs px-1 py-0.5 rounded">
              Copied ✓
            </div>
          )}
        </h1>
        <div className="flex items-center gap-12">
          <Input
            className="w-64"
            value={searchQuery}
            placeholder="filter"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Slider
            min={16}
            max={64}
            step={8}
            value={[iconSize]}
            onValueChange={(value) => setIconSize(value[0])}
            className="w-32"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:gird-cols-12 gap-4 mt-4">
        {filteredIcons.map((name) => (
          <div
            key={name}
            className="flex flex-col group aspect-square items-center justify-center p-4 border-[0.33px] border-transparent rounded-lg cursor-pointer hover:bg-accent dark:hover:bg-card-origin/40 hover:border-xy"
            onClick={copyToClipboard(name as IconName)}
          >
            <Icon
              name={name as IconName}
              solid
              size={iconSize}
              className="group-hover:scale-150 transition-transform duration-300"
            />
            <span className="text-xs mt-2 group-hover:translate-y-8 transition-transform duration-300">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
