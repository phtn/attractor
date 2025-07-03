"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";
import GestureSwitch from "./gesture/switch";
import { IconButton } from "./icon-button";
import { HyperButton } from "./hyper";

export function DashboardHeader() {
  return (
    <div className="border-b border-xy h-16 ps-4 py-4 flex items-center justify-between">
      <div className="flex items-center w-fit">
        <Brand />
        <Slash />
        <ProjectLinks />
      </div>

      <div className="h-16 flex items-center justify-end">
        <div className="flex gap-x-2 h-full items-center justify-end">
          <IconButton
            size={24}
            icon="power-tool"
            solid
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
      <Icon solid size={16} name="re-up.ph" className="text-zinc-500" />
    </div>
  </Link>
);

const ProjectLinks = () => {
  return (
    <div className="flex items-center w-fit space-x-2">
      <HyperButton label="Quantum" fn={() => console.log()} />
      <div>
        <Icon
          solid
          size={8}
          name="triangle-right"
          className="mx-1.5 text-muted-foreground"
        />
      </div>

      <HyperButton label="Professor Sex" fn={() => console.log()} />
      <div>
        <Icon
          name="triangle-right"
          size={8}
          className="text-muted-foreground mx-1.5"
          solid
        />
      </div>
      <Icon
        solid
        size={20}
        name="root-folder"
        className="text-muted-foreground"
      />
    </div>
  );
};

const Slash = () => (
  <div className="flex items-center">
    <Icon
      solid
      size={20}
      name="slash-forward"
      className="text-muted-foreground/30 mx-1"
    />
  </div>
);
