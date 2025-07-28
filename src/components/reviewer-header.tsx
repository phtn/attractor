"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";
import GestureSwitch from "./gesture/switch";
import { IconButton } from "./icon-button";
import { Tighty } from "./tighty";
import { useCallback } from "react";
import { onError, onSuccess } from "@/ctx/toast-ctx";

export function ReviewerHeader() {
  const handleToast = useCallback(() => {
    onSuccess("Successful");
  }, []);
  const handleWarn = useCallback(() => {
    onError("Warning");
  }, []);
  return (
    <div className="flex-1 dark:border-origin/40 h-16 ps-4 py-4 flex items-center justify-between">
      <div className="flex items-center w-fit">
        <Brand />
        <Slash />
        <ProjectLinks />
      </div>

      <div className="h-16 flex items-center justify-end">
        <div className="flex gap-x-3 h-full items-center justify-end">
          <IconButton
            solid
            icon="power-tool"
            iconStyle="size-6"
            fn={handleToast}
          />

          <IconButton solid icon="warning" iconStyle="size-5" fn={handleWarn} />
          <div className="h-16 w-fit flex items-center justify-start">
            <GestureSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}

const Brand = () => (
  <Link href={"/"} className="flex items-center w-fit">
    <div className="text-zinc-500 h-full w-6 relative flex items-center justify-center">
      <Icon
        solid
        name="re-up.ph"
        className="text-origin size-5 aspect-square dark:text-zinc-100"
      />
    </div>
  </Link>
);

const ProjectLinks = () => {
  return (
    <div className="flex items-center w-fit space-x-2">
      <Tighty label="Code Reviewer" fn={() => console.log()} />
    </div>
  );
};

const Slash = () => (
  <div className="flex items-center">
    <Icon solid size={20} name="slash-forward" className="text-origin/50" />
  </div>
);
