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
        href="/"
        className={cn(
          "",
          "text-muted-foreground hover:text-mac-blue",
          "dark:hover:text-white dark:text-lime-50",
          {
            "": root,
          },
        )}
      >
        <Icon name="root-folder" className="size-5" />
      </Link>
      {pathSegments.slice(1).map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        return (
          <div key={href} className="flex items-center space-x-2 first:hidden">
            <Icon
              solid
              size={10}
              name="slash-forward"
              className="ml-2 text-muted-foreground dark:text-origin"
            />
            <Link
              href={href}
              className={cn(
                "font-semibold text-muted-foreground flex items-center underline-offset-2",
                "dark:text-origin leading-none tracking-tight",
                {
                  "hover:underline hover:decoration-mac-blue dark:hover:decoration-lime-50 dark:hover:text-void":
                    !isLast,
                  "text-mac-blue dark:text-void dark:bg-lime-50/50 backdrop-blur-xl px-1 py-0.5 rounded-md":
                    isLast,
                },
              )}
            >
              <span className="">{segment}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
