import {
  CPopoverBody,
  CPopoverButton,
  CPopoverContent,
  CPopoverHeader,
  CPopoverRoot,
  CPopoverTrigger,
} from "@/components/ui/cultover";
import { Icon, type IconName } from "@/lib/icons";
import { useCallback, useMemo } from "react";
import { IconifySvg } from "./iconify";
import { type IconEntry } from "./use-get-meta";
import { useCopy } from "@/hooks/use-copy";

interface IAction {
  icon: IconName;
  label: string;
  action: VoidFunction;
}

interface Props {
  title?: string;
  children?: React.ReactNode;
  icon: IconEntry;
  iconSize?: number;
  iconSet?: string;
}

export const QuickActions = ({
  title,
  children,
  icon,
  iconSize,
  iconSet,
}: Props) => {
  const { isCopied, copy } = useCopy({ timeout: 2000 });

  const symbolValue = useMemo(
    () => ({
      [icon.name]: {
        symbol: icon.body
          .replaceAll('"', '"')
          .replaceAll(": ", "`")
          .replaceAll('",', "`,"),
        viewBox: `0 0 ${iconSize} ${iconSize}`,
        set: `${iconSet}`,
      },
    }),
    [icon, iconSet, iconSize],
  );
  const propertySnippet = useMemo(() => {
    const inner = symbolValue[icon.name];
    const innerJson = JSON.stringify(inner, null, 2);
    const prop = JSON.stringify(icon.name);
    return `${prop}: ${innerJson}`;
  }, [symbolValue, icon.name]);

  const copyIconSymbol = useCallback(
    () => copy(icon.name, propertySnippet),
    [propertySnippet, icon.name, copy],
  );

  const actions = useMemo(
    () =>
      [
        {
          icon: isCopied ? "px-check" : "px-copy",
          label: "Copy SVG symbol",
          action: copyIconSymbol,
        },
        {
          icon: "plus",
          label: "Create Icon Set",
          action: () => {},
        },
      ] as IAction[],
    [copyIconSymbol, isCopied],
  );
  return (
    <CPopoverRoot>
      <CPopoverTrigger className="dark:bg-transparent border-none text">
        {children}
      </CPopoverTrigger>
      <CPopoverContent className="z-200 w-52 dark:bg-neutral-700 opacity-100 h-fit">
        <div className="w-full flex items-center pt-4 justify-center size-20">
          <IconifySvg icon={icon} size={64} className=" text-cyan-50" />
        </div>
        <CPopoverHeader className="w-full h-6 text-center">
          <span className=" text-orange-200 font-mono text-xs tracking-wide">
            {title}
          </span>
        </CPopoverHeader>
        <CPopoverBody className="z-60">
          {actions.map((action, index) => (
            <CPopoverButton
              className="text-xs  hover:bg-zinc-200/30 space-x-2"
              key={index}
              onClick={action.action}
            >
              <Icon name={action.icon} className="size-4" />
              <span className="">{action.label}</span>
            </CPopoverButton>
          ))}
        </CPopoverBody>
      </CPopoverContent>
    </CPopoverRoot>
  );
};
