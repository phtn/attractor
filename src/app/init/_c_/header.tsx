"use client";

import { Brand } from "@/components/brand";
import GestureSwitch from "@/components/gesture/switch";
import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/ui/input";
import { useSFXCtx } from "@/ctx/sfx-ctx";
import { onSuccess } from "@/ctx/toast-ctx";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function Header() {
  const { setSfxState } = useSFXCtx();
  const router = useRouter();
  const handleRoute = useCallback(
    (path: string) => () => {
      router.push(path);
    },
    [router],
  );

  const handleToast = useCallback(() => {
    onSuccess("Successful");
  }, []);

  return (
    <header className="flex items-center justify-between md:py-4 py-2 w-full max-w-7xl mx-auto">
      <div className="flex items-center">
        <Brand label="Secure Servers" />
        <div className="flex items-center"></div>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          solid
          icon="slashes"
          iconStyle="size-4"
          fn={handleRoute("/admin")}
        />
        <IconButton
          solid
          icon="asterisk"
          iconStyle="size-4"
          fn={handleRoute("/reviewer")}
        />
        <IconButton solid icon="warning" iconStyle="size-4" fn={handleToast} />
        <IconButton
          solid
          icon="voice-message"
          iconStyle="size-6"
          fn={setSfxState}
        />
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
      ⌘ K
    </kbd>
  </div>
);
