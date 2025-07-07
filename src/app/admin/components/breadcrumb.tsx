"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  root?: string;
}
export const Breadcrumb = ({ root }: Props) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="flex items-center font-mono lowercase text-sm text-foreground">
      <Link href="/" className="hover:text-mac-blue dark:hover:text-geist-teal">
        {root ?? "app"}
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        return (
          <div key={href} className="flex items-center space-x-4">
            <Icon
              solid
              size={10}
              name="chevron-right"
              className="-mb-0.5 ml-2"
            />
            <Link
              href={href}
              className={` ${
                isLast
                  ? "text-mac-blue dark:text-lime-200"
                  : "hover:text-mac-blue dark:hover:text-lime-200"
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
