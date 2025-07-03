import { Icon } from "@/lib/icons";
import Link from "next/link";

export const Brand = ({ label }: { label?: string }) => (
  <Link href={"/"} className="flex items-center w-fit">
    <div className="text-zinc-600 dark:text-zinc-400 font-space h-full w-fit relative px-2 flex items-center space-x-8 justify-center">
      <Icon solid size={16} name="re-up.ph" className="" />
      <h1>{label ?? "re-up.ph"}</h1>
    </div>
  </Link>
);
