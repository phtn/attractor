"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Icon, IconName } from "@/lib/icons";
import { icons } from "@/lib/icons/icons";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HyperCard } from "@/components/hyper/card";

export default function IconsPage() {
  const [copiedIcon, setCopiedIcon] = useState<IconName | null>(null);
  const [iconSize, setIconSize] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(
    (name: IconName) => () => {
      const componentString = `<Icon name="${name}" size={${iconSize}} />`;
      navigator.clipboard.writeText(componentString);
      setCopiedIcon(name);

      // Clear existing timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedIcon(null);
        timeoutRef.current = null;
      }, 2000);
    },
    [iconSize],
  );

  // Memoize filtered icons to prevent unnecessary recalculations
  const filteredIcons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return Object.keys(icons).filter((name) =>
      name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <div className="h-[calc(100vh-64px)] overflow-scroll px-6">
      <HyperCard className="absolute z-100 h-16 flex rounded-44 items-center md:w-[calc(86lvw)]">
        <div className="bg-zinc-800 size-full py-3 h-16 flex items-center w-full justify-center">
          <div className="text-2xl  font-bold flex items-center justify-center space-x-4">
            <h1 className="tracking-tighter ">Icons</h1>
            <span
              className={cn(
                "flex font-jet w-8 rounded-md aspect-square bg-mac-blue/10 text-base px-2 text-foreground items-center justify-center",
                { "text-orange-300": filteredIcons.length === 0 },
              )}
            >
              {filteredIcons.length}
            </span>

            <div className="flex items-center justify-center w-full gap-12">
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
              <div className="w-24 flex items-center justify-center">
                {copiedIcon && (
                  <div className="uppercase bg-mac-green dark:text-foreground dark:border-lime-300 dark:bg-transparent border border-transparent  text-cream text-xs px-1 py-0.5 rounded">
                    Copied ✓
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </HyperCard>
      <div className="relative mt-20 z-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:gird-cols-12 gap-4">
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
