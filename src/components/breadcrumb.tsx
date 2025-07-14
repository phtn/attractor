"use client";

import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  root?: string;
}
export const Breadcrumb = ({ root }: Props) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="flex items-center font-sans lowercase">
      <Link
        href={root ?? "/init"}
        className={cn(
          "w-5 h-4 flex items-center justify-center overflow-visible rounded transition-colors duration-300",
          "text-muted-foreground hover:bg-mac-red/80 hover:text-white",
          "dark:border-0 dark:border-white/60 backdrop-blur-3xl dark:hover:bg-origin/80 dark:bg-mac-gray dark:text-lime-50 dark:hover:text-white ",
          {
            "": root,
          },
        )}
      >
        <Icon name="root-folder" className="size-6 shrink-0" />
      </Link>
      {pathSegments.slice(1).map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        return (
          <div key={href} className="flex items-center space-x-2 first:hidden">
            <Icon
              solid
              name="slash-forward"
              className="ml-4 size-3 text-muted-foreground dark:text-origin"
            />
            <Link
              href={pathSegments.pop() === segment ? "#" : href}
              className={cn(
                "flex items-center leading-none px-2",
                " underline-offset-6 decoration-[0.70px] decoration-transparent",
                "transition-colors duration-500 animate-out:delay-200",
                "text-slate-500 dark:text-slate-700",
                "hover:text-slate-600",
                {
                  "hover:underline hover:decoration-mac-red/80 dark:hover:decoration-origin dark:hover:text-lime-50":
                    !isLast,
                  "text-mac-red dark:text-void dark:bg-lime-50/50 backdrop-blur-xl px-1 py-0.5 rounded-md":
                    isLast,
                },
              )}
            >
              <span className="font-medium font-sans tracking-tight">
                {segment}
              </span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
