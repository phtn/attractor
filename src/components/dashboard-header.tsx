"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";
import GestureSwitch from "./gesture/switch";
import { IconButton } from "./icon-button";
import { Tighty } from "./tighty";

export function DashboardHeader() {
  return (
    <div className="border-b dark:border-origin/40 h-16 ps-4 py-4 flex items-center justify-between">
      <div className="flex items-center w-fit">
        <Brand />
        <Slash />
        <ProjectLinks />
      </div>

      <div className="h-16 flex items-center justify-end">
        <div className="flex gap-x-2 h-full items-center justify-end">
          <IconButton
            solid
            size={24}
            icon="power-tool"
            fn={() => console.log()}
          />
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
    <div className="text-zinc-500 h-full w-8 relative flex items-center justify-center">
      <Icon solid size={16} name="re-up.ph" className="text-origin" />
    </div>
  </Link>
);

const ProjectLinks = () => {
  return (
    <div className="flex items-center w-fit space-x-2">
      <Tighty label="Force" fn={() => console.log()} />
      <div>
        <Icon
          solid
          size={8}
          name="triangle-right"
          className="mx-1.5 text-origin"
        />
      </div>

      <Tighty label="Concept" fn={() => console.log()} />
      <div>
        <Icon
          solid
          size={8}
          name="triangle-right"
          className="mx-1.5 text-origin"
        />
      </div>
      <Icon solid name="root-folder" className="mx-1.5 size-6 text-origin" />
    </div>
  );
};

const Slash = () => (
  <div className="flex items-center">
    <Icon
      solid
      size={20}
      name="slash-forward"
      className="text-origin/50 mx-1"
    />
  </div>
);
