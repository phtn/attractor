import { memo } from "react";
import { type IconEntry } from "./use-get-meta";
import { type ClassName } from "@/app/types";
import { cn } from "@/lib/utils";
interface IconifySvgProps {
  icon: IconEntry;
  size?: number;
  className?: ClassName;
}
export const IconifySvg = memo(function IconifySvg({
  icon,
  size = 20,
  className,
}: IconifySvgProps) {
  const w = icon.width ?? 24;
  const h = icon.height ?? 24;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
      className={cn("aspect-square shrink-0 text-neutral-800", className)}
    />
  );
});
