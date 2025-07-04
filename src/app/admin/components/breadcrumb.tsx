"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="flex items-center font-mono lowercase text-sm text-foreground">
      <Link href="/" className="hover:text-mac-blue dark:hover:text-geist-teal">
        app
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        return (
          <div key={href} className="flex items-center space-x-4">
            <Icon
              name="chevron-right"
              size={10}
              solid
              className="-mb-0.5 ml-2"
            />
            <Link
              href={href}
              className={` ${
                isLast
                  ? "text-mac-blue dark:text-geist-teal"
                  : "hover:text-mac-blue dark:hover:text-geist-teal"
              }`}
            >
              <span className="">{segment}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
